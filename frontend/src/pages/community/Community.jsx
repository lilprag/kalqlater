import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDirectory } from '../../services/communityService';
import MemberCard from '../../components/community/MemberCard';

const filterFields = [
  ['search', 'Search members'],
  ['type', 'Personality type'],
  ['country', 'Country'],
  ['city', 'City'],
  ['profession', 'Profession'],
  ['skill', 'Skill'],
  ['industry', 'Industry'],
  ['language', 'Language'],
  ['intent', 'Connection intent'],
  ['availability', 'Availability'],
  ['min_experience', 'Minimum years of experience'],
  ['max_experience', 'Maximum years of experience'],
];

const filterLabels = Object.fromEntries(filterFields);
const DEBOUNCE_MS = 300;

function makeMember(member) {
  return {
    ...member,
    type: member.personality_type,
    displayName: member.display_name,
    intents: member.connection_intents,
  };
}

export default function Community() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const requestId = useRef(0);

  // The serialized query string is stable across renders. Derive the object from it
  // once so effects never depend on a new object literal.
  const queryKey = searchParams.toString();
  const filters = useMemo(
    () => Object.fromEntries(new URLSearchParams(queryKey).entries()),
    [queryKey],
  );
  const page = Math.max(1, Number(filters.page) || 1);
  const activeFilterKeys = useMemo(
    () => Object.keys(filters).filter((key) => key !== 'page' && filters[key]),
    [filters],
  );

  const loadDirectory = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(false);

    try {
      const data = await getDirectory(filters, page);
      if (requestId.current !== currentRequest) return;
      setItems(data.items || []);
      setHasMore(Boolean(data.has_more));
    } catch {
      if (requestId.current !== currentRequest) return;
      setError(true);
    } finally {
      if (requestId.current === currentRequest) setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    const timer = window.setTimeout(loadDirectory, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      // Invalidate an already-running request when filters, page, or retry state changes.
      requestId.current += 1;
    };
  }, [loadDirectory, retryNonce]);

  const changeFilter = useCallback((key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const goToPage = useCallback((nextPage) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage > 1) next.set('page', String(nextPage));
    else next.delete('page');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <section className="rounded-[2rem] bg-[#182B31] p-7 text-white sm:p-10">
        <h1 className="font-display text-4xl sm:text-5xl">Meet by personality and purpose</h1>
        <Link to="/community/profile" className="mt-6 inline-block rounded-full bg-brand-saffron px-5 py-3 font-semibold text-brand-ink">
          Create Profile
        </Link>
      </section>

      <section className="mt-8" aria-labelledby="directory-heading">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filterFields.map(([key, label]) => (
            <label key={key} className="text-sm font-medium text-brand-ink" htmlFor={`community-filter-${key}`}>
              {label}
              <input
                id={`community-filter-${key}`}
                type={key.includes('experience') ? 'number' : 'text'}
                min={key.includes('experience') ? '0' : undefined}
                value={filters[key] || ''}
                onChange={(event) => changeFilter(key, event.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-line bg-white p-2 text-brand-ink focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
              />
            </label>
          ))}
          <label className="text-sm font-medium text-brand-ink" htmlFor="community-sort">
            Sort
            <select
              id="community-sort"
              value={filters.sort || 'newest'}
              onChange={(event) => changeFilter('sort', event.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-line bg-white p-2 text-brand-ink focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="updated">Recently Updated</option>
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
            </select>
          </label>
        </div>

        {activeFilterKeys.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active directory filters">
            <button type="button" onClick={() => setSearchParams({})} className="rounded-full px-2 py-1 text-sm font-semibold text-brand-teal underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-teal/30">
              Reset filters
            </button>
            {activeFilterKeys.map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => changeFilter(key, '')}
                className="rounded-full bg-brand-cream px-3 py-1 text-xs text-brand-ink transition hover:bg-brand-saffron/30 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                aria-label={`Remove ${filterLabels[key] || key} filter`}
              >
                {filterLabels[key] || key}: {filters[key]} ×
              </button>
            ))}
          </div>
        )}

        <h2 id="directory-heading" className="mt-8 font-display text-3xl">Explore members</h2>
        {loading && <p className="mt-4 text-brand-subtle" role="status">Loading members…</p>}
        {!loading && error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900" role="alert">
            <p>We could not load the member directory.</p>
            <button type="button" onClick={() => setRetryNonce((value) => value + 1)} className="mt-2 font-semibold underline underline-offset-4">Try again</button>
          </div>
        )}
        {!loading && !error && !items.length && <p className="mt-4 text-brand-subtle">No real community profiles match these filters.</p>}
        {!loading && !error && items.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((member) => <MemberCard key={member.username} member={makeMember(member)} lang="en" />)}
          </div>
        )}

        {!loading && !error && (page > 1 || hasMore) && (
          <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Directory pages">
            <button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">
              Previous
            </button>
            <span className="text-sm text-brand-subtle">Page {page}</span>
            <button type="button" disabled={!hasMore} onClick={() => goToPage(page + 1)} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">
              Next
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
