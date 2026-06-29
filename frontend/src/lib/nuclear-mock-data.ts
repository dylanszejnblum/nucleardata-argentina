// nuclear-mock-data.ts — Mock data for Argentina Nuclear Atlas
// Replace with API calls when backend is ready.

export interface ReactorData {
  id: string
  name: string
  type: 'PHWR' | 'CANDU' | 'CAREM' | 'pool' | 'tanque'
  status: 'operational' | 'construction' | 'shutdown' | 'decommissioned'
  category: 'power' | 'research' | 'prototype'
  latitude: number
  longitude: number
  province: string
  city: string
  capacityMwe: number | null
  capacityMwt: number | null
  firstCriticality: string | null   // ISO date
  gridConnection: string | null
  operator: string
  owner: string
  supplier: string
  fuelType: string
  coolant: string
  moderator: string
  lifetimeFactor: number | null
  statusDetail: string
  color: string  // for map pins
}

export const REACTORS: ReactorData[] = [
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
    firstCriticality: '1974-03-19',
    gridConnection: '1974-06-24',
    operator: 'Nucleoeléctrica Argentina S.A.',
    owner: 'CNEA / NA-SA',
    supplier: 'Siemens (KWU)',
    fuelType: 'UO₂ natural',
    coolant: 'Agua pesada (D₂O)',
    moderator: 'Agua pesada (D₂O)',
    lifetimeFactor: 68.5,
    statusDetail: 'En operación. Extensión de vida en evaluación.',
    color: '#34e89e',
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
    firstCriticality: '2014-06-03',
    gridConnection: '2014-06-27',
    operator: 'Nucleoeléctrica Argentina S.A.',
    owner: 'CNEA / NA-SA',
    supplier: 'Siemens (KWU)',
    fuelType: 'UO₂ natural',
    coolant: 'Agua pesada (D₂O)',
    moderator: 'Agua pesada (D₂O)',
    lifetimeFactor: 72.1,
    statusDetail: 'En operación. Construcción iniciada en 1981, paralizada 1994–2006.',
    color: '#34e89e',
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
    firstCriticality: '1983-06-13',
    gridConnection: '1984-01-20',
    operator: 'Nucleoeléctrica Argentina S.A.',
    owner: 'CNEA / NA-SA',
    supplier: 'Atomic Energy of Canada Ltd. (AECL)',
    fuelType: 'UO₂ natural',
    coolant: 'Agua pesada (D₂O)',
    moderator: 'Agua pesada (D₂O)',
    lifetimeFactor: 75.0,
    statusDetail: 'En operación. Extensión de vida completada 2019. Nueva vida útil hasta 2045+.',
    color: '#34e89e',
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
    fuelType: 'UO₂ enriquecido (3.1%)',
    coolant: 'Agua liviana (H₂O)',
    moderator: 'Agua liviana (H₂O)',
    lifetimeFactor: null,
    statusDetail: 'En construcción. Prototipo del primer SMR 100% argentino.',
    color: '#4a9eff',
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
    firstCriticality: '1958-01-17',
    gridConnection: null,
    operator: 'CNEA',
    owner: 'CNEA',
    supplier: 'CNEA',
    fuelType: 'UO₂ enriquecido (20%)',
    coolant: 'Agua liviana',
    moderator: 'Agua liviana / grafito',
    lifetimeFactor: null,
    statusDetail: 'Operacional. Primer reactor de América Latina y el hemisferio sur.',
    color: '#5bc0eb',
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
    firstCriticality: '1967-12-20',
    gridConnection: null,
    operator: 'CNEA',
    owner: 'CNEA',
    supplier: 'CNEA',
    fuelType: 'UO₂ enriquecido (20%)',
    coolant: 'Agua liviana',
    moderator: 'Agua liviana',
    lifetimeFactor: null,
    statusDetail: 'Operacional. Principal productor de radioisótopos médicos.',
    color: '#5bc0eb',
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
    firstCriticality: '1971-07-08',
    gridConnection: null,
    operator: 'CNEA / UNR',
    owner: 'CNEA',
    supplier: 'CNEA',
    fuelType: 'UO₂ enriquecido (20%)',
    coolant: 'Agua liviana',
    moderator: 'Agua liviana',
    lifetimeFactor: null,
    statusDetail: 'Operacional. Reactor de enseñanza e investigación.',
    color: '#5bc0eb',
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
    firstCriticality: '1982-09-28',
    gridConnection: null,
    operator: 'CNEA / Instituto Balseiro',
    owner: 'CNEA',
    supplier: 'CNEA',
    fuelType: 'UO₂ enriquecido (20%)',
    coolant: 'Agua liviana',
    moderator: 'Agua liviana',
    lifetimeFactor: null,
    statusDetail: 'Operacional. Reactor de investigación y formación en el CAB.',
    color: '#5bc0eb',
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
    fuelType: 'UO₂ enriquecido (20%)',
    coolant: 'Agua liviana',
    moderator: 'Agua liviana',
    lifetimeFactor: null,
    statusDetail: 'En construcción. Reactor multipropósito para radioisótopos y ensayos.',
    color: '#4a9eff',
  },
]

export const REACTOR_SUMMARY = {
  totalMwe: 1790,         // Atucha I 362 + Atucha II 745 + Embalse 683
  totalMwt: 5403,
  gridPercentage: 7,       // ~7% of Argentina's electricity
  operationalPowerReactors: 3,
  operationalResearchReactors: 5,
  underConstruction: 2,    // CAREM + RA-10
  averageLifetimeFactor: 71.9,
  co2AvoidedTonnes: 10000000,  // ~10M tonnes/year
}

export interface HistoryMilestone {
  id: number
  year: number
  month?: number
  title: string
  description: string
  significance: 'milestone' | 'crisis' | 'turning_point' | 'context'
  category: 'institutional' | 'technical' | 'political' | 'international' | 'legal'
  relatedEntities?: string[]
  sources: string[]
}

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  { id: 1, year: 1950, month: 5, title: 'Creación de la CNEA', description: 'El 31 de mayo se crea la Comisión Nacional de Energía Atómica mediante Decreto PEN Nº 10936/50. Es el punto de partida del desarrollo nuclear argentino con fines pacíficos.', significance: 'milestone', category: 'institutional', sources: ['Decreto PEN Nº 10936/50'] },
  { id: 2, year: 1955, title: 'Creación del Instituto Balseiro', description: 'Se funda el Instituto Balseiro en Bariloche, institución de excelencia en física e ingeniería nuclear.', significance: 'milestone', category: 'institutional', sources: ['Historia IB'] },
  { id: 3, year: 1958, month: 1, title: 'RA-1 alcanza criticidad', description: 'El RA-1 se convierte en el primer reactor nuclear de América Latina y el hemisferio sur.', significance: 'milestone', category: 'technical', sources: ['CNEA — RA-1'] },
  { id: 4, year: 1974, month: 3, title: 'Atucha I — primer reactor de potencia', description: 'Atucha I (362 MWe) entra en operación. Es el primer reactor nuclear de potencia de América Latina, construido con Siemens (KWU).', significance: 'milestone', category: 'technical', sources: ['NA-SA'] },
  { id: 5, year: 1976, title: 'Creación de INVAP', description: 'Se funda INVAP S.E., que se convertiría en la empresa de tecnología nuclear más importante de Argentina y exportador global de reactores.', significance: 'milestone', category: 'institutional', relatedEntities: ['invap'], sources: ['INVAP'] },
  { id: 6, year: 1984, title: 'El Bolsón se declara "Zona No Nuclear"', description: 'El municipio de El Bolsón (Río Negro) se declara Zona No Nuclear mediante Ordenanza Municipal Nº 069/84. Primer antecedente de legislación antinuclear en Argentina.', significance: 'turning_point', category: 'legal', sources: ['Ordenanza Municipal Nº 069/84'] },
  { id: 7, year: 2014, month: 6, title: 'Atucha II en operación', description: 'Atucha II (745 MWe) comienza a generar electricidad tras 33 años desde el inicio de su construcción.', significance: 'milestone', category: 'technical', sources: ['NA-SA'] },
  { id: 8, year: 2017, month: 9, title: 'Río Negro prohíbe centrales nucleares', description: 'La Ley Provincial 5.227 prohíbe centrales nucleares en Río Negro, meses después de que el gobernador apoyara la quinta central nuclear.', significance: 'crisis', category: 'legal', relatedEntities: ['rio-negro'], sources: ['Ley Provincial 5.227'] },
  { id: 9, year: 2024, title: 'COP28 — declaración de triplicar nuclear', description: 'Seis países firman la declaración para triplicar capacidad nuclear hacia 2050. El Banco Mundial levanta su prohibición de 60 años.', significance: 'context', category: 'international', sources: ['Clean Air Task Force, 2024'] },
  { id: 10, year: 2025, title: 'Data centers impulsan demanda nuclear', description: 'Goldman Sachs proyecta +160% en demanda energética de data centers hacia 2030. Google, Amazon y Microsoft firman acuerdos nucleares.', significance: 'context', category: 'international', sources: ['Goldman Sachs, 2024'] },
]

export interface FuelCycleStep {
  id: number
  key: string
  nameEs: string
  nameEn: string
  descriptionEs: string
  descriptionEn: string
  capability: 'yes' | 'partial' | 'no'
  detailEs: string
  detailEn: string
  relatedActors: string[]
}

export const FUEL_CYCLE_STEPS: FuelCycleStep[] = [
  { id: 1, key: 'exploration', nameEs: 'Exploración', nameEn: 'Exploration', descriptionEs: 'Búsqueda de yacimientos de uranio', descriptionEn: 'Uranium deposit exploration', capability: 'yes', detailEs: 'CNEA realizó exploración histórica, identificando depósitos en Salta, Mendoza, Chubut, Córdoba y San Luis.', detailEn: 'CNEA has conducted historical exploration, identifying deposits in Salta, Mendoza, Chubut, Córdoba and San Luis.', relatedActors: ['CNEA'] },
  { id: 2, key: 'mining', nameEs: 'Minería', nameEn: 'Mining', descriptionEs: 'Extracción de mineral de uranio', descriptionEn: 'Uranium ore extraction', capability: 'partial', detailEs: 'Argentina tuvo 8 complejos minero-fabriles en operación. Hoy ninguna mina activa. Proyectos en feasibility: Don Otto (Salta), Sierra Pintada (Mendoza).', detailEn: 'Argentina had 8 mining complexes operating. Today zero active mines. Projects in feasibility: Don Otto (Salta), Sierra Pintada (Mendoza).', relatedActors: ['CNEA', 'Dioxitek'] },
  { id: 3, key: 'milling', nameEs: 'Molienda', nameEn: 'Milling', descriptionEs: 'Concentración del uranio (yellowcake)', descriptionEn: 'Uranium concentration (yellowcake)', capability: 'partial', detailEs: 'Dioxitek produce dióxido de uranio en Córdoba a partir de concentrados importados.', detailEn: 'Dioxitek produces uranium dioxide in Córdoba from imported concentrates.', relatedActors: ['Dioxitek', 'CNEA'] },
  { id: 4, key: 'conversion', nameEs: 'Conversión', nameEn: 'Conversion', descriptionEs: 'Conversión a UF₆ para enriquecimiento', descriptionEn: 'Conversion to UF₆ for enrichment', capability: 'no', detailEs: 'Argentina no tiene capacidad de conversión activa. Depende de servicios externos.', detailEn: 'Argentina has no active conversion capability. Relies on external services.', relatedActors: [] },
  { id: 5, key: 'enrichment', nameEs: 'Enriquecimiento', nameEn: 'Enrichment', descriptionEs: 'Enriquecimiento del isótopo U-235', descriptionEn: 'U-235 isotope enrichment', capability: 'partial', detailEs: 'Complejo Pilcaniyeu tiene capacidad por difusión gaseosa. Reacondicionado en 2015 pero sin producción industrial.', detailEn: 'Pilcaniyeu complex has gas diffusion capability. Refurbished in 2015 but no industrial production.', relatedActors: ['CNEA', 'Pilcaniyeu'] },
  { id: 6, key: 'fabrication', nameEs: 'Fabricación', nameEn: 'Fabrication', descriptionEs: 'Fabricación de elementos combustibles', descriptionEn: 'Fuel element fabrication', capability: 'yes', detailEs: 'CONUAR-FAE (CNEA + Pérez Companc) fabrica combustibles para Atucha y Embalse en el Centro Atómico Ezeiza.', detailEn: 'CONUAR-FAE (CNEA + Pérez Companc) manufactures fuels for Atucha and Embalse at Ezeiza.', relatedActors: ['CONUAR-FAE', 'CNEA'] },
  { id: 7, key: 'generation', nameEs: 'Generación', nameEn: 'Generation', descriptionEs: 'Generación nucleoeléctrica', descriptionEn: 'Nuclear power generation', capability: 'yes', detailEs: '3 centrales operativas: Atucha I (362 MWe), Atucha II (745 MWe), Embalse (683 MWe). ~7% de la matriz eléctrica nacional.', detailEn: '3 operating plants: Atucha I (362 MWe), Atucha II (745 MWe), Embalse (683 MWe). ~7% of national grid.', relatedActors: ['NA-SA', 'CNEA'] },
  { id: 8, key: 'spent-fuel', nameEs: 'Combustible gastado', nameEn: 'Spent fuel', descriptionEs: 'Gestión del combustible irradiado', descriptionEn: 'Spent fuel management', capability: 'partial', detailEs: 'Almacenamiento en piscinas dentro de cada central. Embalse tiene almacenamiento en seco (dry storage).', detailEn: 'Pool storage at each plant. Embalse has dry storage facility.', relatedActors: ['NA-SA', 'CNEA'] },
  { id: 9, key: 'storage', nameEs: 'Almacenamiento', nameEn: 'Storage', descriptionEs: 'Almacenamiento definitivo', descriptionEn: 'Long-term storage', capability: 'partial', detailEs: 'Embalse cuenta con almacenamiento en seco (MACSTOR). No hay depósito definitivo.', detailEn: 'Embalse has dry storage (MACSTOR). No permanent repository exists.', relatedActors: ['NA-SA', 'CNEA'] },
  { id: 10, key: 'disposal', nameEs: 'Disposición final', nameEn: 'Final disposal', descriptionEs: 'Repositorio geológico profundo', descriptionEn: 'Deep geological repository', capability: 'no', detailEs: 'Proyecto Gastre (Chubut) cancelado por oposición social en los 90s. No hay alternativa activa.', detailEn: 'Gastre project (Chubut) cancelled due to social opposition in the 90s. No active alternative.', relatedActors: ['CNEA'] },
]

export interface ProvinceNuclearInfo {
  province: string
  code: string
  nuclearAllowed: boolean
  uraniumAllowed: boolean | null
  restrictionType: string
  notes: string
  color: string  // for heatmap
}

export const PROVINCES_NUCLEAR: ProvinceNuclearInfo[] = [
  { province: 'Buenos Aires', code: 'BA', nuclearAllowed: true, uraniumAllowed: true, restrictionType: 'none', notes: 'Alberga Atucha I, II, CAREM, RA-3 y RA-10', color: '#34e89e' },
  { province: 'CABA', code: 'CABA', nuclearAllowed: true, uraniumAllowed: false, restrictionType: 'none', notes: 'Alberga RA-1 y Centro Atómico Constituyentes', color: '#34e89e' },
  { province: 'Córdoba', code: 'CB', nuclearAllowed: true, uraniumAllowed: false, restrictionType: 'none', notes: 'Alberga Embalse. Minería de uranio restringida.', color: '#a8e834' },
  { province: 'Santa Fe', code: 'SF', nuclearAllowed: true, uraniumAllowed: false, restrictionType: 'none', notes: 'Alberga RA-4 (Rosario)', color: '#a8e834' },
  { province: 'Catamarca', code: 'CT', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'constitutional', notes: 'Constitución prohíbe actividades nucleares', color: '#e83434' },
  { province: 'Chubut', code: 'CH', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'constitutional', notes: 'Constitución prohíbe centrales. Proyecto Laguna Salada.', color: '#e83434' },
  { province: 'Mendoza', code: 'MZ', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: 'Ley 7.722 (2007) prohíbe minería de uranio. Sierra Pintada (10.010tU).', color: '#e83434' },
  { province: 'Río Negro', code: 'RN', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: 'Ley 5.227 prohíbe centrales. Paradoja: alberga CAB, INVAP, IB, Pilcaniyeu.', color: '#e83434' },
  { province: 'Neuquén', code: 'NQ', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: 'Alberga ENSI (agua pesada).', color: '#e89e34' },
  { province: 'Salta', code: 'SA', nuclearAllowed: false, uraniumAllowed: false, restrictionType: 'legal', notes: 'Alberga proyecto Don Otto (430tU).', color: '#e89e34' },
]

export const KPI_DATA = {
  totalMwe: 1790,
  gridPercentage: 7,
  caremCapacity: 32,
  u3o8Price: 65.40,
  uraniumProjects: 4,
  historicalMines: 8,
  activeReactors: 3,
  researchReactors: 5,
  provincesBlocking: 20,
  isotopesProduced: 4,
  dataFreshness: '2026-06-28',
}
