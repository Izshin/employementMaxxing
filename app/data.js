/* Datos semilla: ofertas ya enviadas, con el CV adaptado y los puntos a repasar. */

const ESTADOS = [
  { id: 'preparando', label: 'Preparando', variant: 'draft' },
  { id: 'enviada', label: 'Enviada', variant: 'sent' },
  { id: 'proceso', label: 'En proceso', variant: 'progress' },
  { id: 'entrevista', label: 'Entrevista', variant: 'progress' },
  { id: 'oferta', label: '¡Oferta!', variant: 'offer' },
  { id: 'rechazada', label: 'Rechazada', variant: 'rejected' },
];

const DEFAULT_OFFERS = [
  {
    id: 'profile-angular-python',
    titulo: 'Desarrollador/a Junior (Angular + Python)',
    empresa: 'Profile',
    modalidad: 'Remoto · Contrato indefinido',
    ubicacion: 'España (100% remoto)',
    fechaEnvio: '',
    estado: 'preparando',
    color: '#f2c94c',
    url: '',
    descripcion:
      'Consultora tecnológica que busca desarrolladores/as Junior con experiencia en Angular y Python ' +
      'para incorporarse a un proyecto estable en remoto. Piden más de 1 año de experiencia en desarrollo, ' +
      'con capacidad para desenvolverse tanto en tareas frontend como backend. Condiciones: contrato ' +
      'indefinido, salario competitivo, flexibilidad horaria, vacaciones adicionales por antigüedad, ' +
      'formación a medida y retribución flexible.',
    cv: {
      nombre: 'Ivan-Fernandez-Limarquez-CV-Profile.pdf',
      ruta: '../curriculum_mod_pdf/Ivan-Fernandez-Limarquez-CV-Profile.pdf',
      fuente: '../CvModificables/cv-modificable_es.html',
      idioma: 'Español',
    },
    carta: {
      enviada: false,
      texto:
        'Nota de presentación integrada en el propio CV (bloque "cover-note"):\n\n' +
        '"Llevo 6 meses de experiencia laboral remunerada (en Click-IT, desde mayo de 2026), pero sumo más ' +
        'de 3 años programando de forma continua entre proyectos universitarios altamente enfocados al ' +
        'código y a la simulación de clientes reales, hackathones (CosmoCrush, Space25) y ' +
        'prácticas/colaboraciones freelance (KnittedForYou), trabajando tanto con Angular (frontend) como ' +
        'con Python/Django (backend)."',
    },
    tecnologias: [
      'Angular', 'Python', 'Django', 'JavaScript', 'TypeScript', 'REST APIs',
      'Desarrollo frontend', 'Desarrollo backend', 'Git',
    ],
    puntosEntrevista: [
      'La Farga (Click-IT): mi caso real de Angular en producción (gestión de vehículos y aparcamiento para L\'Hospitalet), con trato directo con el cliente. Es el ancla de la parte Angular.',
      'GSharp (Click-IT): backend en Python/Django con integración de la API REST de Microsoft Planner. Es el ancla de la parte Python.',
      'Todo Jardín: proyecto Django end-to-end propio (catálogo, carrito, checkout con Braintree, panel admin), demuestra Python fuera del trabajo también.',
      'uvlhub y Othello AI: dos proyectos personales más en Python (Flask dockerizado y CNN en Keras), útiles si preguntan por proyectos fuera del trabajo.',
      'Full stack: Kam (.NET/C#) y Scubex (Spring Boot) muestran soltura en backend en general, no solo Python.',
      'Frontend más allá de Angular: React en Scubex, Orquesta Elegidos y el portfolio 3D, por si preguntan por otros frameworks.',
      'Años de experiencia: 6 meses de experiencia laboral real en Click-IT (desde mayo 2026), pero más de 3 años programando entre universidad, hackathones y freelance (KnittedForYou). Ser transparente sobre esta distinción si preguntan.',
      'Perfil junior: mostrar ganas de aprender y trabajar en equipo, tal y como pide la oferta, sin sobrevender experiencia.',
    ],
    adaptacionCV: [
      'Título del CV cambiado a "Ingeniero de Software — Full Stack (Angular & Python)".',
      'Color del CV con la marca real de Profile: navy (#14294d) como color principal (bordes, títulos, enlaces) y amarillo suave (#fbe8a6) como color secundario en los tags del stack técnico.',
      'Resumen reescrito para abrir con frontend/backend, Angular y Python (Django), y REST APIs.',
      'Experiencia de Click-IT reordenada: La Farga (Angular) primero, GSharp (Angular + Python/Django) segundo, Kam y .NET después.',
      'Proyectos destacados: se mantiene Todo Jardín (Django) primero por ser el proyecto Python más completo.',
      'Proyectos de universidad reordenados: uvlhub y Othello AI (ambos Python) primero, luego Truco Beasts y hackathones.',
      'Stack técnico: Angular movido al principio de frameworks, justo antes de Django.',
      'Cover-note ajustada para distinguir "6 meses de experiencia laboral real" (Click-IT) de "más de 3 años" programando entre universidad y proyectos, mencionando explícitamente Angular y Python/Django.',
    ],
    adaptacionCarta: [
      'La oferta exige más de 1 año de experiencia; la nota distingue "6 meses" de experiencia laboral real y "más de 3 años" contando universidad y proyectos, cifra que cubre de sobra el mínimo pedido.',
      'Se deja claro que la experiencia remunerada arranca en 2026 — no se oculta.',
      'Se nombra a Click-IT como puesto actual donde se usan ambas tecnologías pedidas (Angular y Python/Django).',
    ],
    claimsExperiencia: [
      'DICHO: experiencia real con Angular (La Farga) y Python/Django (GSharp, Todo Jardín).',
      'DICHO: "6 meses" de experiencia laboral real (Click-IT, desde mayo 2026) y "más de 3 años" programando entre universidad, hackathones y freelance. Verificable y desglosable si preguntan.',
      'NO DICHO: ninguna cifra de años de experiencia laboral remunerada distinta de los 6 meses reales en Click-IT.',
    ],
    notas: 'El CV se generó desde CvModificables/cv-modificable_es.html y se exportó con utils/export-cv.mjs.',
  },
  {
    id: 'scalian-fullstack',
    titulo: 'Full Stack Developer (React + Django)',
    empresa: 'Scalian Spain',
    modalidad: 'Remoto · Contrato indefinido',
    ubicacion: 'España (100% teletrabajo)',
    fechaEnvio: '',
    estado: 'enviada',
    color: '#e2007a',
    url: '',
    descripcion:
      'Grupo internacional (+6.000 personas en Europa y Norteamérica) con servicios de Data, Cloud e IA. ' +
      'Buscan un Full Stack Developer para una aplicación de visualización y presentación de datos científicos: ' +
      'recoger requisitos funcionales y de negocio, desarrollar con React + Django, diseñar y mantener REST APIs, ' +
      'cuidar UI responsive/UX, modelar datos, montar CI/CD y trabajar con equipos científicos y stakeholders ' +
      'dentro del ecosistema Azure. Piden mínimo 3 años de experiencia e inglés B2+. ' +
      'Condiciones: teletrabajo, indefinido, 25 días de vacaciones, horario flexible y formación continua.',
    cv: {
      nombre: 'CV_IFL_Scalian.pdf',
      ruta: '../curriculum_mod_pdf/CV_IFL_Scalian.pdf',
      fuente: '../CvModificables/cv-modificable_es.html',
      idioma: 'Español',
    },
    carta: {
      enviada: true,
      texto:
        'Nota de presentación integrada en el propio CV (bloque "cover-note"):\n\n' +
        '"Aunque mi experiencia laboral remunerada arrancó en 2026, sumo más de 3 años programando entre ' +
        'proyectos universitarios altamente enfocados al código y a la simulación de clientes reales, hackathones ' +
        '(CosmoCrush, Space25) y prácticas/colaboraciones freelance (KnittedForYou), además de mi puesto actual en Click-IT."',
    },
    tecnologias: [
      'ReactJS', 'Python', 'Django', 'Node.js / Fastify', 'REST APIs', 'Azure / Azure Stack',
      'SQL · PostgreSQL', 'Git & CI/CD', 'Linux', 'Data visualization', 'Inglés B2+',
    ],
    puntosEntrevista: [
      'GSharp (Click-IT): es MI caso real de Django + integración de la API REST de Microsoft Planner. Es el ancla de la parte Python/Django.',
      'Todo Jardín: segundo proyecto Django end-to-end (catálogo, carrito, checkout con Braintree, panel admin propio). Lo puse el primero de la lista por eso.',
      'React: Scubex (React + MobX), Orquesta Elegidos (React + Vite) y el portfolio 3D (React 19 + Three.js + R3F). Para "data visualization" tira del portfolio 3D y de la optimización 209 MB → 45 MB.',
      'REST APIs: OAuth 2.0 con Google, GBIF (especies) y Open-Meteo en Scubex. Sé diseñar y consumir APIs, no solo consumirlas.',
      'Node.js: viene de La Farga (Angular + Fastify). Si preguntan por Express, decir claramente que mi experiencia es con Fastify.',
      'CI/CD: GitHub Actions, despliegues en Vercel/Railway y CD en GitHub Pages. Docker en uvlhub.',
      'Azure: PUNTO DÉBIL. No tengo experiencia directa con Azure. Reconducir hacia Azure DevOps/Git, despliegues cloud (Vercel, Railway, PythonAnywhere) y disposición a aprenderlo rápido. NO decir que lo domino.',
      'Snowflake / dbt / Databricks y sector farma/biotech: no los tengo. Tratarlos como "valorable" y ser honesto.',
      'Linux: uso habitual con Docker y despliegues; no vender administración de sistemas.',
      'Calidad: 137 tests unitarios y +90% de cobertura en Scubex. Buen argumento para producto científico donde el dato no puede fallar.',
      'Inglés C1 acreditado (Instituto de Idiomas, Univ. de Sevilla) — cubre el B2+ que piden.',
    ],
    adaptacionCV: [
      'Título del CV cambiado a "Ingeniero de Software — Full Stack (React & Python/Django)".',
      'Color de marca del CV en azul/morado Scalian (#5a2d82).',
      'Resumen reescrito para abrir con ReactJS y Python/Django, REST APIs y experiencia de usuario.',
      'Experiencia de Click-IT reordenada: GSharp (Django) primero, La Farga marcada como Fastify/Node.js.',
      'Proyectos destacados reordenados: Todo Jardín (Django) → Scubex (React) → Orquesta Elegidos (React) → Portfolio 3D.',
      'Stack técnico reordenado: Python y JavaScript primero; React y Django al inicio de frameworks; REST APIs y PostgreSQL al inicio de herramientas.',
      'Proyectos universitarios filtrados: Truco Beasts (React), uvlhub (Flask/Docker), hackathones y Othello AI.',
    ],
    adaptacionCarta: [
      'La oferta SÍ exige mínimo 3 años, así que la nota usa ese mismo número ("más de 3 años programando") apoyándose en proyectos universitarios, hackathones, freelance y Click-IT.',
      'Se deja claro que la experiencia remunerada arranca en 2026 — no se oculta.',
      'Se mencionan clientes reales con nombre: Click-IT (La Farga, Kam) y Orquesta Elegidos.',
    ],
    claimsExperiencia: [
      'DICHO: "más de 3 años programando" (contando universidad + hackathones + freelance + Click-IT). Hay que poder desglosar esos años si lo preguntan.',
      'DICHO: experiencia real con Django (GSharp y Todo Jardín) y con React (Scubex, Elegidos, portfolio).',
      'NO DICHO: nada de Azure, Snowflake, dbt, Databricks ni sector científico/farma. No inventar en la entrevista.',
    ],
    notas: 'El CV se generó desde CvModificables/cv-modificable_es.html y se exportó con tools/export-cv.mjs.',
  },
  {
    id: 'korber-support',
    titulo: 'Full Stack Developer / Application Support',
    empresa: 'Körber Supply Chain Consulting',
    modalidad: 'Remoto / híbrido · Guardias 24x7 rotativas',
    ubicacion: 'España',
    fechaEnvio: '',
    estado: 'enviada',
    color: '#0046ad',
    url: '',
    descripcion:
      'Körber Supply Chain Consulting implementa y da soporte a software logístico para clientes nacionales e ' +
      'internacionales, trabajando junto a SAP. El puesto está orientado a SOPORTE Y MANTENIMIENTO de aplicaciones ' +
      'existentes (no desarrollo greenfield): análisis y resolución de incidencias, mejoras y change requests sobre ' +
      'entornos de cliente ya montados, trabajo con bases de datos y guardias de soporte 24x7 rotativas. ' +
      'Piden .NET, C#, Java, JavaScript, arquitecturas web 3-tier, Oracle/SQL Server e inglés fluido. ' +
      'Perfil junior-mid bienvenido. Valorable JIRA, Azure DevOps, Git y SVN. ' +
      'Condiciones: horario flexible, remoto/híbrido, mentoring, formación continua y jerarquías planas.',
    cv: {
      nombre: 'Ivan-Fernandez-Limarquez-CV-Korber.pdf',
      ruta: '../curriculum_mod_pdf/Ivan-Fernandez-Limarquez-CV-Korber.pdf',
      fuente: '../CvModificables/cv-modificable_en.html',
      idioma: 'Inglés',
    },
    carta: {
      enviada: true,
      texto:
        'Nota de presentación integrada en el CV, en inglés (bloque "cover-note"):\n\n' +
        '"Although my paid professional experience only started in 2026, I have kept coding continuously through ' +
        'university projects highly focused on code and structured problem-solving, hackathons (CosmoCrush, Space25) ' +
        'and freelance work (KnittedForYou), dealing with real clients at Click-IT and with Orquesta Elegidos, ' +
        'building and maintaining applications and websites from scratch."',
    },
    tecnologias: [
      '.NET / C#', 'Java (Spring Boot)', 'JavaScript', 'Arquitecturas web 3-tier',
      'Oracle / SQL Server', 'SQL', 'Troubleshooting de incidencias', 'JIRA', 'Azure DevOps', 'Git', 'SVN',
      'Inglés fluido',
    ],
    puntosEntrevista: [
      'ARGUMENTO CENTRAL: el puesto es mantenimiento, no greenfield. Mi carta fuerte es Kam (mesoestetic) en Click-IT: primer backend en .NET/C#, refactorización de código legacy y resolución de cuellos de botella.',
      'Java: Scubex está hecho con Spring Boot (+ PostgreSQL). Es mi proyecto Java más grande y por eso va el primero en el CV inglés.',
      'JavaScript: La Farga (Angular + Fastify), Orquesta Elegidos (React + Vite), portfolio 3D. Cubre el frontend.',
      'Arquitecturas 3-tier: explicar Scubex y Todo Jardín como presentación / lógica de negocio / base de datos. Es exactamente el patrón que piden.',
      'Bases de datos: PostgreSQL con soltura (Scubex, Railway). Oracle y SQL Server NO los he tocado — decir que el SQL transfiere y que la sintaxis concreta se aprende rápido. No fingir.',
      'Troubleshooting: enfatizar el trabajo sobre código legacy ajeno, leer código que no escribí y depurar bottlenecks. Es literalmente el día a día del puesto.',
      'Clientes reales: La Farga (L\'Hospitalet), Kam (mesoestetic) y Orquesta Elegidos. El soporte es cara al cliente, así que insistir en la comunicación directa.',
      'Herramientas: Git a diario y GitHub Actions. Azure DevOps y JIRA los he visto poco; SVN no. Presentarlos como "familiar, no experto".',
      'GUARDIAS 24x7: preguntar cómo se organiza la rotación y mostrarse disponible; es un requisito que descarta gente, conviene dejarlo cerrado.',
      'Inglés: la entrevista puede ser en inglés. C1 acreditado y CV entregado en inglés — coherente.',
      'Testing: 137 tests unitarios y +90% cobertura en Scubex + JUnit. En mantenimiento, los tests de regresión son oro.',
    ],
    adaptacionCV: [
      'CV entregado EN INGLÉS (plantilla cv-template-en.html) porque piden inglés fluido.',
      'Título cambiado a "Software Engineer — Full-Stack Support & Maintenance (.NET, Java, JavaScript)".',
      'Color de marca azul Körber (#0046ad).',
      'Resumen reescrito alrededor de mantener, refactorizar y depurar aplicaciones + bases de datos SQL, y comunicación con cliente.',
      'Click-IT reordenado: Kam (.NET/C#, legacy, bottlenecks) primero; luego La Farga (JavaScript/Fastify) y GSharp.',
      'Proyectos destacados reordenados: Scubex (Java/Spring Boot) → Todo Jardín → Orquesta Elegidos. Todo Jardín redactado como app en producción "mantenida end to end".',
      'Stack técnico reordenado: C#, Java y JavaScript primero; .NET y Spring Boot al inicio de frameworks; Git y PostgreSQL al inicio de herramientas.',
    ],
    adaptacionCarta: [
      'La oferta NO exige un mínimo de años (acepta junior-mid), así que la nota NO menciona ninguna cifra de años — solo continuidad ("I have kept coding continuously").',
      'Se cita explícitamente "building and maintaining applications" para alinear con el rol de soporte.',
      'Clientes reales nombrados: Click-IT y Orquesta Elegidos.',
    ],
    claimsExperiencia: [
      'DICHO: experiencia real en .NET/C# (Kam), Java/Spring Boot (Scubex) y JavaScript (varios). Todo verificable.',
      'DICHO: trabajo sobre código legacy y resolución de cuellos de botella en Click-IT.',
      'NO DICHO: ningún número de años. Si preguntan, la experiencia remunerada empieza en 2026.',
      'NO DICHO: Oracle, SQL Server ni SVN. No afirmar que los conozco.',
    ],
    notas: 'El CV se generó desde CvModificables/cv-modificable_en.html y se exportó con tools/export-cv.mjs.',
  },
];
