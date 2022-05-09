import { Component, OnInit } from '@angular/core';
import { Dataset } from 'src/app/interfaces/dataset';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {
  datasets: Dataset[] = []

  constructor(
    private datasetService: DatasetService
  ) { }

  ngOnInit(): void {
    this.datasetService.getDatasets().subscribe((datasets) => {
      this.datasets = datasets
    })
  }
}
