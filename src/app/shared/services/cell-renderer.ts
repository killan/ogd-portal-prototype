import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class CellRenderer {
  static none(rowData: any, field: string): string {
    const value: any = rowData ? rowData[field] : false

    if (value || value === 0) {
      return value
    }

    return ''
  }
}
