import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GraphType } from 'src/app/enums/graph';

import { Data } from 'src/app/interfaces/dataset';
import { DataStruct, GraphStruct, SerieStruct } from 'src/app/interfaces/graph';

import { DatasetService } from 'src/app/services/dataset.service';
import { GraphService } from 'src/app/services/graph.service';
import { LoaderService } from 'src/app/services/loader.service';
import { sortByProperty } from 'src/app/services/sort';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  gs: GraphStruct[] = []

  colors = ['#e76f51', '#2a9d8f', '#457b9d', '#ffafcc', '#cdb4db', '#fca311', '#3a86ff']

  layers: any[] = []

  compatibilityTypes: { [key: string]: string[] }

  // datasets[series[]|filtering]

  computedOptions: any = {
    bar: {
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
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private datasetService: DatasetService,
    private graphService: GraphService,
    private loaderService: LoaderService
  ) {
    this.compatibilityTypes = this.loaderService.data.graphCompatibilityTypes
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      const ngs: GraphStruct = {
        dataset: data.dataset,
        serie: []
      }

      this.datasetService.getdata(ngs.dataset!.id).subscribe((d) => {
        ngs.dataset!.data = d

        // Add first default serie
        // TODO improve getfirst [0]
        const fieldsString = this.datasetService.getDataFieldsString(ngs.dataset.data[0])
        const fieldsNumber = this.datasetService.getDataFieldsNumber(ngs.dataset.data[0])
        console.log(fieldsString, fieldsNumber)
        ngs.serie.push({
          label: 'Série #1', // TODO #?
          graphType: GraphType.Bar,
          groupByAttribute: fieldsString[0],
          valueAttribute: fieldsNumber[0],
          backgroundColor: this.colors[0],
          data: this.computeSerieBar(ngs.dataset.data, fieldsString[0], fieldsNumber[0]) // TODO Check and secure
        }, {
          label: 'Série #2',
          graphType: GraphType.Pie,
          valueAttribute: fieldsNumber[fieldsNumber.length - 1],
          backgroundColor: this.colors,
          data: this.computeSeriePie(ngs.dataset.data, fieldsNumber[fieldsNumber.length - 1]) // TODO
        })
        this.gs.push(ngs)

        // First rendering
        this.computeData()
      })
    })
  }

  tabChange(tabName: string): void {
    console.log('tabChange: ' + tabName)
  }

  computeSerieBar(data: Data[], groupByAttribute: string, valueAttribute: string, operation = 'sum'): DataStruct[] {
    const result: DataStruct[] = []
    data.forEach(d => {
      const key: string = d.fields[groupByAttribute]
      const itemIdx = result.findIndex(f => f.label == key)
      if (itemIdx === -1) {
        result.push({ label: d.fields[groupByAttribute], value: d.fields[valueAttribute] })
      } else {
        // TODO depend on operation
        result[itemIdx].value += d.fields[valueAttribute]
      }
    })
    return result
  }

  computeSeriePie(data: Data[], valueAttribute: string, operation = 'count'): DataStruct[] {
    const result: DataStruct[] = []
    data.forEach(d => {
      const key: string = d.fields[valueAttribute]
      const itemIdx = result.findIndex(f => f.label == key)
      if (itemIdx === -1) {
        result.push({ label: key, value: 1 })
      } else {
        // TODO depend on operation
        result[itemIdx].value++
      }
    })
    return result
  }

  computeData(): void {
    this.layers = []

    if (this.gs && this.gs.length) {
      const monoGraph = this.gs[0];

      // Explore each serie
      monoGraph.serie.forEach(s => {
        // Get graph type
        let type: string = ''
        Object.keys(this.compatibilityTypes).forEach(k => {
          if (this.compatibilityTypes[k].includes(s.graphType)) {
            type = k
          }
        })

        // Sort
        sortByProperty(s.data, 'value', true)

        const layer = this.layers.find(f => f === type)
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
}
