import { CellComponent } from "./cell-component";

export interface ColumnDef {
  field: string
  header: string
  renderer?: (rowData: any, field: string) => string
  components?: CellComponent[]
}
