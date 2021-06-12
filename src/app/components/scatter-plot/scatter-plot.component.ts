import { VisualizableInGraph } from './../../models/visualizable-in-graph';
import { Component, Input, OnChanges } from '@angular/core';
import { StaticNumbers } from 'src/app/utils/static-numbers';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnChanges {

  title = 'Overview of calculations (scatter plot)';

  @Input()
  inputData: VisualizableInGraph[];

  plotData: any[];
  plotLayout = {
    width: StaticNumbers.PLOT_WIDTH,
    height: StaticNumbers.PLOT_HEIGHT,
    title: this.title,
    xaxis: {
      title: 'Lower Volatility',
      autorange: 'reversed',
      tickformat: ',.0%'
    },
    yaxis: {
      title: 'Higher Performance',
      tickformat: ',.0%'
    }
  };

  constructor() { }

  ngOnChanges(): void {
    console.log('Changes detected in scatter plot input');
    this.plotData = [];
    if (this.inputData) {
      const x = [];
      const y = [];
      const text = [];
      this.inputData.forEach(element => {
        x.push(element.stDev);
        y.push(element.performance);
        text.push(element.name);
      });
      const plotElement = {
        x,
        y,
        text,
        textposition: 'bottom center',
        mode: 'markers+text',
        type: 'scatter',
        marker: { size: 12 }
      };
      this.plotData.push(plotElement);
    }
  }

}
