export interface CellComponent {
  component: any
  options?: any
  events?: any
}

export interface CellComponentOptionsList {
  items: any[]
  itemValue?: string
  itemLabel?: string
}

export interface CellComponentEventsList {
  change: (originalEvent: any, rowData: any, field: any) => void
}
