import { Component, OnInit } from '@angular/core';
import { CellComponentEventsList, CellComponentOptionsList } from 'src/app/shared/interfaces/cell-component';

@Component({
  selector: 'cc-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  // Must be in a parent class
  options?: CellComponentOptionsList // Specific to list, any for generic
  events?: CellComponentEventsList
  rowData!: any
  field!: string

  // Specific to list
  items: any[] = []
  itemValue!: string
  itemLabel!: string

  value?: string

  ngOnInit(): void {
    this.items = this.options?.items || []
    this.itemValue = this.options?.itemValue || 'id'
    this.itemLabel = this.options?.itemLabel || 'label'

    this.value = this.rowData[this.field]
  }

  change(event: any): void {
    if (event.stopPropagation) {
      event.stopPropagation()
    }

    this.rowData[this.field] = this.value

    this.events?.change(event, this.rowData, this.field)
  }
}
