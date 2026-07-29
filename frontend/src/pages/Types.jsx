import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { TYPES, GROUPS } from '../data/types';

export default function Types() {
    const { lang, t } = useLang();
    const hi = lang === 'hi';
    const cls = hi ? 'font-body-hi' : '';
    const clsH = hi ? 'font-display-hi' : 'font-display';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h1 className={`text-4xl sm:text-5xl text-brand-ink ${clsH}`} data-testid="types-title">{t.types.title}</h1>
            <p className={`mt-3 max-w-2xl text-brand-subtle ${cls}`}>{t.types.sub}</p>

            <div className="mt-12 space-y-14">
                {GROUPS.map((g) => {
                    const list = Object.values(TYPES).filter((tp) => tp.group === g);
                    return (
                        <div key={g}>
                            <div className={`text-xs tracking-[0.3em] uppercase text-brand-subtle mb-4 ${cls}`}>{t.types.groups[g]}</div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {list.map((tp, i) => {
                                    const info = hi ? tp.hi : tp.en;
                                    return (
                                        <motion.div
                                            key={tp.code}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link
                                                to={`/types/${tp.code}`}
                                                data-testid={`type-card-${tp.code}`}
                                                className="group block rounded-3xl bg-white border border-brand-line p-6 h-full hover:-translate-y-1 hover:shadow-[0_20px_50px_rgb(46,40,37,0.06)] transition-all relative overflow-hidden"
                                            >
                                                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-40" style={{ background: tp.color }} />
                                                <div className={`text-xs tracking-[0.25em] uppercase text-brand-subtle`}>{tp.code}</div>
                                                <div className={`mt-2 text-2xl text-brand-ink ${clsH}`}>{info.nickname}</div>
                                                <p className={`mt-2 text-sm text-brand-subtle line-clamp-3 ${cls}`}>{info.headline}</p>
                                                <div className={`mt-4 text-sm text-brand-teal font-medium ${cls}`}>
                                                    {hi ? 'विस्तार से पढ़ें →' : 'Read more →'}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
