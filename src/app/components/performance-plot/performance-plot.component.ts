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
  inputData: VisualizableInGraph;

  plotData: any[];
  plotLayout = {
    width: 800,
    height: 600,
    title: this.title,
    xaxis: {
      title: 'Placeholder x axis title',
    },
    yaxis: {
      title: 'Sharpe Ratio',
      tickformat: ',.2%'
    },
  };

  constructor() { }

  ngOnChanges(): void {
    this.plotData = [];
    if (this.inputData) {
      this.plotLayout.xaxis.title = this.inputData.name + ' performance';

      let performance = [];
      let dates = [];
      this.inputData.performanceSeries.forEach(element => {
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
        mode: 'lines'
      };
      this.plotData.push(linePlotObject);
    }
  }

}
