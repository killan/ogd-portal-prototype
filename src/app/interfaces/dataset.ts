export interface Dataset {
  id: string
  name?: string
  description?: string
  downloads?: number
  pubCycle?: number
  perdiodicity?: number
  themes?: {
      id: number
      label: string
    }[]
  keywords?: string[]
  licence?: {
    name: string
    url?: string
  }
  language?: string
  modifiedAt: string
  producer?: {
    id: 0,
    name: string
    url: string
  }
  territory?: string
  updatedAt?: {
    metadata?: string
    data?: string
  }
  data?: Data[]
}

export interface Data {
  datasetid: string
  recordid: string
  fields: {[key: string]: any}
  geometry: Geometry
  record_timestamp: string
}

export interface Geometry {
  type: string
  coordinates: number | number[]
}
