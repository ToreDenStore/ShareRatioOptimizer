import { VisualizableInGraph } from './../../models/visualizable-in-graph';
import { Component, Input, OnChanges } from '@angular/core';
import { PlotAbstract } from 'src/app/abstract-components/plot-abstract';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent extends PlotAbstract implements OnChanges {

  title = 'Overview of calculations (scatter plot)';

  @Input()
  inputData: VisualizableInGraph[];

  plotData: any[];
  plotLayout = {
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

  constructor() {
    super();
  }

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
