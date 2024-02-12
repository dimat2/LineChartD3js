import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import d3Tip from "d3-tip"

@Component({
  selector: 'app-dcg',
  templateUrl: './dcg.component.html',
  styleUrls: ['./dcg.component.css']
})
export class DcgComponent implements OnInit {
  ngOnInit(): void {
    this.grafikon();
  }

  private async grafikon() : Promise<void> {
    
    const data = await d3.csv("assets/03_dcg.csv", d3.autoType);

    const width = 928;
    const height = width;
    const innerRadius = 180;
    const outerRadius = Math.min(width, height) / 2;

    const arc = d3.arc()
      .innerRadius(d => y(d[0]))
      .outerRadius(d => y(d[1]))
      .startAngle( (d: any) => x(d.data.Dcg))
      .endAngle( (d: any) => x(d.data.Dcg) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius);
    
    const x = d3.scaleBand()
      .domain(data.map((d:any) => d.Dcg))
      .range([0, 2 * Math.PI])
      .align(0);
    
    const y0 = d3.scaleLinear()
      .domain([0, 550_000])
      .range([innerRadius * innerRadius, outerRadius * outerRadius]);
    
    const y = Object.assign(d => Math.sqrt(y0(d)), y0);
  
    const z = d3.scaleOrdinal()
		.domain(data.columns.slice(1))
		.range(["#FFD700", "#808000"]);
    
        
    const svg = d3.select("figure#dcg").append('svg')
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .style("width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");
    
    const stack = d3.stack().keys(data.columns.slice(1));
    const series = stack(<any>data);

    const t = ["New users","Sessions"];

    const tip = d3Tip().attr('class', 'd3-tip').html(function(d, t, s) {return "<div class=\"tooltip\">" + (t[1] - t[0]).toLocaleString("hu-HU") + "</div>"; });

    svg.call(tip);

    svg.append("g")
      .selectAll("g")
      .data(series)
      .enter().append("g")
        .attr("fill", <any>(d => z(d.key)))
      .selectAll("path")
      .data(d => d)
      .enter().append("path")
        .attr("d", <any>arc)
        .on('mouseover', function (d, i) {
          d3.select(this).transition()
               .duration(50)
               .attr('opacity', '0.5');          //Makes the new div appear on hover:
          })
        .on('mouseout', function (d, i) {
              d3.select(this).transition()
                  .duration(50)
                  .attr('opacity', '1');          //Makes the new div disappear:
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide); 

    // xAxis
    svg.append("g")
      .attr("text-anchor", "middle")
      .call(g => g.selectAll("g")
        .data(data)
        .enter().append("g")
          .attr("transform", (d:any) => `
            rotate(${((x(d.Dcg) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
            translate(${innerRadius},0)
          `)
          .call(g => g.append("line")
              .attr("x2", -5)
              .attr("stroke", "#000"))
          .call(g => g.append("text")
              .attr("transform", (d:any) => (x(d.Dcg) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                  ? "rotate(0)translate(-18,5)"
                  : "rotate(-180)translate(18,5)")
              .text((d:any) => d.Dcg)));

    //yAxis 
    svg.append("g")
        .attr("text-anchor", "middle")
    .call(g => g.append("text")
        .attr("y", d => -y(y.ticks(5).pop()))
        .attr("dy", "-1em")
        .text("From"))
    .call(g => g.selectAll("g")
      .data(y.ticks(5).slice(1))
      .enter().append("g")
        .attr("fill", "none")
        .call(g => g.append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("r", y))
        .call(g => g.append("text")
            .attr("y", d => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(2, "s"))
         .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")))
    
    //legend
    svg.append("g")
    .selectAll("g")
    .data(data.columns.slice(1).reverse())
    .enter().append("g")
      .attr("transform", (d, i) => `translate(-40,${(i - (data.columns.length - 1)/2 ) * 20})`)
      .call(g => g.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", <any>z)
          )
      .call(g => g.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text((d:any) => d));
  }
}
