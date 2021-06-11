import { Component, Input, OnChanges } from '@angular/core';
import { PortfolioCalculation } from 'src/app/models/portfolio-calculation';

@Component({
  selector: 'app-line-plot',
  templateUrl: './line-plot.component.html',
  styleUrls: ['./line-plot.component.css']
})
export class LinePlotComponent implements OnChanges {

  title = 'Sharpe Ratio by weight ratio (line plot)';

  @Input()
  inputData: PortfolioCalculation;
  @Input()
  linePlotData: number[][];

  plotData: any[];
  plotLayout = {
    width: 800,
    height: 600,
    title: this.title,
    xaxis: {
      title: 'Placeholder x axis title',
      tickformat: ',.0%'
    },
    yaxis: {
      title: 'Sharpe Ratio',
    },
  };

  constructor() { }

  ngOnChanges(): void {
    this.plotData = [];
    if (this.linePlotData) {
      this.plotLayout.xaxis.title = this.inputData.holdingsData[0].ticker + ' to ' + this.inputData.holdingsData[1].ticker + ' ratio (%)';
      // this.plotLayout.yaxis.title = this.inputData.holdingsData[1].ticker + ' weights';

      const linePlotObject = {
        x: [],
        y: [],
        mode: 'lines+markers'
      };
      const xArray = [];
      const yArray = [];
      this.linePlotData.sort((a, b) => {
        return a[0] - b[0];
      });
      this.linePlotData.forEach(element => {
        xArray.push(element[0]); // x
        yArray.push(element[1]); // y
      });
      linePlotObject.x = xArray;
      linePlotObject.y = yArray;
      this.plotData.push(linePlotObject);
    }
  }
}
