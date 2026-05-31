// Normalised, serialisable prop shapes shared between the server page and the
// client section components. The page does the ugly DTO casting once; every
// component below receives clean numbers/strings.

export type PriceExtreme = { value: number; date: string }

export type HeroData = {
  price: number | null
  date: string | null
  changePct: number | null
  low: PriceExtreme | null
  high: PriceExtreme | null
  resources: number | null
  production: number | null
  unit: string
}

export type StatsData = {
  projects: number
  provinces: number
  companies: number
  advanced: number
  resources: number | null
}

export type PricePoint = { date: string; price: number }

export type ProjectPoint = {
  name: string
  lat: number
  lng: number
  province: string
  statusCode: string
  statusLabel: string
  company: string
  origin: string
}

export type StatusSlice = { label: string; count: number; color: string }

export type TradeRow = { year: number; type: 'import' | 'export'; value: number }
