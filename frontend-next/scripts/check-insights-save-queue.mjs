import assert from 'node:assert/strict';
import { createOrderedSaveQueue } from '../lib/insights-save-queue.js';

const stored = [];
const calls = [];
let inFlight = 0;
let maxInFlight = 0;
const queue = createOrderedSaveQueue({
  persist: (items) => { stored.splice(0, stored.length, ...items); },
  retryDelays: [0, 0, 0],
  save: async (item) => {
    inFlight += 1; maxInFlight = Math.max(maxInFlight, inFlight);
    await Promise.resolve(); calls.push(item.step); inFlight -= 1;
  },
});
queue.enqueue({ id: 'one', step: 1 });
queue.enqueue({ id: 'two', step: 2 });
queue.enqueue({ id: 'two', step: 2 });
assert.equal(await queue.flush(), true);
assert.deepEqual(calls, [1, 2]);
assert.equal(maxInFlight, 1);
assert.deepEqual(stored, []);

let attempts = 0;
const retryQueue = createOrderedSaveQueue({
  persist: () => {}, retryDelays: [0, 0, 0],
  save: async () => { attempts += 1; if (attempts < 3) throw new Error('temporary'); },
});
retryQueue.enqueue({ id: 'retry', step: 3 });
assert.equal(await retryQueue.flush(), true);
assert.equal(attempts, 3);

let allowed = false;
const blockedQueue = createOrderedSaveQueue({
  initialItems: [{ id: 'persisted', step: 4 }], persist: () => {}, retryDelays: [0],
  save: async () => { if (!allowed) throw new Error('offline'); },
});
assert.equal(await blockedQueue.flush(), false);
assert.equal(blockedQueue.pending(), 1);
allowed = true;
assert.equal(await blockedQueue.retry(), true);
assert.equal(blockedQueue.pending(), 0);

console.log('Insights ordered save queue: PASS');
