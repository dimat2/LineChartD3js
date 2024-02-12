import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-szovegek',
  templateUrl: './szovegek.component.html',
  styleUrls: ['./szovegek.component.css']
})
export class SzovegekComponent implements OnInit {
  ngOnInit(): void {
    this.grafikon();
  }

  private async grafikon(): Promise<void> {
    var container = d3.select('figure#szovegek');

    var margin = {top: 10, right: 0, bottom: 100, left: 40};
    var width = 750 - margin.left - margin.right;
    var height = 480 - margin.top - margin.bottom;
    
    var chart = container.append('svg')
      .attr('width', 750)
      .attr('height', 480)
        .append('g')
            .classed('chart', true)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    
    chart.append('g')
        .classed('x axis', true)
        .attr('transform', 'translate(' + '0' + ',' + height + ')');
    
    chart.append('g')
        .classed('y axis', true)
        .attr('transform', 'translate(0,0)');
    
    var dataSeries = chart.append('g')
        .classed('data-series', true);
    
    
    // axes
    var x = d3.scaleBand()
        .range([0, width])
        .padding(.02);
    var xAxis = d3.axisBottom(x);
    
    var y = d3.scaleLinear()
        .range([height, 0])
    var yAxis = d3.axisLeft(y);
    
    container.select('svg')
        .append("rect")
            .classed("drag-and-zoom-area", true)
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style("fill", "none")
            .style("cursor", "move")
            .style("pointer-events", "all");
          
          
  container.select('.drag-and-zoom-area')
            .call(d3.drag()
                .on("start", handleDragStarted)
                .on("drag", handleDragging)
            );

// zoom on wheel motion 
container.select('.drag-and-zoom-area')
    .on("wheel", handleWheel);

    // get data here
    /*var n = 400;
    var maxY = 2000;
    var data = d3.range(n)
        .map(function() {
            return {
                key: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
                value: Math.floor(d3.randomUniform(1,maxY)())
            };
        });*/
    const data = await d3.tsv("assets/szovegek_orig.txt", d3.autoType);

    var viewport = {
        center: data.length / 2,
        size: data.length
    };
    
    drawChart({
        viewport: viewport
    });
    
    
    function drawChart(params) {
    
        var begin = Math.max(0, params.viewport.center - params.viewport.size / 2);
        var end = Math.min(data.length, begin + params.viewport.size);
        var slice = data.slice(begin, end);
    
        x.domain(slice.map(function(d:any) {
            return d.Nev;
        }));
        chart.select('.x.axis')
            .call(<any>xAxis)
                .selectAll("text")
                    .classed("x-axis-label", true)
                    .style("text-anchor", "end")
                    .attr("dx", -8)
                    .attr("dy", "-.5em")
                    .attr("transform", "translate(0,0) rotate(-90)");
    
        y.domain([0, d3.max(slice, function(d:any) {
            return d.Ertek;
        })]);
        chart.select('.y.axis').call(<any>yAxis);
    
    
        // draw data series
        dataSeries.selectAll('.bar')
            .data(slice)
            .enter()
                .append('rect')
                .classed('bar', true);
    
        dataSeries.selectAll('.bar')
            .attr('x', function(d:any) {
                return x(d.Nev);
            })
            .attr('y', function(d:any) {
                return y(d.Ertek);
            })
            .attr('width', function(d:any) {
                return x.bandwidth();
            })
            .attr('height', function(d:any) {
                return height - y(d.Ertek);
            })
            .style('fill', 'steelblue');
    
        dataSeries.selectAll('.bar')
            .data(slice)
            .exit()
            .remove();
    }

        // handle wheel inputs for zoom
    function handleWheel(event) {
      
      var zoomFactor = 1.25;

      if (event.deltaY > 0) {
          viewport.size = Math.min(
              data.length,
              viewport.size * zoomFactor
          );
      } else if (event.deltaY < 0) {
          viewport.size = Math.round(
              Math.max(
                  1,
                  viewport.size / zoomFactor
              ));
      }

      drawChart({
          viewport: viewport
      });

      event.preventDefault();
    }

    var lastDragX;
    function handleDragStarted(event) { lastDragX = event.x; }
    
    function handleDragging(event) {
        var deltaPos = lastDragX - event.x;
        lastDragX = event.x;
    
        if (deltaPos > 0) {
            viewport.center = Math.min(
                data.length - viewport.size / 2,
                viewport.center + Math.ceil(0.05 * viewport.size)
            );
        } else if (deltaPos < 0) {
            viewport.center = Math.max(
                viewport.size / 2,
                viewport.center - Math.ceil(0.05 * viewport.size)
            );
        }
    
        drawChart({
            viewport: viewport
        });
    
    }
  }
}
