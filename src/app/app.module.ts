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

import { LoaderService } from './services/loader.service';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    ToolsComponent,
    InfosComponent,
    DatasetsComponent,
    DatasetComponent
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
    ButtonModule
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
