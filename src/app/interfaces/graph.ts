import { GraphType } from "../enums/graph";
import { Operation } from "../enums/operation";
import { Dataset } from "./dataset";

export interface GraphStruct {
  dataset: Dataset
  series: SerieStruct[]
  fields?: any[]
}

export interface SerieStruct {
  label: string
  groupByAttribute?: string
  valueAttribute: string
  operation: Operation
  data: DataStruct[]
  graphType: GraphType
  graphCompatibility: string
  yAxisID?: string // graph option scales key ref
  backgroundColor?: string | string[]
}

export interface DataStruct {
  label: string
  value: number
}
