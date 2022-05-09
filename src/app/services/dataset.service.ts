import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Data, Dataset } from '../interfaces/dataset';

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
}
