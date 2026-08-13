import { careerGuide } from '../data/career-guides';

const spanishProfiles = Object.freeze({
  INTJ: ['estrategia de sistemas, investigación rigurosa y mejora a largo plazo', 'explicar decisiones técnicas complejas a las personas colaboradoras', ['Ingeniería de software', 'Ciencia de datos', 'Arquitectura de sistemas', 'Especialista en ciberseguridad', 'Investigación científica', 'Gestión de producto', 'Consultoría estratégica', 'Análisis financiero', 'Investigación de experiencia de usuario', 'Estrategia de operaciones', 'Investigación de políticas públicas', 'Análisis de sistemas de salud']],
  INTP: ['investigación abierta, análisis cuidadoso y pruebas independientes de ideas', 'convertir ideas complejas en explicaciones claras', ['Investigación científica', 'Ingeniería de software', 'Análisis de datos', 'Análisis de sistemas', 'Redacción técnica', 'Investigación de experiencia de usuario', 'Investigación en ciberseguridad', 'Investigación académica', 'Análisis de producto', 'Divulgación científica', 'Ingeniería de datos', 'Análisis de políticas públicas']],
  ENTJ: ['organización de trabajo ambicioso, decisiones y liderazgo orientado a resultados', 'delegar con contexto y criterios claros', ['Dirección de operaciones', 'Liderazgo de estrategia de producto', 'Consultoría de gestión', 'Emprendimiento', 'Gestión financiera', 'Desarrollo de negocio', 'Dirección de programas', 'Gestión de administración pública', 'Liderazgo comercial', 'Análisis estratégico', 'Dirección ejecutiva de proyectos', 'Gestión de operaciones sanitarias']],
  ENTP: ['creación de posibilidades, cuestionamiento de supuestos y experimentación', 'llevar una idea hasta su cierre y seguimiento', ['Estrategia de innovación', 'Liderazgo de descubrimiento de producto', 'Emprendimiento', 'Estrategia comercial', 'Estrategia creativa', 'Consultoría de gestión', 'Producción de medios', 'Análisis de inversión', 'Estrategia de crecimiento', 'Innovación de políticas públicas', 'Investigación de experiencia de usuario', 'Liderazgo de alianzas']],
  INFJ: ['comprensión significativa, trabajo guiado por valores y desarrollo de personas o sistemas', 'poner límites claros alrededor del cuidado', ['Diseño de aprendizaje', 'Escritura', 'Estrategia de impacto social', 'Investigación de experiencia de usuario', 'Facilitación de apoyo no clínico', 'Investigación de políticas públicas', 'Desarrollo organizacional', 'Dirección de programas educativos', 'Estrategia de comunicación', 'Investigación comunitaria', 'Orientación profesional', 'Diseño de servicios']],
  INFP: ['creación de significado, valores personales y trabajo humanamente valioso', 'compartir el trabajo antes de que parezca perfecto', ['Escritura', 'Diseño visual', 'Facilitación de aprendizaje', 'Investigación para la incidencia social', 'Redacción de experiencia de usuario', 'Coordinación de programas comunitarios', 'Ilustración', 'Diseño de contenidos educativos', 'Facilitación de apoyo no clínico', 'Comunicación de impacto social', 'Creación independiente', 'Diseño de servicios']],
  ENFJ: ['desarrollo de personas, dirección compartida y construcción de pertenencia', 'hacer espacio para el desacuerdo', ['Liderazgo de desarrollo de personas', 'Educación', 'Estrategia de comunicación', 'Liderazgo comunitario', 'Desarrollo organizacional', 'Gestión de programas', 'Facilitación de aprendizaje', 'Éxito de clientes', 'Gestión de organizaciones sin ánimo de lucro', 'Selección y desarrollo de talento', 'Liderazgo de participación pública', 'Coaching de equipos']],
  ENFP: ['conexión de ideas y personas, comunicación imaginativa y cambio con energía', 'priorizar y sostener el foco', ['Estrategia creativa', 'Liderazgo de comunicación', 'Emprendimiento', 'Facilitación de aprendizaje', 'Construcción de comunidad', 'Estrategia de marca', 'Gestión de alianzas', 'Producción de medios', 'Marketing de producto', 'Dirección de programas de eventos', 'Educación de clientes', 'Diseño de innovación social']],
});

const spanishSeo = Object.freeze({
  INTJ: ['Guía profesional INTJ: estrategia y sistemas | KalQLater', 'Explora trayectorias para INTJ con contexto sobre estrategia, sistemas, habilidades y condiciones reales de trabajo.'],
  INTP: ['Guía profesional INTP: investigación e ideas | KalQLater', 'Explora trayectorias para INTP con una mirada reflexiva sobre análisis, investigación, habilidades y trabajo cotidiano.'],
  ENTJ: ['Guía profesional ENTJ: liderazgo y ejecución | KalQLater', 'Explora trayectorias para ENTJ con contexto sobre liderazgo, decisiones, ejecución y entornos profesionales.'],
  ENTP: ['Guía profesional ENTP: innovación y experimentación | KalQLater', 'Explora trayectorias para ENTP con contexto sobre innovación, experimentación, habilidades y oportunidades reales.'],
  INFJ: ['Guía profesional INFJ: propósito e impacto | KalQLater', 'Explora trayectorias para INFJ con contexto sobre propósito, valores, acompañamiento y trabajo significativo.'],
  INFP: ['Guía profesional INFP: creatividad y valores | KalQLater', 'Explora trayectorias para INFP con una mirada sobre creatividad, valores, contribución humana y desarrollo profesional.'],
  ENFJ: ['Guía profesional ENFJ: personas y dirección compartida | KalQLater', 'Explora trayectorias para ENFJ con contexto sobre desarrollo de personas, comunidad, comunicación y liderazgo.'],
  ENFP: ['Guía profesional ENFP: ideas, personas y cambio | KalQLater', 'Explora trayectorias para ENFP con una mirada sobre creatividad, comunicación, comunidad y cambio con propósito.'],
});

const roles = (careers, skill) => Object.fromEntries(careers.map((career, index) => [career, {
  reason: `${career} puede ofrecer una forma concreta de explorar esta dirección profesional. Compárala con el trabajo diario, la formación necesaria y las oportunidades reales.`,
  demand: `Una dificultad habitual en ${career} es equilibrar calidad, contexto y expectativas de otras personas.`,
  skill: `Una habilidad útil para desarrollar es ${index % 2 ? 'la comunicación con personas implicadas' : skill}.`,
}]));

const guideContext = (careers, lens, skill) => ({
  roleDetails: roles(careers, skill),
  settings: [['Trabajo autónomo', 'con puntos de contacto y límites de decisión claros'], ['Especialización profunda', 'con conversaciones sobre la experiencia real'], ['Exploración flexible', 'con hitos de entrega visibles'], ['Perspectiva de largo plazo', 'con ciclos breves de retroalimentación']],
  formats: [['Remoto', `Las decisiones por escrito y los traspasos claros pueden ayudar en ${careers[0]}.`], ['Híbrido', `Combina concentración y relación intencional al explorar ${careers[1]}.`], ['Presencial', `Aprovecha el contexto rápido y la colaboración sin perder tiempo de foco en ${careers[2]}.`]],
  skills: [`Prueba una tarea esencial de ${careers[0]} en un proyecto pequeño.`, `Explica una cuestión de ${careers[1]} a alguien no especialista.`, `Distingue evidencia útil y límites en ${careers[2]}.`, `Pide retroalimentación sobre una entrega vinculada a ${careers[3]}.`, `Practica ${skill} con una persona colaboradora.`],
  stages: [['Estudios', `Crea una práctica breve de ${careers[0]} para conocer el trabajo cotidiano.`], ['Inicio profesional', `Busca experiencias de ${careers[1]} con aprendizaje de base y retroalimentación fiable.`], ['Cambio de trayectoria', `Relaciona tu experiencia actual con el lenguaje de habilidades de ${careers[2]}.`], ['Gestión', `En direcciones como ${careers[3]}, desarrolla capacidades de personas además de resultados.`], ['Proyecto propio', `Comprueba el interés por ${careers[4]} mediante un experimento pequeño y responsable.`]],
  industries: [['Tecnología y plataformas', `Examina cómo ${careers[0]} y ${careers[1]} abordan producto, datos y complejidad de servicio.`], ['Investigación y educación', `En ${careers[2]} y ${careers[3]}, considera evidencia, aprendizaje e impacto a largo plazo.`], ['Finanzas y análisis', `En ${careers[4]} y ${careers[5]}, revisa calidad de decisión y responsabilidad.`], ['Salud y servicio público', `En ${careers[6]} y ${careers[7]}, valora confianza, regulación e impacto en las personas.`], ['Comunicación y experiencia', `En ${careers[8]} y ${careers[9]}, equilibra audiencia, mensaje y experiencia vivida.`], ['Operaciones y cambio', `En ${careers[10]} y ${careers[11]}, comprende proceso, alianzas y responsabilidad de implementación.`]],
});

const faq = (code, lens, skill) => [
  [`¿Qué trayectorias puede explorar una persona ${code}?`, `Las direcciones vinculadas con ${lens} pueden ser interesantes para investigar junto con intereses, experiencia, acceso y circunstancias.`],
  [`¿${code} debería decidir una trayectoria profesional?`, 'No. La personalidad puede abrir preguntas útiles, pero las habilidades, los valores, el acceso y las condiciones reales importan más.'],
  ['¿La personalidad predice el éxito profesional?', 'No. El desempeño y la satisfacción dependen de aprendizaje, contexto, oportunidades, relaciones y muchas otras variables.'],
  [`¿Cómo puede una persona ${code} probar una dirección?`, 'Prueba un proyecto pequeño, conversa con una persona que ejerza, observa trabajo real o analiza una oferta antes de tomar una decisión grande.'],
  ['¿Estas direcciones son recomendaciones de empleo?', 'No. Son puntos de partida para la exploración; cada rol debe evaluarse por su trabajo cotidiano, requisitos, contexto y límites.'],
  [`¿Qué habilidad puede ampliar las opciones de ${code}?`, `Practicar ${skill} puede ayudar, junto con las habilidades específicas que demande cada rol.`],
  ['¿Puede cambiar una trayectoria con el tiempo?', 'Sí. Las trayectorias cambian con el aprendizaje, las responsabilidades, las oportunidades y las prioridades personales.'],
  ['¿Cómo deberían usar esta información las empresas?', 'Solo como reflexión voluntaria. La personalidad no debe utilizarse para filtrar, clasificar ni tomar decisiones de contratación.'],
];

export function getCareerGuideContent(locale, type) {
  const code = String(type || '').toUpperCase();
  if (locale === 'es') {
    const profile = spanishProfiles[code];
    if (!profile) throw new Error(`Spanish career guide unavailable: ${code}`);
    const [lens, skill, careers] = profile;
    const [title, description] = spanishSeo[code];
    return Object.freeze({ code, lens, skill, careers, ...guideContext(careers, lens, skill), title, description, hero: `Explora trabajos donde ${lens} puede resultarte una lente útil de autorreflexión.`, disclaimer: 'La personalidad es solo una perspectiva para explorar trayectorias: no es una decisión de contratación, una medida de capacidad ni una garantía de éxito.', faq: faq(code, lens, skill) });
  }
  if (locale !== 'en' && locale !== 'hi') throw new Error(`Career guide locale unavailable: ${locale}`);
  return careerGuide(type, locale);
}
