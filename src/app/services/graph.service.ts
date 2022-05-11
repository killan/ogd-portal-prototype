import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GraphType } from '../enums/graph';

export type CompatibilityTypes = { [key: string]: string[] }

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  compatibilityTypes: CompatibilityTypes = {}

  constructor(
    private http: HttpClient
  ) { }

  getCompatibilityTypesData(): Observable<any> {
    return this.http.get<any>('assets/graph-types.json')
  }

  setCompatibilityTypes(ct: CompatibilityTypes): void {
    this.compatibilityTypes = ct
  }
  getCompatibilityTypes(): CompatibilityTypes {
    return this.compatibilityTypes
  }

  getCompatibilityFromType(type: GraphType): string {
    let res: string = ''
    Object.keys(this.compatibilityTypes).forEach(k => {
      if (this.compatibilityTypes[k].includes(type)) {
        res = k
      }
    })

    if (res != '') { // WTF hack
      return res
    } else {
      throw new Error('Unknow graph type : ' + type)
    }
  }
}
