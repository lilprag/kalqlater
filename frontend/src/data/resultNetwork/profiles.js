const TYPES = {
    INTJ: ['Strategic Architect', 'रणनीतिक वास्तुकार', 'systems, clarity, and a long horizon', 'systems and a long horizon', 'Product strategy', 'research-led teams'],
    INTP: ['Systems Explorer', 'सिस्टम्स एक्सप्लोरर', 'ideas, models, and elegant answers', 'ideas and elegant answers', 'Research', 'deep-work teams'],
    ENTJ: ['Visionary Operator', 'दूरदर्शी संचालक', 'ambition, momentum, and decisive execution', 'ambition and decisive execution', 'Business leadership', 'high-ownership teams'],
    ENTP: ['Idea Catalyst', 'आइडिया कैटलिस्ट', 'possibility, debate, and fresh experiments', 'possibility and fresh experiments', 'Innovation', 'early-stage teams'],
    INFJ: ['Insightful Guide', 'अंतर्दृष्टिपूर्ण मार्गदर्शक', 'meaning, people, and purposeful change', 'meaning and purposeful change', 'People strategy', 'mission-led teams'],
    INFP: ['Values-Driven Creator', 'मूल्य-प्रेरित रचनाकार', 'authenticity, imagination, and human meaning', 'authenticity and imagination', 'Creative work', 'values-led teams'],
    ENFJ: ['People Builder', 'लोगों का निर्माता', 'growth, connection, and shared possibility', 'connection and shared possibility', 'Community leadership', 'collaborative teams'],
    ENFP: ['Creative Explorer', 'रचनात्मक खोजकर्ता', 'energy, people, and new directions', 'energy and new directions', 'Brand and community', 'creative teams'],
    ISTJ: ['Reliable Guardian', 'विश्वसनीय संरक्षक', 'standards, trust, and dependable progress', 'standards and dependable progress', 'Operations', 'structured teams'],
    ISFJ: ['Steady Supporter', 'स्थिर सहयोगी', 'care, detail, and quiet reliability', 'care and quiet reliability', 'Client success', 'supportive teams'],
    ESTJ: ['Execution Leader', 'कार्यान्वयन नेता', 'order, accountability, and practical outcomes', 'accountability and practical outcomes', 'Operations leadership', 'execution-focused teams'],
    ESFJ: ['Community Builder', 'समुदाय निर्माता', 'belonging, care, and coordinated action', 'belonging and coordinated action', 'People operations', 'people-first teams'],
    ISTP: ['Practical Innovator', 'व्यावहारिक नवप्रवर्तक', 'craft, calm problem-solving, and autonomy', 'craft and calm problem-solving', 'Engineering', 'hands-on teams'],
    ISFP: ['Authentic Creator', 'प्रामाणिक रचनाकार', 'craft, values, and lived experience', 'craft and lived experience', 'Design', 'craft-focused teams'],
    ESTP: ['Bold Operator', 'साहसी संचालक', 'action, resourcefulness, and real-time insight', 'action and real-time insight', 'Growth and sales', 'fast-moving teams'],
    ESFP: ['Energizing Connector', 'ऊर्जावान कनेक्टर', 'experience, optimism, and human connection', 'optimism and human connection', 'Community and events', 'people-facing teams'],
};

const RARITY = { INTJ: '2.3%', INFJ: '1.5%', ENTJ: '1.8%', INTP: '3.3%', ENTP: '3.2%', INFP: '4.4%', ENFJ: '2.5%', ENFP: '8.1%', ISTJ: '11.6%', ISFJ: '13.8%', ESTJ: '8.7%', ESFJ: '12.0%', ISTP: '5.4%', ISFP: '8.8%', ESTP: '4.3%', ESFP: '8.5%' };

export function profileFor(code, lang = 'en') {
    const profile = TYPES[code];
    if (!profile) return null;
    const hi = lang === 'hi';
    return {
        code,
        name: hi ? profile[1] : profile[0],
        rarity: RARITY[code],
        focus: hi ? profile[3] : profile[2],
        career: hi ? 'सार्थक काम' : profile[4],
        team: hi ? 'सोच-समझकर काम करने वाली टीमें' : profile[5],
        badges: hi ? ['विशिष्ट दृष्टिकोण', 'सचेत निर्णय', 'दीर्घकालिक सोच'] : ['Distinct perspective', 'Intentional decisions', 'Long-horizon thinker'],
    };
}

export const SUPPORTED_TYPES = Object.keys(TYPES);
