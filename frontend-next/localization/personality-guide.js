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

const entpSpanish = Object.freeze({
  code: 'ENTP', slug: 'entp', group: 'Analistas', color: '#B55C48', displayName: 'La mente exploradora',
  shortSummary: 'Una presencia inquieta que encuentra posibilidades donde otras personas ven una respuesta cerrada.',
  overview: 'Las personas ENTP suelen acercarse al mundo con curiosidad, rapidez mental y ganas de poner una idea a prueba. Disfrutan al conectar perspectivas que parecían separadas y al descubrir qué cambia cuando una pregunta se formula de otra manera. Su energía puede abrir caminos inesperados; elegir cuáles merecen continuidad les permite convertir esa amplitud en impacto.',
  coreTraits: ['Curiosidad expansiva', 'Agilidad para conectar ideas', 'Apertura al cambio'],
  strengths: ['Creatividad estratégica', 'Capacidad de improvisación', 'Pensamiento crítico', 'Entusiasmo para iniciar', 'Facilidad para ver alternativas'],
  growthAreas: ['Sostener una prioridad después de que desaparece la novedad', 'Escuchar una objeción sin convertirla en debate', 'Cerrar compromisos con el mismo cuidado con que se abren ideas', 'Notar cuándo el humor evita una conversación importante'],
  workStyle: ['Exploración de oportunidades y nuevas direcciones', 'Resolución de problemas ambiguos', 'Conversaciones que requieren creatividad y persuasión', 'Proyectos con margen para experimentar', 'Entornos donde las ideas se pueden probar y ajustar con rapidez'],
  careerThemes: ['Innovación y experimentación', 'Estrategia en contextos cambiantes', 'Comunicación de ideas y oportunidades'],
  relationshipStyle: 'Las amistades ENTP suelen activarse con una conversación viva, el humor y la sensación de que juntos pueden descubrir algo nuevo. Aprecian a quienes pueden seguir el juego de las ideas y también señalar con honestidad cuándo una conexión necesita más presencia que ingenio.',
  relationshipContexts: {
    friendship: 'Las amistades ENTP suelen alimentarse de planes espontáneos, conversaciones que saltan de tema y una curiosidad compartida. Mantener el contacto cuando no hay novedad demuestra que el vínculo importa más allá del estímulo del momento.',
    romance: 'En pareja, una persona ENTP puede aportar juego, imaginación y el deseo de mantener la relación en movimiento. Hacer espacio para la vulnerabilidad y cumplir los pequeños acuerdos vuelve esa energía más segura para ambas personas.',
    family: 'En la familia, ENTP puede cuestionar costumbres, aportar una lectura fresca y necesitar libertad para probar su propio camino. Conversar con claridad sobre los límites evita que su necesidad de explorar se interprete como falta de compromiso.',
    teamwork: 'En equipo, ENTP genera opciones, detecta oportunidades y anima una discusión productiva. Su mejor aporte aparece cuando ayuda a elegir una dirección y acompaña al grupo durante la etapa menos visible de ejecución.',
  },
  leadership: { style: 'Energiza al grupo al convertir una posibilidad incierta en una conversación que invita a experimentar.', summary: 'Suele influir desde la visión de alternativas, la persuasión y la capacidad de adaptarse cuando cambian las condiciones.', strengths: ['Lectura de oportunidades', 'Comunicación convincente', 'Adaptación creativa'], weeklyAction: 'Elige una idea que hayas propuesto y define con el equipo un responsable, una fecha de revisión y una señal concreta de avance.' },
  communication: { summary: 'Suele comunicarse con rapidez, curiosidad y gusto por explorar distintas interpretaciones.', preferred: 'Abrir la conversación con una pregunta provocadora y aclarar después qué decisión o aprendizaje busca.', listening: 'Escuchar con más profundidad cuando deja terminar una idea antes de contrastarla con otra posibilidad.', conflict: 'Puede debatir para pensar y no advertir el impacto; preguntar qué necesita la otra persona antes de responder ayuda a reparar.', tips: ['Separa el momento de generar opciones del momento de decidir cuál se llevará adelante.', 'Si una conversación importa, confirma lo que entendiste antes de ofrecer el siguiente argumento.'] },
  learningStyle: 'Aprende bien al dialogar, relacionar conceptos distantes y ensayar una hipótesis en situaciones reales donde pueda recibir una respuesta rápida.',
  stressPatterns: ['Dispersarse entre demasiadas posibilidades', 'Buscar estímulo cuando una tarea exige constancia', 'Convertir la tensión en ironía o discusión', 'Evitar el cierre por miedo a perder opciones'],
  developmentTips: ['Elige una idea por semana que merezca pasar de la conversación a la práctica.', 'Pide a alguien que te ayude a distinguir entre una intuición prometedora y una distracción atractiva.'],
  relatedTypes: ['INTJ', 'INTP', 'ENTJ'],
  seo: { title: 'Personalidad ENTP: ideas, cambio y desarrollo | KalQLater', description: 'Explora la personalidad ENTP con una guía de autorreflexión sobre creatividad, comunicación, relaciones, decisiones y desarrollo.' },
});

const entpFaq = Object.freeze([
  ['¿Qué describe esta guía ENTP?', 'Resume preferencias, fortalezas y posibilidades de desarrollo asociadas a ENTP. Es una invitación a observar patrones, no una explicación completa ni permanente de una persona.'],
  ['¿ENTP es un diagnóstico?', 'No. KalQLater es una herramienta de autorreflexión; no ofrece diagnósticos clínicos ni debe utilizarse para medir la capacidad o el potencial de alguien.'],
  ['¿Puede una persona ENTP liderar bien?', 'Sí. Puede liderar al abrir posibilidades, comunicar una visión y adaptarse a la evidencia. La escucha, la constancia y la claridad de los acuerdos hacen que ese liderazgo sea más sostenible.'],
  ['¿Qué puede buscar ENTP en el trabajo?', 'Suele valorar los retos cambiantes, la posibilidad de crear, aprender y debatir ideas, y entornos donde una propuesta pueda convertirse en un experimento útil.'],
  ['¿Cómo puede mostrarse ENTP en las relaciones?', 'Puede demostrar interés con curiosidad, humor y atención a lo que hace única a la otra persona. Cumplir acuerdos y hablar con honestidad sobre lo que siente fortalece esa conexión.'],
  ['¿Qué puede ayudar bajo presión?', 'Reducir compromisos, elegir una prioridad y conversar con alguien de confianza pueden devolver perspectiva. Si el malestar es persistente o intenso, busca apoyo profesional cualificado.'],
  ['¿El tipo de personalidad puede cambiar?', 'Las personas cambian con la experiencia, los roles y las etapas de vida. Esta guía ayuda a reflexionar sobre tendencias, no a fijar una identidad.'],
  ['¿Cómo deberían usar esta información las empresas?', 'Solo como reflexión voluntaria. Un tipo de personalidad no debe utilizarse para filtrar, clasificar ni tomar decisiones de contratación.'],
]);

const infjSpanish = Object.freeze({
  code: 'INFJ', slug: 'infj', group: 'Diplomáticos', color: '#2D6F68', displayName: 'La mirada orientadora',
  shortSummary: 'Una presencia reflexiva que busca dar sentido a las personas, los patrones y lo que podría mejorar.',
  overview: 'Las personas INFJ suelen observar lo que no siempre se dice: el hilo que une una situación, las necesidades que quedan al margen y la dirección que podría dar más coherencia a un grupo. Su sensibilidad no implica fragilidad; puede ser una forma de atención sostenida que les ayuda a acompañar con profundidad y a actuar de acuerdo con lo que consideran valioso.',
  coreTraits: ['Intuición de conjunto', 'Atención a las personas', 'Sentido de propósito'],
  strengths: ['Escucha profunda', 'Visión de significado', 'Compromiso con los valores', 'Capacidad de síntesis', 'Apoyo considerado'],
  growthAreas: ['Expresar una necesidad antes de llegar al agotamiento', 'Comprobar las intuiciones con información concreta', 'Aceptar que no puede sostenerlo todo a solas', 'Poner límites sin sentir que abandona a alguien'],
  workStyle: ['Trabajo con un propósito claro', 'Acompañamiento, investigación o diseño centrado en personas', 'Espacio para profundizar antes de decidir', 'Colaboración con confianza y respeto', 'Proyectos donde los valores se traduzcan en acciones concretas'],
  careerThemes: ['Acompañamiento y desarrollo de personas', 'Investigación con sentido social', 'Diseño de cambios coherentes con los valores'],
  relationshipStyle: 'Las amistades INFJ suelen crecer despacio, con confianza, conversaciones significativas y cuidado mutuo. Pueden percibir con facilidad los cambios de ánimo de las personas cercanas; compartir también su propia experiencia evita que la relación se sostenga en una sola dirección.',
  relationshipContexts: {
    friendship: 'Las amistades INFJ suelen valorar la intimidad, la lealtad y la posibilidad de hablar de lo que importa. Respetar sus momentos de recogimiento y preguntar por cómo están de verdad nutre ese vínculo.',
    romance: 'En pareja, una persona INFJ puede buscar conexión emocional, coherencia y un proyecto compartido. Expresar expectativas con claridad ayuda a que el deseo de comprender al otro no se convierta en adivinar lo que necesita.',
    family: 'En la familia, INFJ puede asumir el papel de quien escucha, media o cuida el clima emocional. Reconocer que sus propios límites también importan hace que ese cuidado sea más sostenible.',
    teamwork: 'En equipo, INFJ aporta atención a las dinámicas humanas, perspectiva de largo plazo y preguntas sobre el sentido de lo que se hace. Su contribución se fortalece cuando puede decir una preocupación temprano y encontrar una vía concreta para abordarla.',
  },
  leadership: { style: 'Orienta al grupo al unir propósito, escucha y una lectura cuidadosa de las personas implicadas.', summary: 'Suele influir creando confianza, dando significado a una meta y ayudando a que las decisiones sean coherentes con los valores compartidos.', strengths: ['Empatía estratégica', 'Coherencia ética', 'Capacidad de inspirar con calma'], weeklyAction: 'Antes de resolver una tensión del equipo, pregunta qué necesita cada persona y concreta un límite que mantenga el cuidado viable.' },
  communication: { summary: 'Suele comunicarse con atención, matiz y deseo de que la conversación tenga un propósito humano.', preferred: 'Compartir el contexto y la intención antes de entrar en una cuestión delicada.', listening: 'Escuchar mejor cuando distingue entre lo que intuye y lo que la otra persona ha dicho explícitamente.', conflict: 'Puede retirarse para proteger la relación; nombrar con calma lo que le afecta y pedir un momento para conversar ayuda a reparar.', tips: ['Formula una intuición como pregunta para dejar espacio a que la otra persona la confirme o la matice.', 'Comparte un límite concreto antes de que el cansancio se convierta en distancia.'] },
  learningStyle: 'Aprende bien al conectar una idea con un propósito, profundizar a su ritmo y encontrar cómo ese conocimiento puede servir a una situación real.',
  stressPatterns: ['Absorber demasiado el estado emocional de otras personas', 'Posponer un límite por evitar decepcionar', 'Dar vueltas a una conversación sin contrastarla', 'Aislarse cuando necesita apoyo'],
  developmentTips: ['Diferencia entre responsabilizarte por alguien y estar presente a su lado.', 'Busca una observación verificable cuando una intuición te preocupe.'],
  relatedTypes: ['INTJ', 'INFP', 'ENFJ'],
  seo: { title: 'Personalidad INFJ: propósito, empatía y desarrollo | KalQLater', description: 'Explora la personalidad INFJ con una guía de autorreflexión sobre propósito, vínculos, comunicación, liderazgo y desarrollo.' },
});

const infjFaq = Object.freeze([
  ['¿Qué describe esta guía INFJ?', 'Resume preferencias, fortalezas y posibilidades de desarrollo asociadas a INFJ. Es una herramienta para reflexionar sobre patrones, no una definición cerrada de una persona.'],
  ['¿INFJ es un diagnóstico?', 'No. KalQLater ofrece autorreflexión; no proporciona diagnósticos clínicos ni debe emplearse para juzgar la capacidad o el valor de alguien.'],
  ['¿Puede una persona INFJ liderar bien?', 'Sí. Puede liderar al crear confianza, conectar decisiones con valores y atender la experiencia del equipo. La claridad, los límites y la delegación hacen ese liderazgo más sostenible.'],
  ['¿Qué puede buscar INFJ en el trabajo?', 'Suele valorar un propósito claro, relaciones de respeto y la oportunidad de comprender a fondo un problema antes de contribuir a una mejora significativa.'],
  ['¿Cómo puede mostrarse INFJ en las relaciones?', 'Puede mostrar cuidado con escucha, atención a los detalles y lealtad. Hablar de sus necesidades evita que esa sensibilidad quede escondida detrás de la disposición a ayudar.'],
  ['¿Qué puede ayudar bajo presión?', 'Descansar, limitar responsabilidades, volver a una conversación de confianza y atender las necesidades básicas puede ayudar. Ante un malestar persistente o intenso, busca apoyo profesional cualificado.'],
  ['¿El tipo de personalidad puede cambiar?', 'Las personas evolucionan con la experiencia, los roles y las etapas de vida. Esta guía ofrece una perspectiva para explorar, no una identidad fija.'],
  ['¿Cómo deberían usar esta información las empresas?', 'Solo como reflexión voluntaria. Un tipo de personalidad no debe utilizarse para filtrar, clasificar ni tomar decisiones de contratación.'],
]);

const infpSpanish = Object.freeze({
  code: 'INFP', slug: 'infp', group: 'Diplomáticos', color: '#4A806B', displayName: 'La persona idealista',
  shortSummary: 'Una sensibilidad creativa que busca vivir con autenticidad y dejar espacio a lo que de verdad importa.',
  overview: 'Las personas INFP suelen orientarse por una brújula personal: lo que sienten verdadero, justo o digno de cuidado. Su mundo interior puede ser rico en imágenes, preguntas y posibilidades que todavía no tienen una forma visible. Esa profundidad les permite imaginar alternativas humanas; darles un cauce concreto ayuda a que sus valores se conviertan en presencia y acción.',
  coreTraits: ['Autenticidad personal', 'Imaginación empática', 'Apertura de corazón'],
  strengths: ['Sensibilidad a los valores', 'Creatividad expresiva', 'Capacidad de comprender matices', 'Lealtad a lo importante', 'Apertura a otras perspectivas'],
  growthAreas: ['Dar un primer paso aunque la versión final no esté clara', 'Diferenciar una crítica a una idea de una crítica personal', 'Expresar una necesidad antes de retirarse', 'Proteger el tiempo y la energía para lo que valora'],
  workStyle: ['Proyectos que conectan con un propósito personal', 'Espacio para crear, escribir, investigar o acompañar', 'Autonomía con una estructura amable', 'Entornos que respetan la individualidad', 'Trabajo que permita aportar significado además de resultados'],
  careerThemes: ['Creatividad con propósito', 'Acompañamiento y escucha', 'Comunicación de ideas con sensibilidad'],
  relationshipStyle: 'Las amistades INFP suelen crecer a partir de afinidades sinceras, cuidado mutuo y la sensación de poder mostrarse sin una máscara. Pueden guardar mucho para sí hasta que hay confianza; una pregunta amable y sin prisa suele abrir mejor la conversación que la presión por explicarse.',
  relationshipContexts: {
    friendship: 'Las amistades INFP suelen buscar profundidad, calidez y libertad para compartir intereses poco convencionales. Recordarles que su presencia importa, también en los períodos tranquilos, ayuda a sostener el vínculo.',
    romance: 'En pareja, una persona INFP puede aportar ternura, imaginación y atención a lo que hace única a la relación. Hablar de expectativas cotidianas y límites evita que una conexión idealizada tenga que cargar con lo que nunca se ha dicho.',
    family: 'En la familia, INFP puede necesitar que se respete su manera particular de sentir y decidir. Los acuerdos claros y el reconocimiento de su sensibilidad permiten una cercanía que no exige que renuncie a sí misma.',
    teamwork: 'En equipo, INFP aporta perspectivas humanas, creatividad y una atención valiosa a la coherencia entre lo que se dice y lo que se hace. Su contribución se vuelve más visible cuando comparte sus ideas antes de que estén perfectamente elaboradas.',
  },
  leadership: { style: 'Acompaña al grupo al proteger el sentido del trabajo y crear condiciones donde cada voz pueda aportar algo genuino.', summary: 'Suele influir desde la coherencia, la imaginación y una atención sincera a cómo una decisión afecta a las personas.', strengths: ['Liderazgo con valores', 'Escucha inclusiva', 'Visión creativa'], weeklyAction: 'Elige una idea que te importe y conviértela en una petición concreta al equipo, con un plazo pequeño y alcanzable.' },
  communication: { summary: 'Suele comunicarse con cuidado, imaginación y atención a la intención que hay detrás de las palabras.', preferred: 'Nombrar primero lo que importa y luego explicar la propuesta o la preocupación.', listening: 'Escuchar con más seguridad cuando comprueba lo que ha entendido en lugar de llenar los silencios con suposiciones.', conflict: 'Puede retirarse si siente que no hay espacio para su perspectiva; pedir una pausa y volver con una frase clara sobre su necesidad ayuda a cuidar la relación.', tips: ['Transforma una inquietud interior en una petición breve y específica.', 'Cuando una crítica te duela, pregunta qué aspecto concreto se quiere mejorar antes de concluir que se cuestiona tu valor.'] },
  learningStyle: 'Aprende bien cuando puede relacionar una idea con una historia, una experiencia o una pregunta que le resulte significativa, y después explorarla a su propio ritmo.',
  stressPatterns: ['Evitar una decisión por miedo a traicionar una posibilidad', 'Retirarse sin explicar lo que necesita', 'Idealizar una opción y frustrarse con los detalles reales', 'Decir que sí para no decepcionar'],
  developmentTips: ['Elige una versión suficientemente buena para compartirla, aunque todavía quieras seguir puliéndola.', 'Practica un límite sencillo que proteja tiempo para una prioridad personal.'],
  relatedTypes: ['INFJ', 'ENFJ', 'ISFP'],
  seo: { title: 'Personalidad INFP: valores, creatividad y desarrollo | KalQLater', description: 'Explora la personalidad INFP con una guía de autorreflexión sobre autenticidad, creatividad, relaciones, comunicación y desarrollo.' },
});

const infpFaq = Object.freeze([
  ['¿Qué describe esta guía INFP?', 'Resume preferencias, fortalezas y posibilidades de desarrollo asociadas a INFP. Es una invitación a reconocer patrones con curiosidad, no una etiqueta que defina por completo a una persona.'],
  ['¿INFP es un diagnóstico?', 'No. KalQLater es una herramienta de autorreflexión; no ofrece diagnósticos clínicos ni debe usarse para valorar la capacidad, la salud o el potencial de alguien.'],
  ['¿Puede una persona INFP liderar bien?', 'Sí. Puede liderar desde los valores, la escucha y la creatividad. La claridad de los acuerdos, los límites y la práctica de tomar decisiones hacen que esa contribución tenga más alcance.'],
  ['¿Qué puede buscar INFP en el trabajo?', 'Suele valorar un entorno respetuoso, margen para aportar una perspectiva propia y tareas que conecten con un propósito o una contribución que considere significativa.'],
  ['¿Cómo puede mostrarse INFP en las relaciones?', 'Puede mostrar cuidado con atención, lealtad y gestos pensados. Expresar sus necesidades y hablar de las diferencias antes de retirarse ayuda a que el vínculo tenga más espacio para la realidad.'],
  ['¿Qué puede ayudar bajo presión?', 'Volver a una prioridad pequeña, descansar, crear un límite y hablar con alguien de confianza puede ayudar. Si el malestar es persistente o intenso, busca apoyo profesional cualificado.'],
  ['¿El tipo de personalidad puede cambiar?', 'Las personas cambian con la experiencia, los roles y las etapas de vida. Esta guía propone una perspectiva de reflexión, no una identidad inmóvil.'],
  ['¿Cómo deberían usar esta información las empresas?', 'Solo como reflexión voluntaria. Un tipo de personalidad no debe utilizarse para filtrar, clasificar ni tomar decisiones de contratación.'],
]);

const enfjSpanish = Object.freeze({
  code: 'ENFJ', slug: 'enfj', group: 'Diplomáticos', color: '#A26D35', displayName: 'La persona que impulsa',
  shortSummary: 'Una presencia cálida que reúne a las personas alrededor de una posibilidad compartida.',
  overview: 'Las personas ENFJ suelen notar cómo se relacionan las personas entre sí y qué puede ayudar a que un grupo avance con mayor confianza. Su forma de implicarse puede inspirar, organizar y dar ánimo. Cuando equilibran esa atención a los demás con sus propios límites, convierten su capacidad de conexión en una influencia sostenida y genuina.',
  coreTraits: ['Conexión con las personas', 'Energía para movilizar', 'Visión compartida'],
  strengths: ['Capacidad de animar a otros', 'Comunicación cercana', 'Lectura de dinámicas grupales', 'Compromiso con el desarrollo', 'Habilidad para crear cooperación'],
  growthAreas: ['Preguntar antes de asumir qué necesita otra persona', 'No cargar con la motivación de todo el grupo', 'Aceptar desacuerdos sin tomarlos como una ruptura del vínculo', 'Reservar tiempo para escuchar su propia energía y necesidades'],
  workStyle: ['Colaboración con metas que beneficien a las personas', 'Facilitación de equipos, conversaciones o aprendizajes', 'Proyectos donde se pueda dar dirección y acompañamiento', 'Entornos que valoren el desarrollo de otros', 'Trabajo que combine relaciones, propósito y organización'],
  careerThemes: ['Desarrollo de personas y equipos', 'Comunicación con propósito', 'Construcción de colaboración y comunidad'],
  relationshipStyle: 'Las amistades ENFJ suelen estar llenas de atención, iniciativa y deseo de ver prosperar a las personas cercanas. Pueden acordarse de lo importante para otros y crear ocasiones para reunirse; permitir que también los cuiden hace que el vínculo sea más recíproco.',
  relationshipContexts: {
    friendship: 'Las amistades ENFJ suelen crecer con conversación, afecto y una sensación de acompañamiento mutuo. Compartir lo que necesitan, además de preguntar siempre por los demás, mantiene el vínculo equilibrado.',
    romance: 'En pareja, una persona ENFJ puede expresar cariño con presencia, detalles y planes que dan vida a la relación. Respetar los ritmos distintos y no anticipar todas las respuestas deja espacio para que la cercanía sea elegida por ambos.',
    family: 'En la familia, ENFJ puede asumir con naturalidad el papel de quien reúne, media o cuida la convivencia. Poner límites claros evita que esa disposición se convierta en una responsabilidad imposible de sostener.',
    teamwork: 'En equipo, ENFJ crea clima de colaboración, hace visibles las contribuciones y ayuda a conectar una tarea con una meta común. Su impacto se amplía cuando deja que otras personas definan también cómo quieren participar.',
  },
  leadership: { style: 'Da impulso al grupo al hacer visible una meta compartida y cuidar las condiciones para que las personas puedan contribuir.', summary: 'Suele liderar desde la comunicación, el desarrollo de otros y la capacidad de convertir una intención colectiva en movimiento.', strengths: ['Motivación inclusiva', 'Construcción de confianza', 'Coordinación orientada a las personas'], weeklyAction: 'En la próxima reunión, pregunta qué apoyo necesita cada persona y comparte también un límite concreto sobre lo que puedes asumir.' },
  communication: { summary: 'Suele comunicarse con calidez, expresividad y atención a que las personas se sientan incluidas.', preferred: 'Explicar la intención común y abrir espacio para que cada persona diga cómo ve la situación.', listening: 'Escuchar mejor cuando no completa la historia de alguien antes de que la otra persona termine de contarla.', conflict: 'Puede intentar resolver el malestar demasiado pronto; reconocer primero la diferencia y preguntar qué reparación sería útil ayuda a que la conversación sea más honesta.', tips: ['Sustituye una suposición sobre lo que alguien necesita por una pregunta abierta.', 'Antes de ofrecer ayuda, confirma si la otra persona busca acompañamiento, ideas o una decisión.'] },
  learningStyle: 'Aprende bien al conversar, enseñar, relacionar una idea con experiencias humanas y comprobar cómo puede llevarla a la práctica con otras personas.',
  stressPatterns: ['Sobreextenderse para responder a las necesidades de todos', 'Evitar una conversación difícil para preservar la armonía', 'Sentirse responsable del ánimo ajeno', 'Perder de vista sus propias prioridades'],
  developmentTips: ['Elige un apoyo que puedas ofrecer de forma realista y dilo con claridad.', 'Practica escuchar una diferencia sin apresurarte a convertirla en acuerdo.'],
  relatedTypes: ['INFJ', 'INFP', 'ENFP'],
  seo: { title: 'Personalidad ENFJ: conexión, liderazgo y desarrollo | KalQLater', description: 'Explora la personalidad ENFJ con una guía de autorreflexión sobre vínculos, liderazgo, comunicación, propósito y desarrollo.' },
});

const enfjFaq = Object.freeze([
  ['¿Qué describe esta guía ENFJ?', 'Resume preferencias, fortalezas y posibilidades de desarrollo asociadas a ENFJ. Sirve para observar tendencias con curiosidad, no para definir por completo a una persona.'],
  ['¿ENFJ es un diagnóstico?', 'No. KalQLater es una herramienta de autorreflexión; no ofrece diagnósticos clínicos ni debe utilizarse para valorar la capacidad, la salud o el potencial de alguien.'],
  ['¿Puede una persona ENFJ liderar bien?', 'Sí. Puede liderar al crear confianza, comunicar una dirección y ayudar a otras personas a desarrollarse. Los límites, la escucha y la claridad hacen esa influencia más sostenible.'],
  ['¿Qué puede buscar ENFJ en el trabajo?', 'Suele valorar un propósito compartido, relaciones de colaboración y la oportunidad de facilitar el crecimiento de personas, equipos o comunidades.'],
  ['¿Cómo puede mostrarse ENFJ en las relaciones?', 'Puede mostrar cuidado con atención, palabras de ánimo y acciones que acercan a las personas. Decir también lo que necesita ayuda a que la relación sea recíproca.'],
  ['¿Qué puede ayudar bajo presión?', 'Reducir compromisos, pedir apoyo, volver a sus propios límites y hablar con alguien de confianza puede ayudar. Si el malestar es persistente o intenso, busca apoyo profesional cualificado.'],
  ['¿El tipo de personalidad puede cambiar?', 'Las personas cambian con la experiencia, los roles y las etapas de vida. Esta guía ofrece una perspectiva para reflexionar, no una identidad fija.'],
  ['¿Cómo deberían usar esta información las empresas?', 'Solo como reflexión voluntaria. Un tipo de personalidad no debe utilizarse para filtrar, clasificar ni tomar decisiones de contratación.'],
]);

const spanishGuides = Object.freeze({
  INTJ: Object.freeze({ profile: intjSpanish, faq: intjFaq }),
  INTP: Object.freeze({ profile: intpSpanish, faq: intpFaq }),
  ENTJ: Object.freeze({ profile: entjSpanish, faq: entjFaq }),
  ENTP: Object.freeze({ profile: entpSpanish, faq: entpFaq }),
  INFJ: Object.freeze({ profile: infjSpanish, faq: infjFaq }),
  INFP: Object.freeze({ profile: infpSpanish, faq: infpFaq }),
  ENFJ: Object.freeze({ profile: enfjSpanish, faq: enfjFaq }),
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
