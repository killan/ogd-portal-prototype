import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoFieldType } from '../enums/map';
import { Operation } from '../enums/operation';

import { Data, Dataset } from '../interfaces/dataset';
import { DataStruct } from '../interfaces/graph';
import { GeoField } from '../interfaces/map';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(
    private http: HttpClient
  ) { }

  getDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>('assets/datasets.json')
  }

  getDataset(id: string): Observable<Dataset> {
    return this.http.get<Dataset>('assets/datasets/' + id + '.json')
  }

  getdata(id: string): Observable<Data[]> {
    return this.http.get<Data[]>('assets/data/' + id + '.json')
  }

  getDataFieldList(data: Data): string[] {
    const keys: string[] = []
    Object.keys(data.fields).forEach(k => {
      keys.push(k)
    })
    return keys
  }

  getDataFieldsString(data: Data): string[] {
    const fields: string[] = []
    Object.keys(data.fields).forEach(k => {
      if (typeof data.fields[k] == 'string') {
        fields.push(k)
      }
    })
    return fields
  }

  getDataFieldsNumber(data: Data): string[] {
    const fields: string[] = []
    Object.keys(data.fields).forEach(k => {
      if (typeof data.fields[k] == 'number') {
        fields.push(k)
      }
    })
    return fields
  }

  getDataFieldsGeo(data: Data): GeoField[] {
    const fields: GeoField[] = []
    Object.keys(data.fields).forEach(k => {
      let type: GeoFieldType
      if (Array.isArray(data.fields[k]) && data.fields[k].length == 2 && typeof data.fields[k][0] == 'number') {
        fields.push({ key: k, type: GeoFieldType.Point })
      } else if (data.fields[k].coordinates) {
        // TODO need additional type check ?
        fields.push({ key: k, type: GeoFieldType.Polygon })
      }
    })
    return fields
  }

  computeSerieBar(data: any[], groupByAttribute: string, valueAttribute: string, operation = Operation.Sum): DataStruct[] {
    return this.computeSerie(data, valueAttribute, operation, groupByAttribute)
  }

  computeSeriePie(data: any[], valueAttribute: string, operation = Operation.Count): DataStruct[] {
    return this.computeSerie(data, valueAttribute, operation)
  }

  computeSerie(data: any[], valueAttribute: string, operation = Operation.Count, groupByAttribute?: string): DataStruct[] {
    const result: DataStruct[] = []
    data.forEach(d => {
      const key: string = d[groupByAttribute ? groupByAttribute : valueAttribute]
      const itemIdx = result.findIndex(f => f.label == key)
      if (itemIdx === -1) {
        result.push({
          label: groupByAttribute ? d[groupByAttribute] : key,
          value: this.startOperation(d[valueAttribute], operation)
        })
      } else {
        result[itemIdx].value = this.applyOperation(result[itemIdx].value, d[valueAttribute], operation)
      }
    })
    return result
  }

  startOperation(o: number, op: Operation): number {
    switch (op) {
      case Operation.Average:
        return o
      case Operation.Count:
        return 1
      case Operation.Sum:
        return o
    }
  }

  applyOperation(o: number, n: number, op: Operation): number {
    switch (op) {
      case Operation.Average:
        return (o + n) / 2 // TODO maybe add a counter next label, value, juste add all data, then for this operation, second pass and devide by the counter
      case Operation.Count:
        return ++o // !
      case Operation.Sum:
        return o + n
    }
  }
}
