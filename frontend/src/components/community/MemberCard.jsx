import React from 'react';
import { ArrowUpRight, BriefcaseBusiness, Languages, Link as LinkIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TYPES } from '../../data/types';

const COMPLETENESS_FIELDS = [
  'displayName', 'username', 'type', 'bio', 'profession', 'country', 'city',
  'skills', 'industries', 'languages', 'years_experience', 'intents', 'availability', 'social_links',
];

const hasValue = (value) => (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== '');

/**
 * A profile earns one point for each public-ready field. Years of experience is
 * considered complete at 0 as well, although cards only display positive years.
 * The social-link point only counts owner-visible links supplied by the API.
 */
export function getProfileCompleteness(member) {
  const completed = COMPLETENESS_FIELDS.filter((field) => hasValue(member[field])).length;
  return Math.round((completed / COMPLETENESS_FIELDS.length) * 100);
}

function initialLetters(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';
}

export default function MemberCard({ member, lang = 'en' }) {
  const type = TYPES[member.type];
  const info = type?.[lang] || type?.en;
  const skills = (member.skills || []).slice(0, 3);
  const intents = (member.intents || []).slice(0, 2);
  const location = [member.city, member.country].filter(Boolean).join(', ');
  const socialCount = Object.keys(member.social_links || {}).length;
  const completeness = getProfileCompleteness(member);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-brand-line bg-white p-6 shadow-[0_12px_32px_rgba(45,40,37,.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(45,40,37,.10)]">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-teal/10 text-sm font-bold text-brand-teal" aria-hidden="true">
          {initialLetters(member.displayName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {member.type && <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand-teal">{member.type}{info?.nickname ? ` · ${info.nickname}` : ''}</p>}
              {member.displayName && <h3 className="mt-1 truncate font-display text-xl text-brand-ink">{member.displayName}</h3>}
              {member.username && <p className="mt-1 text-sm text-brand-subtle">@{member.username}</p>}
            </div>
            {member.type && <span className="shrink-0 rounded-2xl px-3 py-2 text-xs font-semibold text-white" style={{ background: type?.color || '#182B31' }}>{member.type}</span>}
          </div>
        </div>
      </div>

      {member.profession && <p className="mt-5 flex items-center gap-2 text-sm font-medium text-brand-ink"><BriefcaseBusiness size={15} aria-hidden="true" />{member.profession}</p>}
      {member.bio && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-subtle">{member.bio}</p>}
      {location && <p className="mt-3 flex items-center gap-1.5 text-sm text-brand-subtle"><MapPin size={14} aria-hidden="true" />{location}</p>}

      {skills.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-full bg-brand-cream px-3 py-1 text-xs text-brand-ink">{skill}</span>)}</div>}
      {(member.years_experience > 0 || intents.length > 0) && <div className="mt-4 flex flex-wrap gap-2 text-xs text-brand-subtle">
        {member.years_experience > 0 && <span>{member.years_experience} {member.years_experience === 1 ? 'year' : 'years'} experience</span>}
        {intents.map((intent) => <span key={intent} className="rounded-full border border-brand-teal/15 px-2.5 py-1 text-brand-teal">{intent}</span>)}
      </div>}
      {(member.languages || []).length > 0 && <p className="mt-4 flex items-start gap-2 text-xs text-brand-subtle"><Languages size={15} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{member.languages.join(', ')}</span></p>}

      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-brand-teal/15 bg-brand-teal/5 p-3 text-xs">
        <span className="font-semibold text-brand-teal">Profile {completeness}% complete</span>
        {socialCount > 0 && <span className="flex items-center gap-1 text-brand-subtle"><LinkIcon size={13} aria-hidden="true" />{socialCount} visible {socialCount === 1 ? 'link' : 'links'}</span>}
      </div>

      {member.username && <Link to={`/community/member/${member.username}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-teal/30">View profile <ArrowUpRight size={15} aria-hidden="true" /></Link>}
    </article>
  );
}
