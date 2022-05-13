import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SortEvent } from 'primeng-lts/api';
import { ColumnDef } from 'src/app/shared/interfaces/table';
import { CellRenderer } from 'src/app/shared/services/cell-renderer';

@Component({
  selector: 'simple-table',
  templateUrl: './simple-table.component.html'
})
export class SimpleTableComponent implements OnInit {
  @Input() data: any[] = []
  @Input() dataKey = 'id'

  _cols: ColumnDef[] = []
  @Input() set cols(columns: any[]) {
    this._cols = columns
    this._cols.forEach((c) => {
      if (!c.renderer) {
        c.renderer = CellRenderer.none
      }
    })
  }
  get cols(): ColumnDef[] {
    return this._cols
  }

  @Input() customSort: boolean = false
  @Output() sortFunction: EventEmitter<SortEvent> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  dataTableSort(event: any): void {
    this.sortFunction.emit(event as SortEvent)
  }
}
