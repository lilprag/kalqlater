/** Human-approved edits and terminology are append-only studio memory. */
export function createTranslationMemory(entries = []) {
  const approved = new Map();
  for (const entry of entries) {
    if (entry.status !== 'approved' || !entry.locale || !entry.contentId || !entry.value) continue;
    approved.set(`${entry.locale}:${entry.contentId}`, Object.freeze({ ...entry }));
  }
  return Object.freeze({
    get(locale, contentId) { return approved.get(`${locale}:${contentId}`) || null; },
    approvedEntries() { return [...approved.values()]; },
  });
}

export function affectedLocaleBlocks({ changedContentIds, localeRecords }) {
  const changed = new Set(changedContentIds);
  return localeRecords.filter((record) => changed.has(record.contentId) && record.status === 'published').map((record) => ({ ...record, status: 'pending_update', reason: 'english_master_changed' }));
}
