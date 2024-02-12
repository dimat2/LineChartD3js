import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from "d3-tip"

@Component({
  selector: 'app-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.css']
})
export class EngagementComponent implements OnInit {
  ngOnInit(): void {
    this.grafikon();
  }

  private async grafikon(): Promise<void> {   
                 
    const margin = { top: 40, right: 80, bottom: 60, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;
                
    const parseDate = d3.timeParse("%m/%d/%Y"),
    formatDate = d3.timeFormat("%b %d"),
    formatMonth = d3.timeFormat("%b");
            
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
            
    const area = d3
        .area()
        .x((d:any) => { return x(d.date); })
        .y0(height)
        .y1((d:any) => { return y(d.price); })
        .curve(d3.curveCardinal);

    const valueline = d3
        .line()
        .x((d:any) => { return x(d.date); })
        .y((d:any) => { return y(d.price); })
        .curve(d3.curveCardinal);
                
    const svg = d3
        .select("figure#root")
        .append("svg")
        .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(formatMonth)); // format January as Jan etc.

    svg.append("g").attr("class", "y axis").call(d3.axisLeft(y));

    svg
        .append("a")
        .attr("xlink:href", (d) => {
            return "https://www.moex.com/ru/index/rtsusdcur.aspx?tid=2552";
        })
        .attr("class", "subtitle")
        .attr("target", "_blank")
        .append("text")
        .attr("x", 0)
        .attr("y", height + 50)
        .text("Source: Moscow Exchange");


    d3.csv("assets/02_engagement.csv").then((data:any) => {
        data = data.reverse(); 
        data.forEach((d) => {
            d.date = parseDate(d.date);
            d.price = Number(d.price);
        });

        x.domain(
            <any>d3.extent(data, (d:any) => { return d.date; })
        );
        y.domain(<any>[
            55,
            d3.max(data, (d:any) => { return d.price; }),
        ]);

        svg
            .select(".x.axis") 
            .transition()
            .duration(750)
            .call(<any>d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));
        svg
            .select(".y.axis") 
            .transition()
            .duration(750)
            .call(<any>d3.axisLeft(y));

        const areaPath = svg
            .append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", area)
            .attr("transform", "translate(0,300)")
            .transition()
            .duration(1000)
            .attr("transform", "translate(0,0)");

        const linePath = svg
            .append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
        const pathLength = linePath.node().getTotalLength();
        linePath
            .attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-width", 3)
            .transition()
            .duration(1000)
            .attr("stroke-width", 0)
            .attr("stroke-dashoffset", 0);

        svg
            .append("text")
            .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "middle")
            .text("USD to RUB Exchange Rates");

        const focus = svg
            .append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus
            .append("line")
            .attr("class", "x")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.5)
            .attr("y1", 0)
            .attr("y2", height);

        focus
            .append("line")
            .attr("class", "y")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.5)
            .attr("x1", width)
            .attr("x2", width);

        focus
            .append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .attr("r", 4);

        focus.append("text").attr("class", "y1").attr("dx", 8).attr("dy", "-.3em");
        focus.append("text").attr("class", "y2").attr("dx", 8).attr("dy", "-.3em");

        focus.append("text").attr("class", "y3").attr("dx", 8).attr("dy", "1em");
        focus.append("text").attr("class", "y4").attr("dx", 8).attr("dy", "1em");

        function mouseMove(event) {
            const bisect = d3.bisector((d:any) => d.date).left,
            x0:any = x.invert(d3.pointer(event, this)[0]),
            i:any = bisect(data, x0, 1),
            d0:any = data[i - 1],
            d1:any = data[i],
            d:any = x0 - d0.date > d1.date - x0 ? d1 : d0;

            focus
                .select("circle.y")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");

            focus
                .select("text.y1")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .text(d.price);

            focus
                .select("text.y2")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .text(d.price);

            focus
                .select("text.y3")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .text(formatDate(d.date));

            focus
                .select("text.y4")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .text(formatDate(d.date));

            focus
                .select(".x")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .attr("y2", height - y(d.price));

            focus
                .select(".y")
                .attr("transform", "translate(" + width * -1 + "," + y(d.price) + ")")
                .attr("x2", width + width);
        }

        svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => {
                focus.style("display", null);
            })
            .on("mouseout", () => {
                focus.style("display", "none");
            })
            .on("touchmove mousemove", mouseMove);
    });
  }
}
