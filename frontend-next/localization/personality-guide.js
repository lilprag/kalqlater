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
  seo: { title: 'Personalidad INTJ: estrategia, vínculos y desarrollo | KalQLater', description: 'Explora la personalidad INTJ con una guía de autorreflexión sobre estrategia, relaciones, comunicación y desarrollo.' },
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

const intpSpanish = Object.freeze({
  code: 'INTP', slug: 'intp', group: 'Analistas', color: '#5D3760', displayName: 'La mente lógica',
  shortSummary: 'Una mente curiosa que desarma las ideas para entender cómo funcionan.',
  overview: 'Las personas INTP suelen sentirse atraídas por las preguntas abiertas, los modelos que explican un problema y la libertad de revisar una conclusión. Su forma de pensar puede parecer silenciosa desde fuera, pero a menudo está llena de conexiones, matices y posibilidades que todavía están tomando forma.',
  coreTraits: ['Curiosidad conceptual', 'Rigor analítico', 'Apertura a posibilidades'],
  strengths: ['Pensamiento original', 'Análisis profundo', 'Flexibilidad intelectual', 'Resolución creativa de problemas', 'Imparcialidad'],
  growthAreas: ['Convertir las ideas en próximos pasos visibles', 'Compartir la duda antes de tener una respuesta completa', 'Atender las necesidades emocionales además de la lógica', 'Cerrar una decisión lo suficiente como para ponerla a prueba'],
  workStyle: ['Investigación y análisis de problemas complejos', 'Diseño de sistemas y modelos', 'Exploración autónoma con tiempo para profundizar', 'Resolución de problemas que admiten varias hipótesis', 'Entornos que valoran la curiosidad y el aprendizaje continuo'],
  careerThemes: ['Investigación y análisis', 'Diseño de sistemas y soluciones', 'Exploración de ideas complejas'],
  relationshipStyle: 'Las amistades INTP suelen nacer de una conversación estimulante, el humor compartido y la libertad de ser uno mismo. Pueden necesitar tiempo a solas para ordenar lo que sienten, pero la confianza se fortalece cuando encuentran personas que respetan su curiosidad y su ritmo.',
  relationshipContexts: {
    friendship: 'Las amistades INTP suelen florecer alrededor de preguntas interesantes, humor y libertad para discrepar. Valoran los vínculos en los que pueden explorar una idea sin tener que llegar de inmediato a una respuesta.',
    romance: 'En pareja, una persona INTP puede mostrar afecto con atención, ingenio y el deseo de comprender al otro. Nombrar lo que siente y preguntar por las necesidades de la relación ayuda a que su interés sea más fácil de reconocer.',
    family: 'En la familia, INTP puede aportar una mirada alternativa ante los problemas y necesitar espacio para procesar. Las conversaciones directas y sin suposiciones facilitan la cercanía sin invadir su autonomía.',
    teamwork: 'En equipo, INTP contribuye al detectar incoherencias, plantear opciones y profundizar en una pregunta difícil. Suele colaborar mejor cuando hay margen para pensar y una forma clara de transformar la exploración en decisiones.',
  },
  leadership: { style: 'Aporta liderazgo al abrir posibilidades y convertir preguntas complejas en una comprensión más clara.', summary: 'Suele influir a través de la curiosidad, la precisión y la disposición a revisar una idea cuando aparece mejor evidencia.', strengths: ['Pensamiento crítico', 'Creatividad conceptual', 'Apertura a la evidencia'], weeklyAction: 'Comparte una hipótesis todavía incompleta y acuerda con el equipo cuál será el siguiente paso para comprobarla.' },
  communication: { summary: 'Suele disfrutar las conversaciones que permiten explorar ideas sin simplificarlas demasiado pronto.', preferred: 'Plantear la pregunta y el razonamiento antes de pedir una conclusión.', listening: 'Escuchar con más presencia cuando también se atiende a la experiencia emocional de la otra persona.', conflict: 'Puede distanciarse para pensar; volver con una observación concreta y una pregunta abierta ayuda a retomar el diálogo.', tips: ['Di qué parte de tu razonamiento sigue siendo una hipótesis y qué necesitarías para revisarla.', 'Antes de ofrecer una solución, pregunta cómo está viviendo la otra persona la situación.'] },
  learningStyle: 'Aprende bien al investigar por cuenta propia, conectar conceptos y experimentar con una idea hasta entender su lógica interna.',
  stressPatterns: ['Perderse en análisis sin cierre', 'Posponer decisiones por seguir explorando opciones', 'Desconectarse de las necesidades prácticas o emocionales', 'Volverse más escéptico o irónico'],
  developmentTips: ['Elige un criterio suficiente para decidir cuándo dejar de investigar.', 'Comparte una idea en borrador antes de sentir que está completamente terminada.'],
  relatedTypes: ['INTJ', 'ENTJ', 'ENTP'],
  seo: { title: 'Personalidad INTP: curiosidad, ideas y desarrollo | KalQLater', description: 'Explora la personalidad INTP con una guía de autorreflexión sobre pensamiento analítico, comunicación, relaciones y desarrollo.' },
});

const intpFaq = Object.freeze([
  ['¿Qué describe esta guía INTP?', 'Resume preferencias, fortalezas y posibilidades de desarrollo asociadas a INTP. Sirve para observar patrones con curiosidad, no para encerrar a una persona en una etiqueta.'],
  ['¿INTP es un diagnóstico?', 'No. KalQLater propone reflexión personal; no ofrece diagnósticos clínicos ni debe usarse para evaluar la capacidad o la idoneidad de nadie.'],
  ['¿Puede una persona INTP liderar bien?', 'Sí. Puede liderar al formular buenas preguntas, pensar con rigor y crear espacio para ideas nuevas. Escuchar, decidir y comunicar con claridad son habilidades que se desarrollan con práctica.'],
  ['¿Qué puede buscar INTP en el trabajo?', 'Suele valorar problemas interesantes, autonomía para investigar y entornos que permitan aprender, mejorar y cuestionar supuestos con respeto.'],
  ['¿Cómo puede mostrarse INTP en las relaciones?', 'Puede demostrar interés mediante la atención, la curiosidad y las conversaciones con profundidad. Expresar afecto y necesidades de forma explícita ayuda a que esa intención se perciba mejor.'],
  ['¿Qué puede ayudar bajo presión?', 'Reducir estímulos, volver a una prioridad concreta, descansar y hablar con alguien de confianza pueden ayudar. Si el malestar es persistente o intenso, conviene buscar apoyo profesional cualificado.'],
  ['¿El tipo de personalidad puede cambiar?', 'Las personas se transforman con la experiencia, los roles y las etapas de vida. Esta guía es una herramienta de reflexión, no una identidad fija.'],
  ['¿Cómo deberían usar esta información las empresas?', 'Solo como reflexión voluntaria. Un tipo de personalidad no debe utilizarse para filtrar, clasificar ni tomar decisiones de contratación.'],
]);

const entjSpanish = Object.freeze({
  code: 'ENTJ', slug: 'entj', group: 'Analistas', color: '#7A3A4A', displayName: 'La persona dirigente',
  shortSummary: 'Una presencia orientada a convertir una visión ambiciosa en movimiento con propósito.',
  overview: 'Las personas ENTJ suelen detectar con rapidez lo que hace falta para avanzar: una dirección clara, una decisión y una forma de coordinar esfuerzos. Su impulso no se reduce a mandar; a menudo nace del deseo de dar estructura a una posibilidad y de ver que una idea se convierte en algo útil para las personas implicadas.',
  coreTraits: ['Dirección estratégica', 'Iniciativa decidida', 'Visión de conjunto'],
  strengths: ['Capacidad de organización', 'Decisión en contextos complejos', 'Comunicación directa', 'Orientación a resultados', 'Confianza para asumir responsabilidad'],
  growthAreas: ['Escuchar antes de definir la solución', 'Regular el ritmo para que otras personas puedan participar', 'Distinguir la urgencia real de la presión autoimpuesta', 'Reconocer el valor de una contribución menos visible'],
  workStyle: ['Definición de prioridades y estrategias', 'Coordinación de equipos hacia objetivos claros', 'Resolución de problemas con impacto', 'Diseño de procesos que hacen avanzar un proyecto', 'Entornos donde se combina autonomía con responsabilidad'],
  careerThemes: ['Estrategia y ejecución', 'Liderazgo de proyectos y personas', 'Construcción de sistemas con impacto'],
  relationshipStyle: 'Las amistades ENTJ suelen construirse a partir de respeto mutuo, conversaciones honestas y proyectos que dan energía. Su lealtad puede mostrarse al animar, organizar o abrir oportunidades; reservar tiempo para la cercanía sin objetivo fortalece también esos vínculos.',
  relationshipContexts: {
    friendship: 'Las amistades ENTJ suelen crecer con respeto, franqueza y ganas de impulsar la vida de quienes quieren. Dejar espacio para conversar sin resolver nada de inmediato ayuda a que la relación no se convierta solo en un plan de acción.',
    romance: 'En pareja, una persona ENTJ puede expresar compromiso al planificar, proteger lo importante y tomar iniciativa. Preguntar qué necesita la otra persona —en lugar de anticiparlo todo— deja sitio para una intimidad más compartida.',
    family: 'En la familia, ENTJ puede asumir responsabilidades con facilidad y querer que las cosas funcionen. Acordar límites, ritmos y expectativas de forma explícita evita que su ayuda se viva como control.',
    teamwork: 'En equipo, ENTJ aporta dirección, energía para decidir y claridad sobre las prioridades. Su contribución gana alcance cuando invita al desacuerdo fundamentado y da tiempo para que otras voces completen la perspectiva.',
  },
  leadership: { style: 'Moviliza al equipo al conectar una meta ambiciosa con decisiones claras y responsabilidades concretas.', summary: 'Suele liderar desde la estrategia, la energía de ejecución y la voluntad de asumir decisiones difíciles.', strengths: ['Visión estratégica', 'Capacidad de movilización', 'Responsabilidad ante los resultados'], weeklyAction: 'En la próxima decisión relevante, pide primero dos riesgos o alternativas al equipo y resume lo que cambió en tu planteamiento.' },
  communication: { summary: 'Suele comunicarse con claridad, rapidez y atención a lo que permite avanzar.', preferred: 'Explicar la prioridad, el motivo y el resultado esperado antes de repartir tareas.', listening: 'Escuchar mejor cuando convierte una objeción en una fuente de información, no en un freno al ritmo.', conflict: 'Puede volverse tajante bajo presión; pausar, nombrar el objetivo común y hacer una pregunta concreta ayuda a bajar la tensión.', tips: ['Distingue entre una instrucción urgente y una conversación que necesita participación real.', 'Antes de cerrar un tema, pregunta qué efecto tendría la decisión sobre quienes la llevarán a cabo.'] },
  learningStyle: 'Aprende bien al relacionar una idea con una meta, ponerla a prueba en la práctica y recibir retroalimentación que permita afinar la ejecución.',
  stressPatterns: ['Acelerar el ritmo sin comprobar la capacidad del equipo', 'Tomar demasiado control', 'Responder con impaciencia ante la duda', 'Medir el propio valor solo por el avance conseguido'],
  developmentTips: ['Antes de actuar, identifica qué información solo puede aportar otra persona.', 'Reserva un momento para reconocer el progreso, no únicamente lo que todavía falta.'],
  relatedTypes: ['INTJ', 'INTP', 'ENTP'],
  seo: { title: 'Personalidad ENTJ: liderazgo, estrategia y desarrollo | KalQLater', description: 'Explora la personalidad ENTJ con una guía de autorreflexión sobre liderazgo, decisiones, relaciones, comunicación y desarrollo.' },
});

const entjFaq = Object.freeze([
  ['¿Qué describe esta guía ENTJ?', 'Resume preferencias, fortalezas y posibilidades de desarrollo asociadas a ENTJ. Es una guía para observar patrones propios, no una definición total de una persona.'],
  ['¿ENTJ es un diagnóstico?', 'No. KalQLater es una herramienta de autorreflexión; no ofrece diagnósticos clínicos ni debe utilizarse para medir la capacidad de una persona.'],
  ['¿Puede una persona ENTJ liderar bien?', 'Sí. El liderazgo se amplía al combinar dirección con escucha, delegación, criterio y cuidado por el contexto de las personas. Son prácticas que se pueden aprender.'],
  ['¿Qué puede buscar ENTJ en el trabajo?', 'Suele valorar objetivos claros, retos con impacto y margen para coordinar recursos, tomar decisiones y mejorar la manera de trabajar.'],
  ['¿Cómo puede mostrarse ENTJ en las relaciones?', 'Puede mostrar cuidado tomando iniciativa, siendo leal y buscando soluciones. Preguntar, escuchar y expresar afecto sin convertirlo en una tarea acerca esa intención a la otra persona.'],
  ['¿Qué puede ayudar bajo presión?', 'Bajar el ritmo, revisar las prioridades, compartir responsabilidades y recurrir a una conversación de confianza pueden ayudar. Ante un malestar persistente o intenso, busca apoyo profesional cualificado.'],
  ['¿El tipo de personalidad puede cambiar?', 'Las personas cambian con la experiencia, los roles y las etapas de vida. Esta guía ofrece un punto de reflexión, no una identidad definitiva.'],
  ['¿Cómo deberían usar esta información las empresas?', 'Solo como reflexión voluntaria. Un tipo de personalidad no debe usarse para filtrar, clasificar ni tomar decisiones de contratación.'],
]);

const spanishGuides = Object.freeze({
  INTJ: Object.freeze({ profile: intjSpanish, faq: intjFaq }),
  INTP: Object.freeze({ profile: intpSpanish, faq: intpFaq }),
  ENTJ: Object.freeze({ profile: entjSpanish, faq: entjFaq }),
});

export function getPersonalityGuideContent(locale, type) {
  const code = typeFromSlug(type);
  if (!code) return null;
  if (locale === 'es') {
    const guide = spanishGuides[code];
    if (!guide) throw new Error(`Spanish personality guide unavailable: ${code}`);
    return guide;
  }
  if (locale !== 'en' && locale !== 'hi') throw new Error(`Personality guide locale unavailable: ${locale}`);
  const profile = personalityProfile(code, locale);
  return Object.freeze({ profile, faq: typeFaq(profile, locale) });
}
