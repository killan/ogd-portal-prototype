import { GraphType } from "../enums/graph";
import { Dataset } from "./dataset";

export interface GraphStruct {
  dataset: Dataset
  serie: SerieStruct[]
}

export interface SerieStruct {
  label: string
  groupByAttribute: string
  valueAttribute: string
  data: DataStruct[]
  graphType: GraphType
  yAxisID?: string // graph option scales key ref
  backgroundColor?: string | string[]
}

export interface DataStruct {
  label: string
  value: number
}
