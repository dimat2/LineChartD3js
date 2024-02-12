import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { PieComponent } from './pie/pie.component';
import { ScatterComponent } from './scatter/scatter.component';
import { Bar2Component } from './bar2/bar2.component';
import { PieCustomDataComponent } from './pie-custom-data/pie-custom-data.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { FormsModule } from '@angular/forms';
import { FelhasznalokComponent } from './felhasznalok/felhasznalok.component';
import { SzovegekComponent } from './szovegek/szovegek.component';
import { UsersComponent } from './users/users.component';
import { EngagementComponent } from './engagement/engagement.component';
import { DcgComponent } from './dcg/dcg.component';
import { TrendComponent } from './trend/trend.component';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    PieComponent,
    ScatterComponent,
    Bar2Component,
    PieCustomDataComponent,
    PieChartComponent,
    FelhasznalokComponent,
    SzovegekComponent,
    UsersComponent,
    EngagementComponent,
    DcgComponent,
    TrendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
