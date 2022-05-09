import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Dataset } from '../interfaces/dataset';

import { DatasetService } from '../services/dataset.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetResolver implements Resolve<Dataset> {
  constructor(
    private datasetService: DatasetService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Dataset> {
    const id = route.paramMap.get('id');

    if (!id) {
      console.log(`Dataset id not provided`);
      this.router.navigate(['/datasets']);
      return throwError(null);
    }

    return this.datasetService.getDataset(id)
      .pipe(
        catchError((error) => {
          console.log(`Dataset '${id}' not found`);
          this.router.navigate(['/datasets']);
          return throwError(id);
        })
      )
  }
}
