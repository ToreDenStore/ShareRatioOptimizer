import { VisualizableInGraph } from './../../models/visualizable-in-graph';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnChanges {

  @Input()
  inputData: VisualizableInGraph[];

  plotData: any[];
  plotLayout = {
    width: 800,
    height: 600,
    title: 'Scatter plot',
    xaxis: {
      title: 'Lower Volatility',
      autorange: 'reversed',
      tickformat: ',.2%'
    },
    yaxis: {
      title: 'Higher Performance',
      tickformat: ',.2%'
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
