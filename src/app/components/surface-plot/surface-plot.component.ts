import { Component, Input, OnChanges } from '@angular/core';
import { PortfolioCalculation } from 'src/app/models/portfolio-calculation';
import { PlotAbstract } from 'src/app/abstract-components/plot-abstract';

@Component({
  selector: 'app-surface-plot',
  templateUrl: './surface-plot.component.html',
  styleUrls: ['./surface-plot.component.css']
})
export class SurfacePlotComponent extends PlotAbstract implements OnChanges {

  title = 'Sharpe Ratio by weight ratios (surface plot)';

  @Input()
  inputData: PortfolioCalculation;
  @Input()
  axisPoints: number[];
  @Input()
  surfacePlotData: number[][];

  plotData: any[];
  plotLayout = {
    title: this.title,
    xaxis: {
      title: 'Placeholder x axis title',
      type: 'category'
    },
    yaxis: {
      title: 'Placeholder y axis title',
      type: 'category'
    },
  };

  constructor() {
    super();
  }

  ngOnChanges(): void {
    console.log('Changes detected in surface plot input');
    this.plotData = [];
    if (this.inputData && this.axisPoints && this.surfacePlotData) {
      this.plotData = [];
      const plotDataObject = {
        z: this.surfacePlotData,
        type: 'contour',
        contours: {
          // start: this.calculationMaxSharpe.sharpeRatio - 1,
          // end: this.calculationMaxSharpe.sharpeRatio,
          // size: 0.01,
          coloring: 'heatmap',
          showlabels: true
        },
        x: this.axisPoints,
        y: this.axisPoints
      };
      this.plotLayout.xaxis.title = this.inputData.holdingsData[1].ticker + ' weights';
      this.plotLayout.yaxis.title = this.inputData.holdingsData[0].ticker + ' weights';
      this.plotData.push(plotDataObject);
    }
  }
}
