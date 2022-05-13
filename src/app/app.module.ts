import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { ToolsComponent } from './components/tools/tools.component';
import { InfosComponent } from './components/infos/infos.component';
import { DatasetComponent } from './components/dataset/dataset.component';
import { DatasetsComponent } from './components/datasets/datasets.component';

import { TabViewModule } from 'primeng-lts/tabview';
import { ChartModule } from 'primeng-lts/chart';
import { DropdownModule } from 'primeng-lts/dropdown';
import { ButtonModule } from 'primeng-lts/button';
import { TableModule } from 'primeng-lts/table';
import { ListboxModule } from 'primeng-lts/listbox';
import { CheckboxModule } from 'primeng-lts/checkbox';
import { DragDropModule } from 'primeng-lts/dragdrop';

import { LoaderService } from './services/loader.service';

import { ListComponent } from './shared/components/cell-components/list/list.component';
import { SimpleTableComponent } from './shared/components/simple-table/simple-table.component';
import { CellComponentsHostDirective } from './shared/directives/cell-components-host';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    ToolsComponent,
    InfosComponent,
    DatasetsComponent,
    DatasetComponent,

    SimpleTableComponent,
    ListComponent,

    CellComponentsHostDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    TabViewModule,
    ChartModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    ListboxModule,
    CheckboxModule,
    DragDropModule
  ],
  providers: [
    LoaderService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ls: LoaderService) => () => ls.load(),
      deps: [LoaderService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
