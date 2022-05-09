import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphType } from '../enums/graph';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(
    private http: HttpClient
  ) { }

  getCompatibilityTypes(): Observable<any> {
    return this.http.get<any>('assets/graph-types.json')
  }

  getGraphType(gt: GraphType): string {
    switch (gt) {
      case GraphType.Bar:
        return 'bar'
      case GraphType.Line:
        return 'line'
      case GraphType.Map:
        return 'map'
      case GraphType.Pie:
        return 'pie'
      default:
        return 'bar'
    }
  }
}
