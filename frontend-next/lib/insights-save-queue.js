const DEFAULT_RETRY_DELAYS = Object.freeze([0, 250, 750]);

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function retryable(error) {
  return !['expired', 'unavailable', 'conflict', 'rejected'].includes(error?.code);
}

export function createOrderedSaveQueue({ initialItems = [], persist, save, onEvent = () => {}, retryDelays = DEFAULT_RETRY_DELAYS }) {
  let items = [...initialItems];
  let active = null;
  let blocked = false;

  const store = () => persist([...items]);

  async function run() {
    if (active) return active;
    active = (async () => {
      blocked = false;
      while (items.length) {
        const item = items[0];
        let completed = false;
        for (let attempt = 1; attempt <= retryDelays.length; attempt += 1) {
          if (retryDelays[attempt - 1]) await wait(retryDelays[attempt - 1]);
          const startedAt = Date.now();
          onEvent('started', item, { attempt });
          try {
            await save(item);
            onEvent('completed', item, { attempt, latencyMs: Date.now() - startedAt });
            completed = true;
            break;
          } catch (error) {
            onEvent('failed', item, { attempt, error });
            if (!retryable(error) || attempt === retryDelays.length) break;
          }
        }
        if (!completed) { blocked = true; return false; }
        items.shift();
        store();
      }
      return true;
    })().finally(() => { active = null; });
    return active;
  }

  return Object.freeze({
    enqueue(item) {
      if (!items.some((candidate) => candidate.id === item.id)) {
        items.push(item);
        store();
      }
      void run();
    },
    async flush() { return run(); },
    async retry() { blocked = false; return run(); },
    pending() { return items.length; },
    blocked() { return blocked; },
  });
}
