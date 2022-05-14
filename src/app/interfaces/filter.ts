import { FilterMode } from "../enums/filter"

export interface Filter {
  label: string
  attr: string
  value: string
  mode: FilterMode
}
