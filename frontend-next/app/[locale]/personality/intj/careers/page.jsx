import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../../../components/JsonLd';
import { INTJ_CAREERS } from '../../../../../data/intj-careers';
import { breadcrumbJsonLd, pageMetadata } from '../../../../../lib/metadata';
import { isLocale, localePath, productionAppUrl } from '../../../../../lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'hi' }];
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const content = INTJ_CAREERS[locale];
  return pageMetadata({
    locale,
    path: 'personality/intj/careers',
    title: content.title,
    description: content.description,
  });
}

const EN = {
  crumb: 'Careers',
  eyebrow: 'Career exploration for INTJ',
  snapshot: 'Work-style snapshot',
  snapshotNote: 'Preferences to explore—not a scorecard or a prediction.',
  values: 'What may matter at work',
  frustrations: 'Possible frustrations',
  directions: 'Career directions to investigate',
  directionsNote: 'Working-style alignment is not eligibility. Every path needs skills, access and real-world testing.',
  comparison: 'Compare the directions',
  environment: 'Work environment map',
  industries: 'Industries worth exploring',
  formats: 'Remote, hybrid or office?',
  roadmap: 'A practical development roadmap',
  blindspots: 'Growth edges to watch',
  audiences: 'Advice for your current chapter',
  checklist: 'Career decision checklist',
  guide: 'How to use this guide',
  faq: 'Frequently asked questions',
  test: 'Take the personality test',
  jobs: 'Explore Community Jobs',
  community: 'Meet the Community',
  compare: 'Explore INTJ and ENFP',
  typePage: 'View INTJ profile',
  related: 'Keep exploring',
  challenge: 'Potential challenge',
  collaboration: 'Collaboration rhythm',
  career: 'Direction',
  why: 'Why it may appeal',
  setting: 'Work setting',
  remote: 'Remote rhythm',
  leadership: 'Leadership path',
  skills: 'Skills to strengthen',
  environmentText: [
    ['Focus', 'Deep work is easier when attention has a clear home.'],
    ['Feedback', 'Early feedback keeps a strong plan connected to reality.'],
    ['Autonomy', 'Ownership works best alongside shared decision context.'],
    ['Impact', 'Look for a problem you can improve—not only a prestigious title.'],
  ],
  guideText: 'Use these pages to make a shortlist, then pressure-test it through conversations, job descriptions, small projects and your own constraints. Personality preferences are not abilities. People thrive well beyond type-based suggestions, and employers must not use personality type in screening or hiring.',
  disclaimer: 'KalQLater career guides are reflective educational material. They are not employment advice, clinical assessment, a measure of ability or a guarantee of career success.',
};

const HI = {
  crumb: 'करियर',
  eyebrow: 'INTJ के लिए करियर खोज',
  snapshot: 'कार्य-शैली की झलक',
  snapshotNote: 'खोजने योग्य पसंद—न स्कोरकार्ड, न भविष्यवाणी।',
  values: 'काम में क्या महत्वपूर्ण लग सकता है',
  frustrations: 'संभावित निराशाएँ',
  directions: 'खोजने योग्य करियर दिशाएँ',
  directionsNote: 'कार्य-शैली सामंजस्य पात्रता नहीं है। हर दिशा को कौशल, अवसर और वास्तविक परीक्षण की जरूरत होती है।',
  comparison: 'दिशाओं की तुलना करें',
  environment: 'कार्य-परिवेश मानचित्र',
  industries: 'खोजने योग्य उद्योग',
  formats: 'रिमोट, हाइब्रिड या ऑफिस?',
  roadmap: 'व्यावहारिक विकास रोडमैप',
  blindspots: 'ध्यान रखने योग्य विकास क्षेत्र',
  audiences: 'आपके वर्तमान चरण के लिए सलाह',
  checklist: 'करियर निर्णय चेकलिस्ट',
  guide: 'इस गाइड का उपयोग कैसे करें',
  faq: 'सामान्य प्रश्न',
  test: 'पर्सनैलिटी टेस्ट दें',
  jobs: 'कम्युनिटी जॉब्स देखें',
  community: 'कम्युनिटी से मिलें',
  compare: 'INTJ और ENFP देखें',
  typePage: 'INTJ प्रोफाइल देखें',
  related: 'खोज जारी रखें',
  challenge: 'संभावित चुनौती',
  collaboration: 'सहयोग की शैली',
  career: 'दिशा',
  why: 'क्यों आकर्षक लग सकता है',
  setting: 'कार्य-परिवेश',
  remote: 'रिमोट शैली',
  leadership: 'नेतृत्व पथ',
  skills: 'मज़बूत करने योग्य कौशल',
  environmentText: [
    ['फोकस', 'जब ध्यान के लिए स्पष्ट जगह हो तो गहरा काम आसान हो सकता है।'],
    ['फीडबैक', 'शुरुआती फीडबैक अच्छी योजना को वास्तविकता से जोड़े रखता है।'],
    ['स्वायत्तता', 'जिम्मेदारी साझा निर्णय-संदर्भ के साथ बेहतर काम करती है।'],
    ['प्रभाव', 'केवल प्रतिष्ठित पद नहीं, सुधारने योग्य समस्या खोजें।'],
  ],
  guideText: 'इन पन्नों से एक छोटी सूची बनाएं, फिर बातचीत, जॉब डिस्क्रिप्शन, छोटे प्रोजेक्ट और अपनी सीमाओं से उसे जाँचें। व्यक्तित्व पसंद क्षमता नहीं होती। लोग सुझाई गई श्रेणियों के बाहर भी सफल हो सकते हैं और नियोक्ताओं को व्यक्तित्व के आधार पर भर्ती या छंटनी नहीं करनी चाहिए।',
  disclaimer: 'KalQLater करियर गाइड आत्म-चिंतन और शिक्षा सामग्री हैं। यह रोजगार सलाह, क्लिनिकल आकलन, क्षमता माप या करियर सफलता की गारंटी नहीं है।',
};

const CAREER_META = {
  en: [
    ['Technical systems', 'Build and explain a portfolio project', 'Flexible', 'Growing through technical ownership'],
    ['Evidence & models', 'Statistical reasoning and clear storytelling', 'Often flexible', 'Influencing evidence-led choices'],
    ['Research practice', 'Methods, writing and patient iteration', 'Varies by institution', 'Leading a research agenda'],
    ['Product & customers', 'Stakeholder communication and experiments', 'Highly collaborative', 'Aligning a product direction'],
    ['Risk & resilience', 'Threat modelling and incident communication', 'Often hybrid', 'Coordinating response'],
    ['Platform decisions', 'Architecture communication and mentoring', 'Cross-functional', 'Setting technical direction'],
    ['Client problem-solving', 'Synthesis, presentation and relationship skills', 'Client-facing', 'Guiding executive choices'],
    ['Business analysis', 'Financial modelling and commercial context', 'Team-dependent', 'Owning planning decisions'],
    ['User learning', 'Interviewing, synthesis and empathy', 'Collaborative', 'Advocating for user evidence'],
    ['Building an organisation', 'Sales, delegation and rapid experiments', 'Highly variable', 'Shared company leadership'],
  ],
  hi: [
    ['तकनीकी सिस्टम', 'पोर्टफोलियो प्रोजेक्ट बनाना और समझाना', 'लचीला', 'तकनीकी जिम्मेदारी से बढ़ना'],
    ['प्रमाण और मॉडल', 'सांख्यिकीय तर्क और स्पष्ट कहानी', 'अक्सर लचीला', 'प्रमाण-आधारित विकल्पों को प्रभावित करना'],
    ['रिसर्च अभ्यास', 'तरीके, लेखन और धैर्यपूर्ण पुनरावृत्ति', 'संस्था पर निर्भर', 'रिसर्च एजेंडा का नेतृत्व'],
    ['प्रोडक्ट और ग्राहक', 'हितधारक संवाद और प्रयोग', 'बहुत सहयोगी', 'प्रोडक्ट दिशा में सामंजस्य'],
    ['जोखिम और लचीलापन', 'थ्रेट मॉडलिंग और घटना संवाद', 'अक्सर हाइब्रिड', 'रिस्पॉन्स का समन्वय'],
    ['प्लेटफॉर्म निर्णय', 'आर्किटेक्चर संवाद और मेंटरिंग', 'क्रॉस-फंक्शनल', 'तकनीकी दिशा तय करना'],
    ['क्लाइंट समस्या-समाधान', 'सार, प्रस्तुति और संबंध कौशल', 'क्लाइंट-फेसिंग', 'एग्जीक्यूटिव विकल्पों का मार्गदर्शन'],
    ['बिज़नेस एनालिसिस', 'फाइनेंशियल मॉडलिंग और व्यावसायिक संदर्भ', 'टीम पर निर्भर', 'योजना निर्णयों की जिम्मेदारी'],
    ['यूज़र लर्निंग', 'इंटरव्यू, सार और सहानुभूति', 'सहयोगी', 'यूज़र प्रमाण के लिए आवाज उठाना'],
    ['संगठन बनाना', 'सेल्स, डेलीगेशन और तेज़ प्रयोग', 'बहुत परिवर्ती', 'साझा कंपनी नेतृत्व'],
  ],
};

const INDUSTRY_CONTEXT = {
  en: [
    ['Technology & platforms', 'Systems can be made clearer and more useful.', 'Fast shifts can require frequent communication.', 'Software engineer, architect, product manager'],
    ['Research & education', 'Questions can be pursued with depth and rigour.', 'Feedback cycles may be long.', 'Researcher, lecturer, learning designer'],
    ['Finance & analytics', 'Evidence and structured decisions are central.', 'Commercial pace can be demanding.', 'Analyst, risk specialist, strategist'],
    ['Healthcare systems', 'Complex systems can improve real outcomes.', 'Regulation and care context matter deeply.', 'Health-data analyst, operations strategist'],
    ['Law & policy', 'Complex rules and long-term consequences invite analysis.', 'Influence relies on writing and relationships.', 'Policy analyst, legal researcher'],
    ['Design & product', 'Models can become useful experiences for people.', 'Early ambiguity and qualitative feedback are essential.', 'UX researcher, product strategist'],
    ['Public service', 'A systems lens can serve a meaningful public problem.', 'Change often moves through many stakeholders.', 'Policy adviser, service designer'],
    ['Climate & infrastructure', 'Long-horizon, practical problems can be compelling.', 'Projects can involve regulation and competing priorities.', 'Systems analyst, climate researcher'],
    ['Entrepreneurship', 'A thesis can become a sequence of experiments.', 'Uncertainty and relationship work are unavoidable.', 'Founder, operator, product lead'],
    ['Operations', 'Processes can become clearer, safer and more effective.', 'Improvement needs patient adoption by others.', 'Operations strategist, programme manager'],
  ],
  hi: [
    ['टेक्नोलॉजी और प्लेटफॉर्म', 'सिस्टम को अधिक स्पष्ट और उपयोगी बनाया जा सकता है।', 'तेज़ बदलाव में बार-बार संवाद जरूरी हो सकता है।', 'सॉफ्टवेयर इंजीनियर, आर्किटेक्ट, प्रोडक्ट मैनेजर'],
    ['रिसर्च और शिक्षा', 'प्रश्नों को गहराई और कठोरता से देखा जा सकता है।', 'फीडबैक चक्र लंबे हो सकते हैं।', 'रिसर्चर, लेक्चरर, लर्निंग डिज़ाइनर'],
    ['फाइनेंस और एनालिटिक्स', 'प्रमाण और संरचित निर्णय केंद्र में होते हैं।', 'व्यावसायिक गति चुनौतीपूर्ण हो सकती है।', 'एनालिस्ट, रिस्क विशेषज्ञ, स्ट्रैटेजिस्ट'],
    ['हेल्थकेयर सिस्टम्स', 'जटिल सिस्टम वास्तविक परिणाम बेहतर कर सकते हैं।', 'नियम और देखभाल का संदर्भ बहुत महत्वपूर्ण है।', 'हेल्थ-डेटा एनालिस्ट, ऑपरेशंस स्ट्रैटेजिस्ट'],
    ['कानून और पॉलिसी', 'जटिल नियम और दीर्घ परिणाम विश्लेषण आमंत्रित करते हैं।', 'प्रभाव लेखन और संबंधों पर निर्भर है।', 'पॉलिसी एनालिस्ट, लीगल रिसर्चर'],
    ['डिज़ाइन और प्रोडक्ट', 'मॉडल लोगों के लिए उपयोगी अनुभव बन सकते हैं।', 'शुरुआती अस्पष्टता और गुणात्मक फीडबैक जरूरी हैं।', 'UX रिसर्चर, प्रोडक्ट स्ट्रैटेजिस्ट'],
    ['पब्लिक सर्विस', 'सिस्टम सोच सार्थक सार्वजनिक समस्या में मदद कर सकती है।', 'बदलाव कई हितधारकों से होकर आता है।', 'पॉलिसी एडवाइजर, सर्विस डिज़ाइनर'],
    ['जलवायु और इंफ्रास्ट्रक्चर', 'दीर्घ दृष्टि वाले व्यावहारिक प्रश्न आकर्षक हो सकते हैं।', 'प्रोजेक्ट में नियम और अलग प्राथमिकताएँ हो सकती हैं।', 'सिस्टम्स एनालिस्ट, क्लाइमेट रिसर्चर'],
    ['उद्यमिता', 'दृष्टि को प्रयोगों की श्रृंखला में बदला जा सकता है।', 'अनिश्चितता और संबंध कार्य से बचा नहीं जा सकता।', 'फाउंडर, ऑपरेटर, प्रोडक्ट लीड'],
    ['ऑपरेशंस', 'प्रक्रियाएँ अधिक स्पष्ट, सुरक्षित और प्रभावी बन सकती हैं।', 'सुधार के लिए दूसरों की स्वीकृति जरूरी होती है।', 'ऑपरेशंस स्ट्रैटेजिस्ट, प्रोग्राम मैनेजर'],
  ],
};

function SectionHeading({ title, description, light = false }) {
  return (
    <div className="max-w-3xl">
      <h2 className={`display-font text-3xl sm:text-4xl ${light ? 'text-white' : 'text-brand-ink'}`}>{title}</h2>
      {description ? <p className={`mt-3 leading-relaxed ${light ? 'text-white/75' : 'text-brand-subtle'}`}>{description}</p> : null}
    </div>
  );
}

export default async function IntjCareersPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = locale === 'hi' ? HI : EN;
  const content = INTJ_CAREERS[locale];
  const careerMeta = CAREER_META[locale];
  const industries = INDUSTRY_CONTEXT[locale];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            breadcrumbJsonLd(locale, [
              { name: 'KalQLater' },
              { name: 'INTJ', path: 'personality/intj' },
              { name: copy.crumb, path: 'personality/intj/careers' },
            ]),
            faqSchema,
          ],
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-brand-subtle">
          <Link href={`/${locale}`} className="transition hover:text-brand-teal">KalQLater</Link>
          <span aria-hidden="true"> / </span>
          <Link href={localePath(locale, 'personality/intj')} className="transition hover:text-brand-teal">INTJ</Link>
          <span aria-hidden="true"> / </span>
          <span>{copy.crumb}</span>
        </nav>

        <header className="relative mt-6 overflow-hidden rounded-[2rem] bg-brand-ink px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-brand-sand/30" />
          <div aria-hidden="true" className="absolute bottom-0 right-10 h-36 w-36 rounded-full bg-brand-teal/25 blur-3xl" />
          <div className="relative max-w-4xl">
            <p className="section-kicker text-brand-sand">INTJ · {copy.eyebrow}</p>
            <h1 className="display-font mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">{content.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">{content.hero}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={localePath(locale, 'personality/intj')} className="button-light">{copy.typePage}</Link>
              <a href={productionAppUrl('/test')} className="button-dark-outline">{copy.test}</a>
              <a href={productionAppUrl('/community/jobs')} className="button-dark-outline">{copy.jobs}</a>
            </div>
          </div>
        </header>

        <section className="mt-12 rounded-[2rem] border border-brand-line bg-brand-cream/70 p-6 sm:p-8">
          <SectionHeading title={copy.snapshot} description={copy.snapshotNote} />
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {content.snapshot.map(([title, description], index) => (
              <article key={title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-line/50">
                <div aria-hidden="true" className="mb-4 h-1.5 w-12 rounded-full bg-brand-teal" />
                <h3 className="font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-teal">{index < 4 ? (locale === 'hi' ? 'उच्च पसंद' : 'Higher preference') : (locale === 'hi' ? 'मध्यम पसंद' : 'Moderate preference')}</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-subtle">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <InsightList title={copy.values} items={content.values} tone="cream" />
          <InsightList title={copy.frustrations} items={content.frustrations} tone="sand" />
        </section>

        <section className="mt-14">
          <SectionHeading title={copy.directions} description={copy.directionsNote} />
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {content.careers.map(([name, label, reason, challenge], index) => (
              <article key={name} className="group rounded-3xl border border-brand-line bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-teal">{label}</p><CareerGlyph index={index} /></div>
                <h3 className="display-font mt-3 text-2xl text-brand-ink">{name}</h3>
                <p className="mt-3 leading-relaxed text-brand-subtle">{reason}</p>
                <p className="mt-4 text-sm text-brand-subtle"><strong className="text-brand-ink">{copy.skills}: </strong>{careerMeta[index][1]}</p>
                <p className="mt-5 rounded-2xl bg-brand-cream px-4 py-3 text-sm leading-relaxed text-brand-ink"><strong>{copy.challenge}: </strong>{challenge}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading title={copy.comparison} />
          <div className="mt-6 overflow-x-auto rounded-3xl border border-brand-line bg-white shadow-sm">
            <table className="min-w-[780px] w-full text-left text-sm">
              <caption className="sr-only">{copy.comparison}</caption>
              <thead className="bg-brand-cream text-brand-ink">
                <tr>
                  {[copy.career, copy.why, copy.setting, copy.collaboration, copy.remote, copy.leadership, copy.skills].map((label) => <th key={label} scope="col" className="p-4 font-semibold">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {content.careers.map(([name, , reason], index) => (
                  <tr key={name} className="border-t border-brand-line align-top">
                    <th scope="row" className="p-4 font-semibold text-brand-ink">{name}</th>
                    <td className="p-4 text-brand-subtle">{reason}</td>
                    <td className="p-4 text-brand-subtle">{careerMeta[index][0]}</td>
                    <td className="p-4 text-brand-subtle">{index % 2 === 0 ? copy.environmentText[1][0] : copy.environmentText[2][0]}</td>
                    <td className="p-4 text-brand-subtle">{careerMeta[index][2]}</td>
                    <td className="p-4 text-brand-subtle">{careerMeta[index][3]}</td>
                    <td className="p-4 text-brand-subtle">{careerMeta[index][1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-brand-teal p-7 text-white sm:p-9">
            <SectionHeading title={copy.environment} light />
            <div className="mt-6 grid grid-cols-2 gap-3">
              {copy.environmentText.map(([title, description], index) => (
                <article key={title} className={`rounded-2xl p-5 ${index % 2 === 0 ? 'bg-white/15' : 'bg-brand-ink/25'}`}>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9">
            <SectionHeading title={copy.industries} />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {industries.map(([industry, appeal, challenge, roles]) => (
                <article key={industry} className="rounded-2xl bg-brand-cream p-4">
                  <h3 className="font-semibold text-brand-ink">{industry}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-subtle">{appeal}</p>
                  <p className="mt-3 text-xs leading-relaxed text-brand-ink"><strong>{copy.challenge}: </strong>{challenge}</p>
                  <p className="mt-2 text-xs leading-relaxed text-brand-teal">{roles}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading title={copy.formats} />
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {content.formats.map(([name, appeal, watch]) => (
              <article key={name} className="rounded-3xl border border-brand-line bg-white p-6">
                <h3 className="display-font text-2xl text-brand-ink">{name}</h3>
                <p className="mt-3 leading-relaxed text-brand-subtle">{appeal}</p>
                <p className="mt-5 border-t border-brand-line pt-4 text-sm text-brand-ink"><strong>{copy.challenge}: </strong>{watch}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[2rem] bg-brand-ink p-7 text-white sm:p-10">
          <SectionHeading title={copy.roadmap} light />
          <ol className="mt-8 grid gap-5 lg:grid-cols-5">
            {content.roadmap.map(([title, description]) => (
              <li key={title} className="relative rounded-2xl bg-white/10 p-5">
                <span aria-hidden="true" className="mb-5 block h-2 w-10 rounded-full bg-brand-sand" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <InsightList title={copy.blindspots} items={content.blindspots} tone="sand" />
          <div className="rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9">
            <SectionHeading title={copy.audiences} />
            <div className="mt-6 space-y-4">
              {content.audiences.map(([name, guidance]) => (
                <article key={name} className="border-b border-brand-line pb-4 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-brand-ink">{name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-subtle">{guidance}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-[2rem] bg-brand-sand/30 p-7 sm:p-9">
          <SectionHeading title={copy.checklist} />
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {content.checklist.map((item) => <li key={item} className="rounded-2xl bg-white p-4 text-brand-ink shadow-sm"><span aria-hidden="true" className="mr-2 text-brand-teal">✓</span>{item}</li>)}
          </ul>
        </section>

        <section className="mt-14 rounded-[2rem] border border-brand-saffron/30 bg-brand-cream p-7 sm:p-9">
          <SectionHeading title={copy.guide} />
          <p className="mt-5 max-w-4xl leading-relaxed text-brand-ink">{copy.guideText}</p>
        </section>

        <section className="mt-14">
          <SectionHeading title={copy.faq} />
          <div className="mt-6 space-y-3">
            {content.faq.map(([question, answer]) => (
              <details key={question} className="rounded-2xl border border-brand-line bg-white p-5 open:shadow-sm">
                <summary className="cursor-pointer font-semibold text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal">{question}</summary>
                <p className="mt-4 leading-relaxed text-brand-subtle">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <aside className="mt-14 rounded-2xl bg-brand-cream px-6 py-5 text-sm leading-relaxed text-brand-ink" aria-label="Career guide disclaimer">{copy.disclaimer}</aside>

        <section className="mt-10 rounded-[2rem] bg-brand-teal p-7 text-white sm:p-10">
          <p className="section-kicker text-brand-sand">{copy.related}</p>
          <h2 className="display-font mt-3 text-3xl sm:text-4xl">{locale === 'hi' ? 'व्यक्तित्व को शुरुआती बिंदु मानें—अंतिम उत्तर नहीं।' : 'Use personality as a starting point—not the final answer.'}</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={productionAppUrl('/test')} className="button-light">{copy.test}</a>
            <a href={productionAppUrl('/community/jobs')} className="button-dark-outline">{copy.jobs}</a>
            <a href={productionAppUrl('/community')} className="button-dark-outline">{copy.community}</a>
            <Link href={localePath(locale, 'compare/intj-vs-enfp')} className="button-dark-outline">{copy.compare}</Link>
          </div>
        </section>
      </main>
    </>
  );
}

function InsightList({ title, items, tone }) {
  const background = tone === 'sand' ? 'bg-brand-sand/25' : 'bg-brand-cream/70';
  return (
    <section className={`rounded-[2rem] p-7 sm:p-9 ${background}`}>
      <SectionHeading title={title} />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => <li key={item} className="rounded-2xl bg-white px-4 py-3 text-brand-ink shadow-sm">{item}</li>)}
      </ul>
    </section>
  );
}

function CareerGlyph({ index }) {
  const shapes = ['⌘', '⌁', '◌', '◇', '⟡', '▤', '↗', '◫', '◍', '✦'];
  return <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-teal/10 font-semibold text-brand-teal">{shapes[index]}</span>;
}
