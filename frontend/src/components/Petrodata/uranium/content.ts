// Pure, locale-aware static content for the uranium educational sections.
// Driven by the app's global locale (no per-card toggle — consistent with the
// rest of the site). Sourced from the URANIUM-3 ticket outline.

export type Locale = 'es' | 'en'

export type FuelCycleStep = {
  /** Stable id + maps to a schematic SVG scene. */
  id:
    | 'deposit'
    | 'prospecting'
    | 'exploration'
    | 'mining'
    | 'crushing'
    | 'leaching'
    | 'ionexchange'
    | 'precipitation'
    | 'conversion'
    | 'fuel'
    | 'generation'
    | 'waste'
  n: number
  title: string
  body: string
  keyFact: string
  argentina: string
}

const STEPS_ES: FuelCycleStep[] = [
  { id: 'deposit', n: 1, title: 'Formación geológica', body: 'El uranio existe en la corteza terrestre a 2–4 ppm y se concentra en depósitos explotables a lo largo de millones de años.', keyFact: 'Corteza terrestre: 2–4 ppm de uranio', argentina: '33.650 tU identificados en recursos en Argentina.' },
  { id: 'prospecting', n: 2, title: 'Prospección', body: 'Relevamientos radiométricos aéreos, geoquímica y mapeo geológico delimitan zonas de interés antes de perforar.', keyFact: 'Técnicas: radiometría aérea + geoquímica', argentina: 'La CNEA realiza prospección en 6 provincias.' },
  { id: 'exploration', n: 3, title: 'Exploración avanzada', body: 'Perforaciones y muestreo sistemático permiten estimar recursos y su grado de confianza.', keyFact: 'Perforación → estimación de recursos', argentina: '21 proyectos con distintos grados de avance.' },
  { id: 'mining', n: 4, title: 'Minería', body: 'Se extrae el mineral a cielo abierto (depósitos someros) o de forma subterránea (depósitos profundos).', keyFact: 'Cielo abierto vs. subterránea', argentina: 'Sierra Pintada (Mendoza) y Don Otto (Salta), en factibilidad.' },
  { id: 'crushing', n: 5, title: 'Trituración', body: 'La roca se reduce de tamaño y un túnel radiométrico clasifica el material por su concentración de uranio.', keyFact: 'Clasificación radiométrica del mineral', argentina: 'Túnel radiométrico separa por ley antes de procesar.' },
  { id: 'leaching', n: 6, title: 'Lixiviación', body: 'Ácido sulfúrico (H₂SO₄) disuelve el uranio y lo separa de la roca estéril, generando una solución cargada.', keyFact: 'H₂SO₄ separa el U de la roca', argentina: 'Planchada impermeabilizada + piletas de proceso.' },
  { id: 'ionexchange', n: 7, title: 'Intercambio iónico', body: 'Resinas capturan selectivamente el uranio desde la solución y lo concentran.', keyFact: 'Resinas concentran el uranio en solución', argentina: 'Columnas de intercambio iónico en planta.' },
  { id: 'precipitation', n: 8, title: 'Precipitación', body: 'El agregado de amoníaco precipita el uranio como U₃O₈ — el "yellowcake", con ~70% de uranio.', keyFact: 'Yellowcake (U₃O₈): ~70% de uranio', argentina: '2.600 tU producidas históricamente (1952–1997).' },
  { id: 'conversion', n: 9, title: 'Conversión', body: 'El U₃O₈ se convierte químicamente en dióxido de uranio (UO₂), apto para fabricar combustible.', keyFact: 'U₃O₈ → UO₂', argentina: 'Se realiza en planta de conversión de la CNEA.' },
  { id: 'fuel', n: 10, title: 'Fabricación de combustible', body: 'El UO₂ se prensa en pastillas y se ensambla en vainas de aleación de circonio que forman los elementos combustibles.', keyFact: 'Pastillas UO₂ en vainas de circonio', argentina: 'Abastece a Atucha I, Atucha II y Embalse.' },
  { id: 'generation', n: 11, title: 'Generación eléctrica', body: 'La fisión nuclear genera calor que produce vapor y mueve turbinas para generar electricidad.', keyFact: 'Fisión → calor → vapor → electricidad', argentina: '≈7% del SADI proviene de generación nuclear.' },
  { id: 'waste', n: 12, title: 'Gestión de residuos', body: 'El combustible gastado se almacena en seco de forma segura, a la espera de su disposición final.', keyFact: 'Almacenamiento en seco + disposición', argentina: '7 sitios con remediación ambiental activa.' },
]

const STEPS_EN: FuelCycleStep[] = [
  { id: 'deposit', n: 1, title: 'Geological formation', body: 'Uranium occurs in the Earth’s crust at 2–4 ppm and concentrates into mineable deposits over millions of years.', keyFact: 'Crustal abundance: 2–4 ppm uranium', argentina: '33,650 tU identified in resources in Argentina.' },
  { id: 'prospecting', n: 2, title: 'Prospecting', body: 'Airborne radiometric surveys, geochemistry and geological mapping outline targets before any drilling.', keyFact: 'Techniques: airborne radiometry + geochem', argentina: 'CNEA runs prospecting across 6 provinces.' },
  { id: 'exploration', n: 3, title: 'Advanced exploration', body: 'Drilling and systematic sampling let geologists estimate resources and their confidence level.', keyFact: 'Drilling → resource estimation', argentina: '21 projects at varying levels of maturity.' },
  { id: 'mining', n: 4, title: 'Mining', body: 'Ore is extracted via open pit (shallow deposits) or underground methods (deep deposits).', keyFact: 'Open pit vs. underground', argentina: 'Sierra Pintada (Mendoza) and Don Otto (Salta), at feasibility.' },
  { id: 'crushing', n: 5, title: 'Crushing', body: 'Rock is reduced in size and a radiometric tunnel sorts material by its uranium concentration.', keyFact: 'Radiometric ore sorting', argentina: 'A radiometric tunnel grades ore before processing.' },
  { id: 'leaching', n: 6, title: 'Leaching', body: 'Sulfuric acid (H₂SO₄) dissolves uranium and separates it from barren rock into a loaded solution.', keyFact: 'H₂SO₄ separates U from rock', argentina: 'Lined pads and process ponds.' },
  { id: 'ionexchange', n: 7, title: 'Ion exchange', body: 'Resins selectively capture uranium from solution and concentrate it.', keyFact: 'Resins concentrate uranium in solution', argentina: 'Ion-exchange columns at the plant.' },
  { id: 'precipitation', n: 8, title: 'Precipitation', body: 'Adding ammonia precipitates uranium as U₃O₈ — "yellowcake", about 70% uranium.', keyFact: 'Yellowcake (U₃O₈): ~70% uranium', argentina: '2,600 tU produced historically (1952–1997).' },
  { id: 'conversion', n: 9, title: 'Conversion', body: 'U₃O₈ is chemically converted into uranium dioxide (UO₂), suitable for fuel fabrication.', keyFact: 'U₃O₈ → UO₂', argentina: 'Carried out at CNEA’s conversion plant.' },
  { id: 'fuel', n: 10, title: 'Fuel fabrication', body: 'UO₂ is pressed into pellets and assembled into zirconium-alloy rods that form the fuel elements.', keyFact: 'UO₂ pellets in zirconium cladding', argentina: 'Supplies Atucha I, Atucha II and Embalse.' },
  { id: 'generation', n: 11, title: 'Power generation', body: 'Nuclear fission releases heat that raises steam and drives turbines to generate electricity.', keyFact: 'Fission → heat → steam → electricity', argentina: '≈7% of the SADI grid comes from nuclear.' },
  { id: 'waste', n: 12, title: 'Waste management', body: 'Spent fuel is safely dry-stored, awaiting final disposal.', keyFact: 'Dry storage + final disposal', argentina: '7 sites under active environmental remediation.' },
]

export function getFuelCycle(locale: Locale): FuelCycleStep[] {
  return locale === 'en' ? STEPS_EN : STEPS_ES
}

export type TimelineEvent = { year: string; text: string }

const TIMELINE_ES: TimelineEvent[] = [
  { year: '1946', text: 'Primer depósito de uranio (Mendoza)' },
  { year: '1952', text: 'Primeras 4,5 t de yellowcake' },
  { year: '1955', text: 'Mina Huemul en Malargüe' },
  { year: '1997', text: 'Cierra Sierra Pintada' },
  { year: '2026', text: 'Reactivación de proyectos' },
]

const TIMELINE_EN: TimelineEvent[] = [
  { year: '1946', text: 'First uranium deposit (Mendoza)' },
  { year: '1952', text: 'First 4.5 t of yellowcake' },
  { year: '1955', text: 'Huemul mine in Malargüe' },
  { year: '1997', text: 'Sierra Pintada closes' },
  { year: '2026', text: 'Projects reactivated' },
]

export function getArgentinaTimeline(locale: Locale): TimelineEvent[] {
  return locale === 'en' ? TIMELINE_EN : TIMELINE_ES
}
