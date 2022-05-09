import { Injectable } from "@angular/core";
import { forkJoin } from "rxjs";
import { GraphService } from "./graph.service";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  data: any = {}

  constructor(
    private graphService: GraphService
  ) { }

  load(): Promise<any> {
    return forkJoin({
      graphCompatibilityTypes: this.graphService.getCompatibilityTypes()
    })
    .toPromise()
    .then(data => {
      this.data.graphCompatibilityTypes = data.graphCompatibilityTypes
    })
  }
}
