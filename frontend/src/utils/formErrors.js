const humanize = (field) => field.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export function normalizeHttpUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  return /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function parseApiError(error) {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) {
    const fields = detail.reduce((result, item) => {
      const field = item?.loc?.filter((part) => part !== 'body').at(-1);
      if (field && item?.msg) result[field] = `${humanize(field)}: ${item.msg}`;
      return result;
    }, {});
    return { fields, message: Object.values(fields)[0] || 'Please review the highlighted fields.' };
  }
  if (typeof detail === 'string') return { fields: {}, message: detail };
  if (detail && typeof detail === 'object') return { fields: {}, message: detail.message || 'We could not save your job. Please try again.' };
  if (error?.request && !error?.response) return { fields: {}, message: 'We could not reach the server. Please try again.' };
  return { fields: {}, message: 'We could not save your job. Please try again.' };
}
