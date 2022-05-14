import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GraphType } from 'src/app/enums/graph';
import { Operation } from 'src/app/enums/operation';
import { FilterMode } from 'src/app/enums/filter';

import { GraphStruct } from 'src/app/interfaces/graph';
import { ColumnDef } from 'src/app/shared/interfaces/table';
import { Filter } from 'src/app/interfaces/filter';

import { DatasetService } from 'src/app/services/dataset.service';
import { GraphService } from 'src/app/services/graph.service';
import { sortByProperty } from 'src/app/services/sort';
import { TranslatorService } from 'src/app/services/translator.service';

import { Dropdown } from 'primeng-lts/dropdown';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  tabs: any[] = [
    { label: 'Information', key: 'info', icon: 'fa-circle-info' },
    { label: 'Données', key: 'data', icon: 'fa-table' },
    { label: 'Carte', key: 'map', icon: 'fa-earth-europe' },
    { label: 'Analyse', key: 'analyse', icon: 'fa-chart-column' }
  ]
  curTab: string = 'info'

  // Filters
  filters: Filter[] = []
  modes: any[] = []

  // Analyse
  gs: GraphStruct[] = []

  colors = ['#e76f51', '#2a9d8f', '#457b9d', '#ffafcc', '#cdb4db', '#fca311', '#3a86ff']

  layers: any[] = []

  operations: any[] = []
  graphTypes: any[] = []

  serieCounter: number = 1

  computedOptions: any = {
    bar: {
      responsive: false,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    },
    pie: {
      responsive: false,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    }
  }

  // Table
  cols: ColumnDef[] = []
  activeCols: ColumnDef[] = []
  selectedCols: string[] = []
  dragDropColStartIndex!: number
  dragDropColStartElem!: HTMLElement

  // Cell format
  dateRE = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\+[0-9]{2}:[0-9]{2}/gm

  // Data
  data: any[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private datasetService: DatasetService,
    private graphService: GraphService,
    private translatorService: TranslatorService
  ) {
    this.operations = [
      { id: Operation.Sum, label: this.translatorService.t(Operation.Sum) },
      { id: Operation.Count, label: this.translatorService.t(Operation.Count) }
    ]

    this.modes = [
      { id: FilterMode.Contains, label: this.translatorService.t(FilterMode.Contains) },
      { id: FilterMode.Equal, label: this.translatorService.t(FilterMode.Equal) },
    ]

    let i = 1;
    const compatTypes = this.graphService.getCompatibilityTypes()
    Object.keys(compatTypes).forEach(k => {
      compatTypes[k].forEach(t => {
        this.graphTypes.push({ id: t, label: this.translatorService.t(t) })
        i++
      })
    })
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      const ngs: GraphStruct = {
        dataset: data.dataset,
        series: []
      }

      this.datasetService.getdata(ngs.dataset!.id).subscribe((d) => {
        ngs.dataset!.data = d

        // TODO improve getfirst [0]
        const fieldsString = this.datasetService.getDataFieldsString(ngs.dataset.data[0])
        const fieldsNumber = this.datasetService.getDataFieldsNumber(ngs.dataset.data[0])
        // Save discovered fields on dataset level
        ngs.fields = Object.keys(ngs.dataset.data[0].fields).map(m => ({ id: m, label: this.translatorService.t(m) }))

        // Copy list for table columns option for display
        this.cols = ngs.fields.map(m => ({
          field: m.id,
          header: m.label,
          renderer: (rowData: any, field: string) => {
            let d = rowData[field]
            if (this.dateRE.test(d)) {
              const td = d.split('T')[0].split('-')
              const tt = d.split('T')[1].split('+')
              d = td[2] + '/' + td[1] + '/' + td[0] + ' ' + tt[0].substr(0, 5) + ' (GMT +' + parseInt(tt[1]) + ')'
            }
            return d
          }
        }))
        this.selectedCols = this.cols.map(m => m.field)
        this.selectedColsChange()

        // Add default serie(s)
        ngs.series.push({
          label: 'Série #' + this.serieCounter++,
          graphCompatibility: this.graphService.getCompatibilityFromType(GraphType.Bar),
          graphType: GraphType.Bar,
          groupByAttribute: fieldsString[0],
          valueAttribute: fieldsNumber[0],
          operation: Operation.Sum,
          backgroundColor: this.colors[0],
          data: []
        }, {
          label: 'Série #' + this.serieCounter++,
          graphType: GraphType.Pie,
          graphCompatibility: this.graphService.getCompatibilityFromType(GraphType.Pie),
          valueAttribute: fieldsNumber[fieldsNumber.length - 1],
          operation: Operation.Count,
          backgroundColor: this.colors,
          data: []
        })
        // Add dataset to graph structure
        this.gs.push(ngs)

        // First rendering
        this.computeData()
      })
    })
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max)
  }

  tabChange(tabName: string): void {
    this.curTab = tabName
  }

  serieOptionChange(event: any, gs: GraphStruct, serie: any, attr: string): void {
    // Update the attribute value
    serie[attr] = event.value
    // Update in case of
    serie.graphCompatibility = this.graphService.getCompatibilityFromType(serie.graphType)
    // Specific update
    // Default value needed
    if (attr == 'graphType' && !serie.groupByAttribute) {
      serie.groupByAttribute = gs.fields![0].id
    }
    // Multiple colors needed for pie
    if (attr == 'graphType' && serie.graphType == GraphType.Pie && !Array.isArray(serie.color)) {
      serie.backgroundColor = this.colors
    }
    // Do it again
    this.computeData()
  }

  removeSerie(event: any, gs: GraphStruct, serie: any, index: number): void {
    // Remove
    gs.series.splice(index, 1)
    // Do it again
    this.computeData()
  }

  addSerie(event: any, gs: GraphStruct): void {
    // TODO get default info from dataset presets
    // Add a default one
    gs.series.push({
      label: 'Série #' + this.serieCounter++,
      graphCompatibility: this.graphService.getCompatibilityFromType(GraphType.Bar),
      graphType: GraphType.Bar,
      groupByAttribute: gs.fields![this.getRandomInt(gs.fields!.length)].id,
      valueAttribute: gs.fields![this.getRandomInt(gs.fields!.length)].id,
      operation: Operation.Sum,
      backgroundColor: this.colors[this.getRandomInt(this.colors.length)],
      data: []
    })
    // Do it again
    this.computeData()
  }

  computeData(): void {
    this.layers = []

    if (this.gs && this.gs.length) {
      const monoGraph = this.gs[0];

      // Prepare data, one dataset
      this.data = monoGraph.dataset.data!.filter(d => {
        let pass = true

        this.filters.forEach(f => {
          switch (f.mode) {
            case FilterMode.Contains:
              pass = (d.fields[f.attr] as string).toLowerCase().includes(f.value.toLowerCase())
              break
            case FilterMode.Equal:
              pass = d.fields[f.attr] == f.value
              break
          }
        })

        return pass
      }).map(m => m.fields)

      // Explore each serie
      monoGraph.series.forEach(s => {
        // Get graph type
        const type = this.graphService.getCompatibilityFromType(s.graphType)

        // Compute data
        switch (s.graphType) {
          case GraphType.Bar:
            s.data = this.datasetService.computeSerieBar(this.data, s.groupByAttribute!, s.valueAttribute, s.operation)
            break
          case GraphType.Pie:
            s.data = this.datasetService.computeSeriePie(this.data, s.valueAttribute, s.operation)
            break
          default:
            console.error(`Graph type '${s.graphType}' not implemented`)
        }

        // Sort
        sortByProperty(s.data, 'value', true)

        const layer = this.layers.find(f => f.type === type)
        // TODO check labels to differ graph
        if (!layer) {
          this.layers.push({
            type,
            labels: s.data.map(m => m.label),
            datasets: [{
              label: s.label,
              data: s.data.map(m => m.value),
              backgroundColor: s.backgroundColor
            }]
          })
        } else {
          // Merge with existing
          layer.datasets.push({
            label: s.label,
            data: s.data.map(m => m.value),
            backgroundColor: s.backgroundColor
          })
        }
      })
    }
  }

  selectedColsChange(): void {
    this.activeCols = this.cols.filter(f => this.selectedCols.includes(f.field))
  }

  // https://stackoverflow.com/a/64371813/6427809
  onColDragStart(index: number, li: HTMLElement): void {
    this.dragDropColStartIndex = index;
    this.dragDropColStartElem = li
    li.style.opacity = '.25'
  }

  onColDrop(index: number, li: HTMLElement): void {
    this.dragDropColStartElem.style.opacity = '1'
    const col = this.cols[this.dragDropColStartIndex]; // get element
    this.cols.splice(this.dragDropColStartIndex, 1);   // delete from old position
    this.cols.splice(index, 0, col);                   // add to new position
    this.selectedColsChange()
    this.onColDragLeave(index, li)
  }

  onColDragOver(index: number, li: HTMLElement): void {
    li.classList.add('hover')
  }

  onColDragLeave(index: number, li: HTMLElement): void {
    li.classList.remove('hover')
  }

  // Filters
  addFilter(event: any, ddField: Dropdown): void {
    this.filters.push({ label: this.translatorService.t(ddField.value), attr: ddField.value, value: '', mode: FilterMode.Contains })
  }

  removeFilter(event: any, filter: any, index: number): void {
    // Remove
    this.filters.splice(index, 1)
    // Do it again
    this.computeData()
  }

  filterOptionChange(event: any, filter: any, attr: string): void {
    // Update the attribute value
    filter[attr] = event.value
    // Do it again
    this.computeData()
  }
}
