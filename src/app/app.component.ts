import { Component } from '@angular/core';
import { ChartData } from './chartData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'd3-dynamic_data';

  chartData_2D_1: ChartData = {
    yrange: 200000,
    lineData: [
      { label: 'Vue', value: 166443 },
      { label: 'React', value: 150793 },
      { label: 'Angular', value: 62342 },
      { label: 'Backbone', value: 27647 },
      { label: 'Ember', value: 21471 },
    ],
  };

  letolt() {
    let link = document.createElement("a");
    link.download = "Kiss Péter_BI.pdf";
    link.href = "assets/Kiss Péter_BI.pdf";
    link.click();
  }

  letolt_excel() {
    let link = document.createElement("a");
    link.download = "Sport_hu_-_GA4.xlsx";
    link.href = "assets/sport.hu - GA4.xlsx";
    link.click();
  }
}
