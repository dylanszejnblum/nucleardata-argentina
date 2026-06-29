import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Argentina Nuclear...')

  // ── Reactors ──────────────────────────────────────────────
  const reactors = [
    {
      id: 'atucha-i',
      name: 'Atucha I',
      type: 'PHWR',
      status: 'operational',
      category: 'power',
      latitude: -33.9667,
      longitude: -59.2,
      province: 'Buenos Aires',
      city: 'Lima',
      capacityMwe: 362,
      capacityMwt: 1179,
      firstCriticality: new Date('1974-03-19'),
      gridConnection: new Date('1974-06-24'),
      operator: 'Nucleoeléctrica Argentina S.A.',
      owner: 'CNEA / NA-SA',
      supplier: 'Siemens (KWU)',
      fuelType: 'UO2 natural',
      coolant: 'Agua pesada (D₂O)',
      moderator: 'Agua pesada (D₂O)',
      lifetimeFactor: 68.5,
      statusDetail: 'En operación. Extensión de vida en evaluación.',
      sourceUrl: 'https://www.na-sa.com.ar/centrales/atucha-i',
    },
    {
      id: 'atucha-ii',
      name: 'Atucha II',
      type: 'PHWR',
      status: 'operational',
      category: 'power',
      latitude: -33.9667,
      longitude: -59.2,
      province: 'Buenos Aires',
      city: 'Lima',
      capacityMwe: 745,
      capacityMwt: 2160,
      firstCriticality: new Date('2014-06-03'),
      gridConnection: new Date('2014-06-27'),
      operator: 'Nucleoeléctrica Argentina S.A.',
      owner: 'CNEA / NA-SA',
      supplier: 'Siemens (KWU)',
      fuelType: 'UO2 natural',
      coolant: 'Agua pesada (D₂O)',
      moderator: 'Agua pesada (D₂O)',
      lifetimeFactor: 72.1,
      statusDetail:
        'En operación. Construcción iniciada en 1981, paralizada 1994–2006.',
      sourceUrl: 'https://www.na-sa.com.ar/centrales/atucha-ii',
    },
    {
      id: 'embalse',
      name: 'Embalse',
      type: 'CANDU',
      status: 'operational',
      category: 'power',
      latitude: -32.2292,
      longitude: -64.4433,
      province: 'Córdoba',
      city: 'Embalse',
      capacityMwe: 683,
      capacityMwt: 2064,
      firstCriticality: new Date('1983-06-13'),
      gridConnection: new Date('1984-01-20'),
      operator: 'Nucleoeléctrica Argentina S.A.',
      owner: 'CNEA / NA-SA',
      supplier: 'Atomic Energy of Canada Ltd. (AECL)',
      fuelType: 'UO2 natural',
      coolant: 'Agua pesada (D₂O)',
      moderator: 'Agua pesada (D₂O)',
      lifetimeFactor: 75.0,
      statusDetail:
        'En operación. Extensión de vida completada 2019. Nueva vida útil hasta 2045+.',
      sourceUrl: 'https://www.na-sa.com.ar/centrales/embalse',
    },
    {
      id: 'carem-25',
      name: 'CAREM-25',
      type: 'CAREM',
      status: 'construction',
      category: 'prototype',
      latitude: -33.4769,
      longitude: -59.6344,
      province: 'Buenos Aires',
      city: 'Lima',
      capacityMwe: 32,
      capacityMwt: 100,
      firstCriticality: null,
      gridConnection: null,
      operator: 'CNEA',
      owner: 'CNEA',
      supplier: 'CNEA / INVAP',
      fuelType: 'UO2 enriquecido (3.1 %)',
      coolant: 'Agua liviana (H₂O)',
      moderator: 'Agua liviana (H₂O)',
      lifetimeFactor: null,
      statusDetail:
        'En construcción. Prototipo del primer SMR 100% argentino. Obra civil avanzada.',
      sourceUrl: 'https://www.cnea.gob.ar/carem',
    },
    {
      id: 'ra-1',
      name: 'RA-1',
      type: 'pool',
      status: 'operational',
      category: 'research',
      latitude: -34.5506,
      longitude: -58.4647,
      province: 'CABA',
      city: 'Buenos Aires',
      capacityMwe: null,
      capacityMwt: 0.04,
      firstCriticality: new Date('1958-01-17'),
      gridConnection: null,
      operator: 'CNEA',
      owner: 'CNEA',
      supplier: 'CNEA',
      fuelType: 'UO2 enriquecido (20 %)',
      coolant: 'Agua liviana',
      moderator: 'Agua liviana / grafito',
      lifetimeFactor: null,
      statusDetail:
        'Operacional. Primer reactor de América Latina y el hemisferio sur.',
      sourceUrl: 'https://www.cnea.gob.ar/ra-1',
    },
    {
      id: 'ra-3',
      name: 'RA-3',
      type: 'pool',
      status: 'operational',
      category: 'research',
      latitude: -34.7464,
      longitude: -58.6319,
      province: 'Buenos Aires',
      city: 'Ezeiza',
      capacityMwe: null,
      capacityMwt: 10,
      firstCriticality: new Date('1967-12-20'),
      gridConnection: null,
      operator: 'CNEA',
      owner: 'CNEA',
      supplier: 'CNEA',
      fuelType: 'UO2 enriquecido (20 %)',
      coolant: 'Agua liviana',
      moderator: 'Agua liviana',
      lifetimeFactor: null,
      statusDetail:
        'Operacional. Principal productor de radioisótopos médicos (Mo-99, I-131).',
      sourceUrl: 'https://www.cnea.gob.ar/ra-3',
    },
    {
      id: 'ra-4',
      name: 'RA-4',
      type: 'pool',
      status: 'operational',
      category: 'research',
      latitude: -32.9461,
      longitude: -60.6583,
      province: 'Santa Fe',
      city: 'Rosario',
      capacityMwe: null,
      capacityMwt: 0.001,
      firstCriticality: new Date('1971-07-08'),
      gridConnection: null,
      operator: 'CNEA / Universidad Nacional de Rosario',
      owner: 'CNEA',
      supplier: 'CNEA',
      fuelType: 'UO2 enriquecido (20 %)',
      coolant: 'Agua liviana',
      moderator: 'Agua liviana',
      lifetimeFactor: null,
      statusDetail: 'Operacional. Reactor de enseñanza e investigación.',
      sourceUrl: 'https://www.cnea.gob.ar/ra-4',
    },
    {
      id: 'ra-6',
      name: 'RA-6',
      type: 'pool',
      status: 'operational',
      category: 'research',
      latitude: -41.1236,
      longitude: -71.3088,
      province: 'Río Negro',
      city: 'San Carlos de Bariloche',
      capacityMwe: null,
      capacityMwt: 3,
      firstCriticality: new Date('1982-09-28'),
      gridConnection: null,
      operator: 'CNEA / Instituto Balseiro',
      owner: 'CNEA',
      supplier: 'CNEA',
      fuelType: 'UO2 enriquecido (20 %)',
      coolant: 'Agua liviana',
      moderator: 'Agua liviana',
      lifetimeFactor: null,
      statusDetail:
        'Operacional. Reactor de investigación y formación en el Centro Atómico Bariloche.',
      sourceUrl: 'https://www.cnea.gob.ar/ra-6',
    },
    {
      id: 'ra-10',
      name: 'RA-10',
      type: 'pool',
      status: 'construction',
      category: 'research',
      latitude: -34.7464,
      longitude: -58.6319,
      province: 'Buenos Aires',
      city: 'Ezeiza',
      capacityMwe: null,
      capacityMwt: 30,
      firstCriticality: null,
      gridConnection: null,
      operator: 'CNEA',
      owner: 'CNEA',
      supplier: 'CNEA / INVAP',
      fuelType: 'UO2 enriquecido (20 %)',
      coolant: 'Agua liviana',
      moderator: 'Agua liviana',
      lifetimeFactor: null,
      statusDetail:
        'En construcción. Reactor multipropósito para producción de radioisótopos y ensayos de materiales.',
      sourceUrl: 'https://www.cnea.gob.ar/ra-10',
    },
  ]

  for (const r of reactors) {
    await prisma.reactor.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    })
  }
  console.log(`  ✅ ${reactors.length} reactores`)

  // ── Atomic Centers ────────────────────────────────────────
  const centers = [
    {
      id: 'cab',
      name: 'Centro Atómico Bariloche',
      type: 'atomic_center',
      latitude: -41.1236,
      longitude: -71.3088,
      province: 'Río Negro',
      city: 'San Carlos de Bariloche',
      founded: 1951,
      operator: 'CNEA',
      focusAreas: [
        'Física nuclear',
        'Materiales',
        'Reactores de investigación',
        'Formación de recursos humanos',
      ],
      facilities: ['RA-6', 'Laboratorio de materiales', 'Acelerador iónico'],
      website: 'https://www.cab.cnea.gov.ar',
    },
    {
      id: 'cae',
      name: 'Centro Atómico Ezeiza',
      type: 'atomic_center',
      latitude: -34.7464,
      longitude: -58.6319,
      province: 'Buenos Aires',
      city: 'Ezeiza',
      founded: 1967,
      operator: 'CNEA',
      focusAreas: [
        'Producción de radioisótopos',
        'Tecnología de radiaciones',
        'Gestión de residuos',
      ],
      facilities: ['RA-3', 'RA-10 (en const.)', 'Planta de radioisótopos', 'CAD'],
      website: 'https://www.cnea.gob.ar/ezeiza',
    },
    {
      id: 'cac',
      name: 'Centro Atómico Constituyentes',
      type: 'atomic_center',
      latitude: -34.5506,
      longitude: -58.4647,
      province: 'CABA',
      city: 'Buenos Aires',
      founded: 1955,
      operator: 'CNEA',
      focusAreas: [
        'RA-1',
        'Combustibles nucleares',
        'Metalurgia',
        'Dosimetría',
      ],
      facilities: ['RA-1', 'Laboratorio de combustibles', 'Planta piloto'],
      website: 'https://www.cnea.gob.ar/constituyentes',
    },
    {
      id: 'pilcaniyeu',
      name: 'Complejo Tecnológico Pilcaniyeu',
      type: 'complex',
      latitude: -41.1217,
      longitude: -70.7311,
      province: 'Río Negro',
      city: 'Pilcaniyeu',
      founded: 1978,
      operator: 'CNEA',
      focusAreas: ['Enriquecimiento de uranio', 'Difusión gaseosa'],
      facilities: ['Planta de enriquecimiento', 'Laboratorios'],
      website: null,
    },
    {
      id: 'ib',
      name: 'Instituto Balseiro',
      type: 'institute',
      latitude: -41.1236,
      longitude: -71.3088,
      province: 'Río Negro',
      city: 'San Carlos de Bariloche',
      founded: 1955,
      operator: 'CNEA / Universidad Nacional de Cuyo',
      focusAreas: [
        'Ingeniería nuclear',
        'Física médica',
        'Ingeniería en telecomunicaciones',
        'Mecánica',
      ],
      facilities: ['Aulas', 'Laboratorios', 'RA-6'],
      website: 'https://www.ib.edu.ar',
    },
    {
      id: 'is',
      name: 'Instituto Sábato',
      type: 'institute',
      latitude: -34.5506,
      longitude: -58.4647,
      province: 'CABA',
      city: 'Buenos Aires',
      founded: 1993,
      operator: 'CNEA / Universidad Nacional de San Martín',
      focusAreas: [
        'Ciencia y tecnología de materiales',
        'Energía nuclear',
        'Radiactividad ambiental',
      ],
      facilities: ['Aulas', 'Laboratorios CAC'],
      website: 'https://isabato.cnea.gob.ar',
    },
    {
      id: 'iben',
      name: 'Instituto Beninson',
      type: 'institute',
      latitude: -34.7464,
      longitude: -58.6319,
      province: 'Buenos Aires',
      city: 'Ezeiza',
      founded: 2007,
      operator: 'CNEA / Universidad Nacional de San Martín',
      focusAreas: [
        'Aplicaciones nucleares',
        'Radioquímica',
        'Gestión de residuos',
      ],
      facilities: ['Aulas', 'Laboratorios CAE'],
      website: 'https://ibeninson.cnea.gob.ar',
    },
  ]

  for (const c of centers) {
    await prisma.atomicCenter.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    })
  }
  console.log(`  ✅ ${centers.length} centros atómicos`)

  // ── History Milestones ────────────────────────────────────
  const milestones = [
    {
      year: 1950,
      month: 5,
      title: 'Creación de la CNEA',
      description:
        'El 31 de mayo de 1950, bajo la presidencia de Juan Domingo Perón, se crea la Comisión Nacional de Energía Atómica (CNEA) mediante Decreto PEN Nº 10936/50. Es el punto de partida del desarrollo nuclear argentino con fines pacíficos.',
      significance: 'milestone',
      category: 'institutional',
      sources: ['Decreto PEN Nº 10936/50'],
    },
    {
      year: 1951,
      title: 'Inauguración del Centro Atómico Bariloche',
      description:
        'Se crea la Planta Nacional de Energía Atómica de Bariloche (hoy Centro Atómico Bariloche — CAB), primer centro de investigación nuclear del país.',
      significance: 'milestone',
      category: 'institutional',
      sources: ['CNEA memorias'],
    },
    {
      year: 1952,
      title: 'Primer descubrimiento de uranio en Argentina',
      description:
        'Se descubren los primeros yacimientos uraníferos en Argentina, iniciando la exploración y explotación de uranio a nivel nacional.',
      significance: 'milestone',
      category: 'technical',
      sources: ['CNEA / SIACAM'],
    },
    {
      year: 1955,
      title: 'Creación del Instituto Balseiro',
      description:
        'Se funda el Instituto Balseiro en Bariloche, institución de formación de excelencia en física e ingeniería nuclear, que se convertiría en semillero de científicos y técnicos del sector.',
      significance: 'milestone',
      category: 'institutional',
      sources: ['Historia IB'],
    },
    {
      year: 1958,
      month: 1,
      title: 'RA-1 alcanza criticidad',
      description:
        'El reactor RA-1, primer reactor nuclear de investigación de Argentina y de toda América Latina, alcanza su primera reacción nuclear en cadena el 17 de enero. Argentina se convierte en el primer país del hemisferio sur en operar un reactor nuclear.',
      significance: 'milestone',
      category: 'technical',
      sources: ['CNEA — RA-1'],
    },
    {
      year: 1967,
      month: 12,
      title: 'RA-3 en operación',
      description:
        'Entra en operación el RA-3 en el Centro Atómico Ezeiza, reactor de 10 MWt que se convertiría en el principal productor de radioisótopos médicos del país.',
      significance: 'milestone',
      category: 'technical',
      sources: ['CNEA — RA-3'],
    },
    {
      year: 1974,
      month: 3,
      title: 'Atucha I — primer reactor de potencia en LATAM',
      description:
        'Atucha I, primer reactor nuclear de potencia de América Latina, entra en operación. Es un reactor PHWR (Presurized Heavy Water Reactor) de 362 MWe, construido en colaboración con Siemens (KWU) de Alemania.',
      significance: 'milestone',
      category: 'technical',
      sources: ['NA-SA'],
    },
    {
      year: 1976,
      title: 'Creación de INVAP',
      description:
        'Se funda INVAP S.E. (Investigaciones Aplicadas) mediante un acuerdo entre la CNEA y la Provincia de Río Negro. Se convertiría en la empresa de tecnología nuclear más importante de Argentina y un exportador global de reactores de investigación.',
      significance: 'milestone',
      category: 'institutional',
      relatedEntities: ['invap', 'rio-negro'],
      sources: ['INVAP'],
    },
    {
      year: 1976,
      title: 'Inicio de la desindustrialización',
      description:
        'Comienza el proceso de desindustrialización en Argentina que reorienta la economía hacia lo financiero. El sector nuclear adopta un modelo basado en megaproyectos de viabilidad discutible y plazos prolongados.',
      significance: 'turning_point',
      category: 'political',
      sources: ['Wainer & Schorr, 2022'],
    },
    {
      year: 1977,
      title: 'Inicio del Laboratorio de Procesos Radioquímicos (LPR)',
      description:
        'Comienza la construcción del LPR, planta destinada al reprocesamiento de combustibles irradiados para recuperar plutonio. El proyecto se detendría en 1983 y se cancelaría definitivamente en 1991.',
      significance: 'turning_point',
      category: 'technical',
      sources: ['CNEA'],
    },
    {
      year: 1981,
      title: 'Inicio de construcción de Atucha II',
      description:
        'Comienza la construcción de la Central Nuclear Atucha II (745 MWe), proyecto que sufriría múltiples interrupciones y se extendería por 33 años hasta su finalización en 2014.',
      significance: 'turning_point',
      category: 'technical',
      sources: ['NA-SA'],
    },
    {
      year: 1983,
      month: 6,
      title: 'Embalse en operación',
      description:
        'La Central Nuclear Embalse (CANDU-6, 683 MWe) entra en operación en la provincia de Córdoba. Es el segundo reactor de potencia del país, construido por AECL de Canadá.',
      significance: 'milestone',
      category: 'technical',
      sources: ['NA-SA'],
    },
    {
      year: 1983,
      title: 'Inicio del diseño conceptual del CAREM',
      description:
        'Comienza el diseño conceptual del CAREM (Central Argentina de Elementos Modulares), el primer reactor nuclear modular pequeño (SMR) diseñado y desarrollado íntegramente en Argentina.',
      significance: 'milestone',
      category: 'technical',
      sources: ['CNEA'],
    },
    {
      year: 1984,
      title: 'El Bolsón se declara "Zona No Nuclear"',
      description:
        'El municipio de El Bolsón, en la provincia de Río Negro, se declara "Zona No Nuclear" mediante Ordenanza Municipal Nº 069/84. Es el primer antecedente de la legislación antinuclear que se extendería por todo el país.',
      significance: 'turning_point',
      category: 'legal',
      sources: ['Ordenanza Municipal Nº 069/84'],
    },
    {
      year: 1994,
      title: 'Reforma constitucional — art. 124',
      description:
        'La reforma constitucional de 1994 reconoce el dominio originario de las provincias sobre sus recursos naturales (art. 124 CN). Esta disposición sería utilizada posteriormente por provincias para prohibir actividades nucleares en sus territorios.',
      significance: 'turning_point',
      category: 'legal',
      sources: ['Constitución Nacional Argentina 1994'],
    },
    {
      year: 1994,
      title: 'Paralización de Atucha II',
      description:
        'La construcción de Atucha II se paraliza por falta de financiamiento, tras 13 años de obras. Pasarían 12 años hasta su reactivación en 2006.',
      significance: 'crisis',
      category: 'political',
      sources: ['NA-SA'],
    },
    {
      year: 1996,
      title: 'Paralización del Complejo Pilcaniyeu',
      description:
        'Se paralizan las operaciones del Complejo Tecnológico Pilcaniyeu, la planta de enriquecimiento de uranio por difusión gaseosa. Argentina pierde su capacidad de enriquecimiento.',
      significance: 'crisis',
      category: 'technical',
      sources: ['CNEA'],
    },
    {
      year: 2006,
      title: 'Reactivación de Atucha II',
      description:
        'El gobierno nacional reactiva la construcción de Atucha II, paralizada desde 1994. La obra se retoma con financiamiento del presupuesto nacional.',
      significance: 'turning_point',
      category: 'political',
      sources: ['NA-SA'],
    },
    {
      year: 2007,
      title: 'Reacondicionamiento de Pilcaniyeu',
      description:
        'Se inician las tareas de reacondicionamiento del Complejo Tecnológico Pilcaniyeu, con el objetivo de reanudar la capacidad de enriquecimiento de uranio.',
      significance: 'turning_point',
      category: 'technical',
      sources: ['CNEA'],
    },
    {
      year: 2014,
      month: 6,
      title: 'Atucha II en operación comercial',
      description:
        'Atucha II (745 MWe) comienza a entregar energía a la red eléctrica nacional el 27 de junio de 2014, tras 33 años desde el inicio de su construcción. Es la tercera central nuclear en operación del país.',
      significance: 'milestone',
      category: 'technical',
      sources: ['NA-SA'],
    },
    {
      year: 2015,
      title: 'Reinauguración de Pilcaniyeu',
      description:
        'Se reinaugura el Complejo Tecnológico Pilcaniyeu, recuperando la capacidad de enriquecimiento de uranio. Sin embargo, la planta no alcanzaría producción industrial.',
      significance: 'milestone',
      category: 'technical',
      sources: ['CNEA'],
    },
    {
      year: 2016,
      title: 'Inicio de construcción del RA-10',
      description:
        'Comienza la construcción del RA-10, reactor multipropósito de 30 MWt diseñado para producir radioisótopos y realizar ensayos de materiales. Es el proyecto más importante de la CNEA en el siglo XXI.',
      significance: 'milestone',
      category: 'technical',
      sources: ['CNEA'],
    },
    {
      year: 2017,
      month: 9,
      title: 'Río Negro prohíbe centrales nucleares (Ley 5.227)',
      description:
        'La Legislatura de Río Negro sanciona la Ley Provincial 5.227, prohibiendo la instalación de centrales nucleares de potencia en todo su territorio. Esto ocurre meses después de que el gobernador apoyara públicamente el proyecto de quinta central nuclear en la costa rionegrina.',
      significance: 'crisis',
      category: 'legal',
      relatedEntities: ['rio-negro'],
      sources: ['Ley Provincial 5.227'],
    },
    {
      year: 2018,
      month: 10,
      title: 'STJ Río Negro rechaza inconstitucionalidad',
      description:
        'El Superior Tribunal de Justicia de Río Negro rechaza la demanda de inconstitucionalidad presentada por el intendente de Sierra Grande contra la Ley 5.227, amparándose en el artículo 124 de la Constitución Nacional.',
      significance: 'turning_point',
      category: 'legal',
      sources: ['STJ Río Negro, 26/10/2018'],
    },
    {
      year: 2024,
      title: 'Declaración de Triplicar Energía Nuclear — COP28',
      description:
        'Seis países adicionales firman la declaración para triplicar la capacidad nuclear instalada hacia 2050. El Banco Mundial levanta su prohibición de 60 años de financiar proyectos nucleares.',
      significance: 'context',
      category: 'international',
      sources: ['Clean Air Task Force, 2024'],
    },
    {
      year: 2024,
      title: 'Prohibición de uranio ruso en EEUU',
      description:
        'EEUU promulga el "Prohibiting Russian Uranium Imports Act", prohibiendo importaciones de uranio enriquecido de Rusia. Destina $2.700M para impulsar producción local de combustible nuclear.',
      significance: 'context',
      category: 'international',
      sources: ['Nuclear Regulatory Commission, 2024'],
    },
    {
      year: 2025,
      title: 'Data centers impulsan demanda nuclear',
      description:
        'La demanda energética de centros de datos crece un 160% hacia 2030 (Goldman Sachs). Google firma acuerdo con Kairos Power por SMRs. Amazon invierte $500M en SMRs. Microsoft acuerda reabrir Three Mile Island.',
      significance: 'context',
      category: 'international',
      sources: ['Goldman Sachs, 2024'],
    },
  ]

  for (const m of milestones) {
    await prisma.historyMilestone.create({ data: m })
  }
  console.log(`  ✅ ${milestones.length} hitos históricos`)

  // ── Province Nuclear Status ───────────────────────────────
  const provinces = [
    { province: 'Buenos Aires', provinceCode: 'BA', nuclearAllowed: true, uraniumAllowed: true, restrictionType: 'none', notes: 'Alberga Atucha I, Atucha II, CAREM, RA-3 y RA-10.' },
    { province: 'CABA', provinceCode: 'CABA', nuclearAllowed: true, uraniumAllowed: false, restrictionType: 'none', notes: 'Alberga RA-1 y Centro Atómico Constituyentes.' },
    { province: 'Catamarca', provinceCode: 'CT', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'constitutional', legislationRef: 'Constitución Provincial — Art. 68', notes: 'Prohíbe actividades nucleares y minería de uranio.' },
    { province: 'Chaco', provinceCode: 'CC', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'Chubut', provinceCode: 'CH', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'constitutional', legislationRef: 'Constitución Provincial 1994', notes: 'Constitución prohíbe centrales nucleares. Proyecto Laguna Salada en PEA.' },
    { province: 'Córdoba', provinceCode: 'CB', nuclearAllowed: true, uraniumAllowed: false, restrictionType: 'none', notes: 'Alberga Embalse. Minería de uranio restringida (Los Gigantes).' },
    { province: 'Corrientes', provinceCode: 'CR', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'Entre Ríos', provinceCode: 'ER', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'Formosa', provinceCode: 'FO', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'Jujuy', provinceCode: 'JY', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'La Pampa', provinceCode: 'LP', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'La Rioja', provinceCode: 'LR', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: 'Históricamente tuvo minería de uranio.' },
    { province: 'Mendoza', provinceCode: 'MZ', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', legislationRef: 'Ley 7.722 (2007)', notes: 'Ley 7.722 prohíbe minería de uranio. Alberga proyecto Sierra Pintada (10.010tU).' },
    { province: 'Misiones', provinceCode: 'MI', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'Neuquén', provinceCode: 'NQ', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: 'Alberga ENSI (agua pesada).' },
    { province: 'Río Negro', provinceCode: 'RN', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', legislationRef: 'Ley 5.227 (2017)', notes: 'Paradoja: alberga CAB, INVAP, Instituto Balseiro y Pilcaniyeu pero prohíbe centrales.' },
    { province: 'Salta', provinceCode: 'SA', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: 'Alberga proyecto Don Otto (430tU).' },
    { province: 'San Juan', provinceCode: 'SJ', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'San Luis', provinceCode: 'SL', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: 'Históricamente tuvo minería de uranio (La Estela).' },
    { province: 'Santa Cruz', provinceCode: 'SC', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'Santa Fe', provinceCode: 'SF', nuclearAllowed: true, uraniumAllowed: false, restrictionType: 'none', notes: 'Alberga RA-4 (Rosario).' },
    { province: 'Santiago del Estero', provinceCode: 'SE', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'Tierra del Fuego', provinceCode: 'TF', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
    { province: 'Tucumán', provinceCode: 'TC', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: '' },
  ]

  for (const p of provinces) {
    await prisma.provinceNuclearStatus.upsert({
      where: { province: p.province },
      update: p,
      create: p,
    })
  }
  console.log(`  ✅ ${provinces.length} provincias con status nuclear`)

  console.log('🌱 Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
