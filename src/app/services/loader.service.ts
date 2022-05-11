import { Injectable } from "@angular/core";
import { forkJoin } from "rxjs";
import { GraphService } from "./graph.service";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  constructor(
    private graphService: GraphService
  ) { }

  load(): Promise<any> {
    return forkJoin({
      graphCompatibilityTypes: this.graphService.getCompatibilityTypesData()
    })
    .toPromise()
    .then(data => {
      this.graphService.setCompatibilityTypes(data.graphCompatibilityTypes)
    })
  }
}
