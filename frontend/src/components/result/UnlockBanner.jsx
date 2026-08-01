import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, UsersRound } from 'lucide-react';

export default function UnlockBanner({ copy, cls, clsH, to, signedIn, onClick }) {
    return <section className="max-w-6xl mx-auto px-4 py-14 sm:px-6 lg:px-8"><div className="relative overflow-hidden rounded-[2rem] bg-brand-teal px-6 py-10 text-white shadow-[0_22px_60px_rgba(31,108,125,0.22)] sm:px-10"><div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/20" /><div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-brand-sand/20 blur-2xl" /><div className="relative max-w-2xl"><div className="flex items-center gap-2 text-brand-sand"><Compass size={18} aria-hidden="true" /><UsersRound size={18} aria-hidden="true" /></div><h2 className={`mt-5 text-3xl leading-tight sm:text-4xl ${clsH}`}>{copy.unlockTitle}</h2><p className={`mt-4 text-base leading-relaxed text-white/80 ${cls}`}>{copy.unlockText}</p><Link to={to} onClick={onClick} className={`mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-teal transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-sand ${cls}`}>{signedIn ? copy.signedIn : copy.unlock}<ArrowRight size={16} aria-hidden="true" /></Link></div></div></section>;
}
