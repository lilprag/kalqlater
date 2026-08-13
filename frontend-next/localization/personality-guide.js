import { personalityProfile, typeFaq, typeFromSlug } from '../lib/personality';

const intjSpanish = Object.freeze({
  code: 'INTJ', slug: 'intj', group: 'Analistas', color: '#4A2B4D', displayName: 'El arquitecto',
  shortSummary: 'Una mente estratégica que suele ver la estructura antes que el ruido.',
  overview: 'Las personas INTJ tienden a observar los sistemas con distancia, buscar la lógica que los sostiene y pensar en sus consecuencias a largo plazo. Su independencia no equivale a desconexión: a menudo necesitan espacio para elaborar una idea antes de compartirla.',
  coreTraits: ['Visión de conjunto', 'Autonomía intelectual', 'Análisis sereno'],
  strengths: ['Pensamiento a largo plazo', 'Disciplina personal', 'Análisis lógico', 'Decisión fundamentada', 'Concentración profunda'],
  growthAreas: ['Expresar antes de cerrar una conclusión', 'Dar cabida a la dimensión emocional', 'Evitar que la exigencia se convierta en distancia', 'Aceptar que no todo necesita una solución inmediata'],
  workStyle: ['Estrategia y arquitectura de sistemas', 'Investigación y análisis de problemas complejos', 'Diseño de políticas o procesos', 'Consultoría basada en evidencia', 'Trabajo autónomo con objetivos claros'],
  careerThemes: ['Estrategia y diseño de sistemas', 'Investigación rigurosa', 'Mejora sostenida a largo plazo'],
  relationshipStyle: 'Las amistades INTJ suelen crecer con ideas compartidas, coherencia y libertad para pensar por cuenta propia. Aunque su círculo puede ser pequeño, invierten mucho cuando la confianza se consolida.',
  relationshipContexts: {
    friendship: 'Las amistades INTJ suelen crecer con ideas compartidas, coherencia y libertad para pensar por cuenta propia. Aunque su círculo puede ser pequeño, invierten mucho cuando la confianza se consolida.',
    romance: 'En pareja, una persona INTJ puede cuidar a través de la planificación, la lealtad y la resolución de problemas. Poner en palabras el afecto y las expectativas vuelve más accesible su mundo interior.',
    family: 'En la familia, INTJ puede asumir decisiones de largo alcance y, al mismo tiempo, necesitar que se respete su autonomía. Los límites claros suelen funcionar mejor que las obligaciones implícitas.',
    teamwork: 'En equipo, INTJ aporta estrategia, pensamiento sistémico y responsabilidad tranquila. Colabora mejor cuando las reuniones tienen propósito y la crítica se dirige a la idea, no a la persona.',
  },
  leadership: { style: 'Da dirección al convertir una visión amplia en una estructura clara.', summary: 'Suele liderar desde la preparación, la estrategia y un criterio sostenido.', strengths: ['Pensamiento sistémico', 'Criterio independiente', 'Orientación al futuro'], weeklyAction: 'Antes de decidir, invita a una persona a señalar un supuesto que quizá no estés viendo.' },
  communication: { summary: 'Suele preferir conversaciones con propósito, precisión y tiempo para pensar.', preferred: 'Explicar el contexto y la lógica antes de entrar en los detalles.', listening: 'Escuchar mejor cuando la otra persona nombra con claridad lo que necesita.', conflict: 'Puede retirarse para procesar; volver con una petición concreta ayuda a reparar.', tips: ['Comparte una versión provisional de tu razonamiento antes de que parezca una conclusión cerrada.', 'Pregunta qué impacto humano tiene una decisión, además de si es eficiente.'] },
  learningStyle: 'Aprende bien al profundizar, conectar conceptos y probar una idea en un problema real.', stressPatterns: ['Aislarse demasiado', 'Volverse más crítico o rígido', 'Sentir que todo depende de uno mismo', 'Posponer una conversación incómoda'], developmentTips: ['Explica tu razonamiento mientras aún está en proceso.', 'Pide una perspectiva que no confirme tu primera hipótesis.'], relatedTypes: ['INTP', 'ENTJ', 'ENTP'],
});

const intjFaq = Object.freeze([
  ['¿Qué describe esta guía INTJ?', 'Resume preferencias, fortalezas y posibilidades de desarrollo asociadas a INTJ. Es una invitación a reflexionar, no una definición cerrada de una persona.'],
  ['¿INTJ es un diagnóstico?', 'No. KalQLater es una herramienta de autorreflexión; no ofrece diagnósticos clínicos ni debe utilizarse para contratar o descartar a nadie.'],
  ['¿Puede una persona INTJ liderar bien?', 'Sí. El liderazgo también se cultiva mediante prácticas como escuchar, delegar, comunicar con claridad y pedir retroalimentación.'],
  ['¿Qué puede buscar INTJ en el trabajo?', 'Suele valorar problemas complejos, margen para pensar con profundidad y la posibilidad de mejorar sistemas con sentido.'],
  ['¿Cómo puede mostrarse INTJ en las relaciones?', 'Puede expresar cuidado con lealtad, atención a lo práctico y voluntad de resolver. Nombrar el afecto hace que esa intención sea más visible.'],
  ['¿Qué puede ayudar bajo presión?', 'Descansar, poner límites, hablar con alguien de confianza y recurrir a apoyo profesional cualificado si el malestar es persistente o intenso.'],
  ['¿El tipo de personalidad puede cambiar?', 'Las personas aprenden y cambian con la experiencia, los roles y las etapas de vida. Conviene usar esta guía como una señal para reflexionar, no como una identidad rígida.'],
  ['¿Cómo deberían usar esta información las empresas?', 'Solo como reflexión voluntaria. Un tipo de personalidad no debe emplearse para filtrar, clasificar ni tomar decisiones de contratación.'],
]);

export function getPersonalityGuideContent(locale, type) {
  const code = typeFromSlug(type);
  if (!code) return null;
  if (locale === 'es') {
    if (code !== 'INTJ') throw new Error(`Spanish personality guide unavailable: ${code}`);
    return Object.freeze({ profile: intjSpanish, faq: intjFaq });
  }
  if (locale !== 'en' && locale !== 'hi') throw new Error(`Personality guide locale unavailable: ${locale}`);
  const profile = personalityProfile(code, locale);
  return Object.freeze({ profile, faq: typeFaq(profile, locale) });
}
