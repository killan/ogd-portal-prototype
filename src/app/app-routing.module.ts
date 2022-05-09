import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { ToolsComponent } from './components/tools/tools.component';
import { InfosComponent } from './components/infos/infos.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { DatasetComponent } from './components/dataset/dataset.component';

import { DatasetResolver } from './resolvers/dataset.resolver';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tools', component: ToolsComponent },
  { path: 'infos', component: InfosComponent },
  { path: 'datasets', component: DatasetsComponent },
  {
    path: 'datasets/:id',
    component: DatasetComponent,
    resolve: {
      dataset: DatasetResolver
    }
  },
  { // Default
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
