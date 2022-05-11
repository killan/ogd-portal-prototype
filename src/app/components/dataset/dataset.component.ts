import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GraphType } from 'src/app/enums/graph';
import { Operation } from 'src/app/enums/operation';

import { GraphStruct } from 'src/app/interfaces/graph';

import { DatasetService } from 'src/app/services/dataset.service';
import { GraphService } from 'src/app/services/graph.service';
import { sortByProperty } from 'src/app/services/sort';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  gs: GraphStruct[] = []

  colors = ['#e76f51', '#2a9d8f', '#457b9d', '#ffafcc', '#cdb4db', '#fca311', '#3a86ff']

  layers: any[] = []

  operations: any[] = []
  graphTypes: any[] = []

  serieCounter: number = 1
  curTab: string = 'data'

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
    private translatorService: TranslatorService
  ) {
    this.operations = [
      { id: 'sum', label: this.translatorService.t('sum') },
      { id: 'cnt', label: this.translatorService.t('cnt') }
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
        }/*, {
          label: 'Série #' + this.serieCounter++,
          graphType: GraphType.Pie,
          graphCompatibility: this.graphService.getCompatibilityFromType(GraphType.Pie),
          valueAttribute: fieldsNumber[fieldsNumber.length - 1],
          operation: Operation.Count,
          backgroundColor: this.colors,
          data: []
        }*/)
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
    if (attr == 'graphType' && !serie.groupByAttribute) {
      serie.groupByAttribute = gs.fields![0].id
    }
    // TODO on change graph type : change color mode if possible
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

      // Explore each serie
      monoGraph.series.forEach(s => {
        // Get graph type
        const type = this.graphService.getCompatibilityFromType(s.graphType)

        // Compute data
        switch (s.graphType) {
          case GraphType.Bar:
            s.data = this.datasetService.computeSerieBar(monoGraph.dataset.data!, s.groupByAttribute!, s.valueAttribute, s.operation)
            break
          case GraphType.Pie:
            s.data = this.datasetService.computeSeriePie(monoGraph.dataset.data!, s.valueAttribute, s.operation)
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
}
