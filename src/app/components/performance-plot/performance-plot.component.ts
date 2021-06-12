import { PerformanceUtils } from './../../utils/performanceUtils';
import { VisualizableInGraph } from './../../models/visualizable-in-graph';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-performance-plot',
  templateUrl: './performance-plot.component.html',
  styleUrls: ['./performance-plot.component.css']
})
export class PerformancePlotComponent implements OnChanges {

  title = 'Performance';

  @Input()
  inputData: VisualizableInGraph[];

  plotData: any[];
  plotLayout = {
    width: 800,
    height: 600,
    title: this.title,
    xaxis: {
      title: 'Time',
    },
    yaxis: {
      title: 'Performance',
      tickformat: ',.0%'
    },
  };

  constructor() { }

  ngOnChanges(): void {
    console.log('Changes detected in performance plot component');

    this.plotData = [];
    if (this.inputData) {
      this.inputData.forEach(calculation => {
        let performance = [];
        let dates = [];
        calculation.performanceSeries.forEach(element => {
          performance.push(element.performance);
          dates.push(element.date);
        });
        dates = dates.reverse();
        performance = performance.reverse();
        const accPerformance = PerformanceUtils.getAccumulatedPerformance(performance);

        const xArray = [];
        const yArray = [];
        for (let index = 0; index < dates.length; index++) {
          xArray.push(dates[index]); // x
          yArray.push(accPerformance[index]); // y
        }
        const linePlotObject = {
          x: xArray,
          y: yArray,
          mode: 'lines',
          name: calculation.name
        };
        this.plotData.push(linePlotObject);
      });
    }
  }

}
