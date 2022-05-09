import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GraphType } from 'src/app/enums/graph';

import { Data } from 'src/app/interfaces/dataset';
import { DataStruct, GraphStruct } from 'src/app/interfaces/graph';

import { DatasetService } from 'src/app/services/dataset.service';
import { sortByProperty } from 'src/app/services/sort';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  gs: GraphStruct[] = []

  colors = ['#e76f51', '#2a9d8f', '#457b9d', '#ffafcc', '#cdb4db', '#fca311', '#3a86ff']

  computedData: any = {
    labels: [],
    datasets: []
  }

  // datasets[series[]|filtering]

  computedOptions: any = {
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
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private datasetService: DatasetService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      const ngs: GraphStruct = {
        dataset: data.dataset,
        serie: []
      }

      this.datasetService.getdata(ngs.dataset!.id).subscribe((d) => {
        ngs.dataset!.data = d

        // Add first serie
        // TODO improve getfirst [0]
        const fields = this.datasetService.getDataFieldList(ngs.dataset.data[0])
        const fieldsString = this.datasetService.getDataFieldsString(ngs.dataset.data[0])
        const fieldsNumber = this.datasetService.getDataFieldsNumber(ngs.dataset.data[0])
        ngs.serie.push({
          label: 'Série #1', // TODO #?
          graphType: GraphType.Bar,
          groupByAttribute: fieldsString[0],
          valueAttribute: fieldsNumber[0],
          backgroundColor: this.colors[0],
          data: this.computeSerie(ngs.dataset.data, fieldsString[0], fieldsNumber[0]) // TODO Check and secure
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

  computeSerie(data: Data[], groupByAttribute: string, valueAttribute: string, operation = 'sum'): DataStruct[] {
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

  computeData(): void {
    console.log(this.gs)

    const monoGraph = this.gs[0]; // TODO Check
    const serie0 = monoGraph.serie[0] // TODO

    // Sort
    sortByProperty(serie0.data, 'value', true)

    // ...
    this.computedData = {
      labels: serie0.data.map(m => m.label),
      datasets: monoGraph.serie.map(m => ({
        label: m.label,
        data: serie0.data.map(m => m.value),
        backgroundColor: m.backgroundColor
      }))
    }
  }
}
