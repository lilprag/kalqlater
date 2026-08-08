import Link from 'next/link';
import { BrandMark } from './BrandMark';
import { localePath, productionAppUrl } from '../lib/site';

const ICONS = {
  sparkles: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 16 .9 2.7L22.5 20l-2.6.9L19 23.5l-.9-2.6-2.6-.9 2.6-1.3L19 16Z" /></>,
  people: <><circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="3" /><path d="M3.5 21c.4-3.5 2.5-5.5 5.5-5.5s5.1 2 5.5 5.5M13.5 21c.3-2.7 1.9-4.5 4.8-4.5 2.4 0 4.1 1.5 4.5 4.5" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
  shield: <path d="M12 3 20 6v5.4c0 5-3.3 8.3-8 9.6-4.7-1.3-8-4.6-8-9.6V6l8-3Z M8.5 12.2l2.2 2.2 4.7-4.7" />,
  bolt: <path d="m13.3 2-8 12h6.3l-.6 8 8-12h-6.3l.6-8Z" />,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.6 8.4-2.2 5.2-5.1 2.1 2.2-5.1 5.1-2.2Z" /></>,
  heart: <path d="M12 20.5S4 16.2 4 10.5C4 7.9 5.8 6 8.2 6c1.6 0 3 1 3.8 2.2C12.8 7 14.2 6 15.8 6 18.2 6 20 7.9 20 10.5c0 5.7-8 10-8 10Z" />,
};

function Icon({ name, className = '' }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={`line-icon ${className}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ICONS[name]}</svg>;
}

const content = {
  en: {
    eyebrow: '16 personality types · Free · No login',
    title: 'Meet the person you already are',
    body: 'Answer 60 honest questions in about 10 minutes and find out which of the 16 personality types describes you best — and what it means for your life.',
    start: 'Start free test', types: 'Browse 16 types', trust: 'A thoughtful, private reflection experience',
    featuresTitle: 'Why take this test?',
    features: [
      ['sparkles', 'Rooted in a clear framework', 'Four practical dimensions — E/I, S/N, T/F, J/P — make your preferences easier to reflect on.'],
      ['people', 'Original Hindi content', 'All questions and profiles are available in Hindi as well as English.'],
      ['layers', 'Personal report', 'Explore preferences, strengths, growth areas, career themes, and relationship style.'],
      ['shield', 'Privacy first', 'No account is required to take the assessment. Your answers stay yours.'],
    ],
    dimensionTitle: 'Four dimensions of personality', dimensionBody: 'Your type is a combination of preferences across four human patterns.',
    dimensions: [
      ['bolt', 'E / I', 'Extraversion vs Introversion', 'Where you draw energy from', 'teal'],
      ['layers', 'S / N', 'Sensing vs Intuition', 'How you take in information', 'saffron'],
      ['heart', 'T / F', 'Thinking vs Feeling', 'How you make decisions', 'plum'],
      ['compass', 'J / P', 'Judging vs Perceiving', 'How you engage the outer world', 'teal'],
    ],
    communityEyebrow: 'Beyond the result', communityTitle: 'Take insight into the conversations that matter.', communityBody: 'Explore relationship intelligence, meet people around shared interests, and discover personality-aware opportunities — always as reflection, never as a label.', community: 'Explore community', compare: 'Compare personalities', jobs: 'Browse jobs',
    insightsEyebrow: 'Go Beyond Personality', insightsTitle: 'Notice the habits behind the pattern.', insightsBody: 'Personality can be a useful starting point. Communication Insights helps you reflect on how those patterns show up in real conversations.', insightsLive: 'Live now', insightsTool: 'Communication Insights', insightsToolBody: 'A practical reflection on clarity, listening, disagreement, and adaptation.', insightsCta: 'Explore Communication Insights', insightsSoon: 'Coming soon', insightsPlanned: ['Decision Patterns', 'Work Energy', 'Relationship Dynamics'],
    finalTitle: 'Ready? Begin now', finalBody: 'There is no right type. There is only a more useful way to understand your patterns.',
    architect: 'The Architect', architectBody: 'A quiet strategist who sees systems in depth.',
  },
  hi: {
    eyebrow: '16 व्यक्तित्व प्रकार · निःशुल्क · बिना लॉगिन',
    title: 'अपने भीतर के व्यक्तित्व से मिलें',
    body: 'लगभग 10 मिनट में 60 ईमानदार सवालों के जवाब दें और जानें कि 16 व्यक्तित्व प्रकारों में से कौन-सा आपके लिए सबसे उपयुक्त है — और इसका आपके जीवन में क्या अर्थ हो सकता है।',
    start: 'मुफ़्त परीक्षण शुरू करें', types: '16 प्रकार देखें', trust: 'निजी और विचारशील आत्मचिंतन का अनुभव',
    featuresTitle: 'यह परीक्षण क्यों लें?',
    features: [
      ['sparkles', 'स्पष्ट ढाँचा', 'चार व्यावहारिक आयाम — E/I, S/N, T/F, J/P — आपकी पसंद पर चिंतन को सरल बनाते हैं।'],
      ['people', 'मूल हिंदी सामग्री', 'सभी प्रश्न और प्रोफाइल हिंदी तथा अंग्रेज़ी दोनों में उपलब्ध हैं।'],
      ['layers', 'व्यक्तिगत रिपोर्ट', 'पसंद, ताकत, विकास क्षेत्र, करियर थीम और रिश्तों की शैली जानें।'],
      ['shield', 'गोपनीयता पहले', 'आकलन के लिए अकाउंट ज़रूरी नहीं है। आपके जवाब आपके हैं।'],
    ],
    dimensionTitle: 'व्यक्तित्व के चार आयाम', dimensionBody: 'आपका प्रकार चार मानवीय पैटर्न पर आपकी पसंद का संयोजन है।',
    dimensions: [
      ['bolt', 'E / I', 'बहिर्मुखी बनाम अंतर्मुखी', 'आप ऊर्जा कहाँ से पाते हैं', 'teal'],
      ['layers', 'S / N', 'इंद्रियबोध बनाम अंतर्ज्ञान', 'आप जानकारी कैसे लेते हैं', 'saffron'],
      ['heart', 'T / F', 'विचार बनाम भावना', 'आप निर्णय कैसे लेते हैं', 'plum'],
      ['compass', 'J / P', 'निर्णायक बनाम खुला-अंत', 'आप बाहरी दुनिया से कैसे मिलते हैं', 'teal'],
    ],
    communityEyebrow: 'परिणाम से आगे', communityTitle: 'उन बातचीतों में अंतर्दृष्टि लाएँ जो मायने रखती हैं।', communityBody: 'रिश्तों की समझ देखें, साझा रुचियों वाले लोगों से मिलें और व्यक्तित्व-सचेत अवसर खोजें — हमेशा आत्मचिंतन के लिए, किसी लेबल के लिए नहीं।', community: 'कम्युनिटी देखें', compare: 'व्यक्तित्व तुलना करें', jobs: 'जॉब्स देखें',
    insightsEyebrow: 'पर्सनैलिटी से आगे', insightsTitle: 'पैटर्न के पीछे की आदतों को देखें।', insightsBody: 'पर्सनैलिटी एक उपयोगी शुरुआत हो सकती है। कम्युनिकेशन इनसाइट्स आपको यह देखने में मदद करता है कि वे पैटर्न वास्तविक बातचीत में कैसे दिखते हैं।', insightsLive: 'अभी उपलब्ध', insightsTool: 'कम्युनिकेशन इनसाइट्स', insightsToolBody: 'स्पष्टता, सुनने, असहमति और अनुकूलन पर व्यावहारिक आत्मचिंतन।', insightsCta: 'कम्युनिकेशन इनसाइट्स देखें', insightsSoon: 'जल्द आ रहा है', insightsPlanned: ['निर्णय पैटर्न', 'कार्य ऊर्जा', 'रिश्तों की गतिशीलता'],
    finalTitle: 'तैयार हैं? अभी शुरू करें', finalBody: 'कोई सही प्रकार नहीं होता। अपने पैटर्न को समझने का बस अधिक उपयोगी तरीका होता है।',
    architect: 'वास्तुकार', architectBody: 'शांत रणनीतिकार जो व्यवस्थाओं को गहराई से देखता है।',
  },
};

export function HomeVisual({ locale }) {
  const copy = content[locale];
  const testUrl = productionAppUrl('/test');
  return <>
    <section className="hero-shell relative overflow-hidden">
      <div className="hero-blob hero-blob-saffron" aria-hidden="true" />
      <div className="hero-blob hero-blob-teal" aria-hidden="true" />
      <div className="hero-blob hero-blob-sand" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:px-8 lg:py-28">
        <div className="lg:col-span-7">
          <p className="eyebrow-pill"><Icon name="sparkles" />{copy.eyebrow}</p>
          <h1 className="display-font hero-title mt-6 max-w-3xl text-brand-ink">{copy.title}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-subtle sm:text-lg">{copy.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={testUrl} className="button-primary"><span>{copy.start}</span><span aria-hidden="true" className="button-arrow">→</span></a>
            <a href={productionAppUrl('/types')} className="button-secondary">{copy.types}</a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-brand-subtle">
            <div className="flex -space-x-2" aria-hidden="true"><span className="avatar-dot bg-brand-saffron" /><span className="avatar-dot bg-brand-teal" /><span className="avatar-dot bg-brand-plum" /><span className="avatar-dot bg-brand-sand" /></div>
            <span>{copy.trust}</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:col-span-5">
          <div className="personality-halo" aria-hidden="true" />
          <div className="personality-preview reveal-up">
            <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-brand-subtle">INTJ</p><h2 className="display-font mt-2 text-3xl text-brand-ink">{copy.architect}</h2><p className="mt-2 text-sm leading-relaxed text-brand-subtle">{copy.architectBody}</p></div>
            <div className="space-y-3">{[['I', 78], ['N', 65], ['T', 71], ['J', 60]].map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-[11px] font-medium text-brand-subtle"><span>{label}</span><span>{value}%</span></div><div className="trait-track"><span style={{ width: `${value}%` }} /></div></div>)}</div>
            <div className="flex items-center gap-3 border-t border-brand-line pt-5 text-sm text-brand-subtle"><BrandMark className="h-9 w-9" /><span>{locale === 'hi' ? 'आपकी पसंद का व्यावहारिक नक्शा' : 'A practical map of your preferences'}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"><h2 className="display-font section-title">{copy.featuresTitle}</h2><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{copy.features.map(([icon, title, body], index) => <article key={title} className="feature-card" style={{ animationDelay: `${index * 80}ms` }}><span className="icon-tile"><Icon name={icon} /></span><h3 className="mt-5 text-lg font-semibold text-brand-ink">{title}</h3><p className="mt-2 text-sm leading-relaxed text-brand-subtle">{body}</p></article>)}</div></section>

    <section className="dimension-section"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"><div className="max-w-2xl"><p className="section-kicker">KalQLater framework</p><h2 className="display-font section-title mt-3">{copy.dimensionTitle}</h2><p className="mt-4 leading-relaxed text-brand-subtle">{copy.dimensionBody}</p></div><div className="mt-10 grid gap-5 md:grid-cols-2">{copy.dimensions.map(([icon, key, title, body, tone]) => <article key={key} className={`dimension-card dimension-${tone}`}><span className="dimension-orb" aria-hidden="true" /><div className="relative"><Icon name={icon} className="text-brand-teal" /><p className="mt-6 text-xs font-semibold uppercase tracking-[.22em] text-brand-subtle">{key}</p><h3 className="display-font mt-2 text-2xl text-brand-ink">{title}</h3><p className="mt-2 text-brand-subtle">{body}</p></div></article>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"><div className="rounded-[2rem] border border-brand-line bg-white p-7 shadow-[0_20px_50px_rgba(45,40,37,.06)] sm:p-10"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="section-kicker">{copy.insightsEyebrow}</p><h2 className="display-font mt-3 text-4xl text-brand-ink">{copy.insightsTitle}</h2><p className="mt-4 max-w-xl leading-relaxed text-brand-subtle">{copy.insightsBody}</p><Link href={localePath(locale, 'insights')} className="button-secondary mt-7">{locale === 'hi' ? 'सभी इनसाइट्स देखें' : 'Explore all Insights'}</Link></div><div className="grid gap-3 sm:grid-cols-2"><article className="rounded-2xl bg-brand-ink p-6 text-white sm:col-span-2"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-sand">{copy.insightsLive}</p><h3 className="display-font mt-3 text-3xl">{copy.insightsTool}</h3><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">{copy.insightsToolBody}</p><Link href={localePath(locale, 'insights/communication')} className="button-light mt-6">{copy.insightsCta}<span aria-hidden="true">→</span></Link></article>{copy.insightsPlanned.map((item) => <article key={item} className="rounded-2xl bg-brand-cream p-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-teal">{copy.insightsSoon}</p><h3 className="display-font mt-3 text-2xl text-brand-ink">{item}</h3></article>)}</div></div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"><div className="community-band"><div><p className="section-kicker text-brand-sand">{copy.communityEyebrow}</p><h2 className="display-font mt-3 max-w-2xl text-3xl sm:text-4xl">{copy.communityTitle}</h2><p className="mt-4 max-w-2xl leading-relaxed text-white/75">{copy.communityBody}</p></div><div className="mt-8 flex flex-wrap gap-3"><a href={productionAppUrl('/community')} className="button-light">{copy.community}</a><a href={productionAppUrl('/compare')} className="button-dark-outline">{copy.compare}</a><a href={productionAppUrl('/community/jobs')} className="button-dark-outline">{copy.jobs}</a></div></div></section>

    <section className="mx-auto max-w-4xl px-4 pb-20 pt-4 text-center sm:px-6 lg:pb-24"><p className="section-kicker">KalQLater</p><h2 className="display-font section-title mt-3">{copy.finalTitle}</h2><p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-subtle">{copy.finalBody}</p><a href={testUrl} className="button-primary mt-7"><span>{copy.start}</span><span aria-hidden="true" className="button-arrow">→</span></a></section>
  </>;
}
