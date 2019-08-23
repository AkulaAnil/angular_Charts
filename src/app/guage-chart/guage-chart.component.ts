import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-guage-chart',
  templateUrl: './guage-chart.component.html',
  styleUrls: ['./guage-chart.component.css']
})
export class GuageChartComponent implements OnInit {

  // First Example Guage-Chart
  canvasWidth = 300
  needleValue = 20
  options = {
    hasNeedle: true,
    needleColor: "black",
    needleStartValue: 50,
    arcColors: ["rgb(255,84,84)","rgb(239,214,19)","rgb(61,204,91)"],
    arcDelimiters: [10,60],  //mulitple colors delimiters 10=>rgb(255,84,84),60=>rgb(239,214,19)
    rangeLabel: ["0","100"],
  };
  
  // Second Example Guage-Chart
  chartWidthTwo = 400
  needleValueTwo = 20
  centralLabel = '45'
  optionsTwo = {
   hasNeedle: true,
   outerNeedle: true,
   needleColor: "rgb(166,206,227)",
   rangeLabel: ["-10","10"],
   centralLabelTwo: "5",
   rangeLabelFontSize: 42,
 }

 // Second Example Guage-Chart
 canvasWidthThree = 400
  needleValueThree = 50
  centralLabelThree = '99'
  optionsThree = {
    hasNeedle: true,
    outerNeedle: false,
    needleColor: 'gray',
    needleStartValue: 10,
    needleUpdateSpeed: 1000,
    // arcColors: ['red','green','yellow','blue'],
    arcColors:[],
    arcDelimiters: [10, 60, 90],
    arcPadding: 5,
    arcPaddingColor: 'white',
    arcLabels: ['20', '65', '90'],
  }

// Third Example Guage-Chart

  gaugemap:any = {};
  constructor() { }
  ngOnInit() {
    this.draw();
  }

  draw() {
    var self = this;
    var gauge = function (container, configuration) {

      var config = {
        size: 710,
        clipWidth: 200,
        clipHeight: 110,
        ringInset: 20,
        ringWidth: 20,

        pointerWidth: 10,
        pointerTailLength: 5,
        pointerHeadLengthPercent: 0.9,

        minValue: 0,
        maxValue: 10,

        minAngle: -90,
        maxAngle: 90,

        transitionMs: 750,

        majorTicks: 5,
        labelFormat: d3.format('d'),
        labelInset: 10,

        arcColorFn: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
      };
      var range = undefined;
      var r = undefined;
      var pointerHeadLength = undefined;
      var value = 0;

      var svg = undefined;
      var arc = undefined;
      var scale = undefined;
      var ticks = undefined;
      var tickData = undefined;
      var pointer = undefined;

      var donut = d3.pie();

      function deg2rad(deg) {
        return deg * Math.PI / 180;
      }

      function newAngle(d) {
        var ratio = scale(d);
        var newAngle = config.minAngle + (ratio * range);
        return newAngle;
      }

      function configure(configuration) {
        var prop = undefined;
        for (prop in configuration) {
          config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale this.gaugemap maps domain values to a percent from 0..1
        scale = d3.scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);

        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(function () { return 1 / config.majorTicks; });

        arc = d3.arc()
          .innerRadius(r - config.ringWidth - config.ringInset)
          .outerRadius(r - config.ringInset)
          .startAngle(function (d, i) {
            var ratio = d * i;
            return deg2rad(config.minAngle + (ratio * range));
          })
          .endAngle(function (d, i) {
            var ratio = d * (i + 1);
            return deg2rad(config.minAngle + (ratio * range));
          });
      }
      self.gaugemap.configure = configure;

      function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
      }

      function isRendered() {
        return (svg !== undefined);
      }
      self.gaugemap.isRendered = isRendered;

      function render(newValue) {
        svg = d3.select(container)
          .append('svg:svg')
          .attr('class', 'gauge')
          .attr('width', config.clipWidth)
          .attr('height', config.clipHeight);

        var centerTx = centerTranslation();

        var arcs = svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);

        arcs.selectAll('path')
          .data(tickData)
          .enter().append('path')
          .attr('fill', function (d, i) {
            return config.arcColorFn(d * i);
          })
          .attr('d', arc);

        var lg = svg.append('g')
          .attr('class', 'label')
          .attr('transform', centerTx);
        lg.selectAll('text')
          .data(ticks)
          .enter().append('text')
          .attr('transform', function (d) {
            var ratio = scale(d);
            var newAngle = config.minAngle + (ratio * range);
            return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
          })
          .text(config.labelFormat);

        var lineData = [[config.pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(config.pointerWidth / 2), 0],
        [0, config.pointerTailLength],
        [config.pointerWidth / 2, 0]];
        var pointerLine = d3.line().curve(d3.curveLinear)
        var pg = svg.append('g').data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg.append('path')
          .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
          .attr('transform', 'rotate(' + config.minAngle + ')');

        update(newValue === undefined ? 0 : newValue);
      }
      self.gaugemap.render = render;
      function update(newValue, newConfiguration?) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + (ratio * range);
        pointer.transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', 'rotate(' + newAngle + ')');
      }
      self.gaugemap.update = update;

      configure(configuration);

      return self.gaugemap;
    };

    var powerGauge = gauge('#power-gauge', {
      size: 300,
      clipWidth: 300,
      clipHeight: 300,
      ringWidth: 60,
      maxValue: 10,
      transitionMs: 4000,
    });
    powerGauge.render(6);

  }


  // Fourth Example Guage-Chart
  name = 'Angular 5 with ngx-gauge!';
  currentValue=0
  gaugeType = "arch";
  gaugeValue = 45.5;
  gaugeLabel = "Speed";
  gaugeAppendText = "r/s";

  gaugeChange(event){
    this.gaugeValue=this.currentValue;  
  }
 

}
