import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PieDataService } from '../pie-data.service';
import { IData } from '../pie-data-interface';
import * as D3 from "d3";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild("containerPieChart") element: ElementRef;

  private host: any;

  private svg: any;

  private width: number;

  private height: number;

  private radius: number;

  private htmlElement: HTMLElement;

  private pieData: IData[];

  constructor(private dataService: PieDataService) {}
  
  ngAfterViewInit(): void {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);

    this.dataService.$data.subscribe(data => {
      this.pieData = data;
      console.log("******draw******", this.pieData);
      this.setup();
      this.buildSVG();
      this.buildPie();
    });
  }

  setup() : void {
    this.width = 250;
    this.height = 250;

    this.radius = Math.min(this.width, this.height) / 2;
  }

  buildSVG() : void {
    this.host.html("");

    this.svg = this.host.append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .append("g")
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
  }

  buildPie() : void {
    let pie = D3.pie();
    let values = this.pieData.map(data => data.value);

    let arcSelection = this.svg.selectAll(".arc").data(pie(values))
      .enter().append("g").attr("class", ".arc");

    this.populatePie(arcSelection);
  }

  populatePie(arcSelection: any) : void {
    let outerRadius = this.radius - 10;

    let pieColor = D3.scaleOrdinal(D3.schemeCategory10);

    let arc = D3.arc().innerRadius(0).outerRadius(outerRadius);

    arcSelection.append("path").attr("d", arc).attr("fill", (datum: any, index: any) => {
      return pieColor(this.pieData[index].label);
    });

    arcSelection.append("text")
      .attr("transform", (datum: any) => {
        datum.innerRadius = 0;
        datum.outerRadius = outerRadius;
        return "translate(" + arc.centroid(datum) + ")";
      })
      .text((datum: any, index: any) =>
        this.pieData[index].label).style("text-anchor", "middle");
  }
}
