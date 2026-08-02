'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function pathOf(href) { try { return new URL(href, typeof window === 'undefined' ? 'https://kalqlater.com' : window.location.origin).pathname; } catch { return href; } }
function activePath(pathname, target) { return target === '/' ? pathname === '/' : pathname === target || pathname.startsWith(`${target}/`); }

export function NavigationLink({ href, label, className = '', onClick }) {
  const pathname = usePathname();
  const active = activePath(pathname, pathOf(href));
  const classes = `${className} ${active ? 'bg-brand-cream text-brand-ink font-semibold' : 'text-brand-subtle hover:bg-brand-cream/70 hover:text-brand-ink'}`.trim();
  return href.startsWith('/') ? <Link href={href} onClick={onClick} className={classes} aria-current={active ? 'page' : undefined}>{label}</Link> : <a href={href} onClick={onClick} className={classes} aria-current={active ? 'page' : undefined}>{label}</a>;
}
