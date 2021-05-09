import { FirebasePerformanceService } from './../services/firebase-performance.service';
import { PerformanceWrapperService } from './../services/performance-wrapper.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PerformanceSeries } from '../models/performance-series';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { CalculatorUtils } from '../utils/calculatorUtils';
import { Simulation } from '../utils/simulation';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // TODO: Handle limit of max 5 api calls per second
  // TODO: Save all loaded data into memory to avoid more API or database calls
  // TODO: Make one table for all data, make model for this also, also sortable table

  // Constants
  private fromDate = new Date('2020-01-01');
  private toDate = new Date('2020-12-31');

  performanceSeriesList: PerformanceSeries[];
  calculation: PortfolioCalculation;
  calculationMaxSharpe: PortfolioCalculation;
  calculationMinStdev: PortfolioCalculation;

  // Control elements
  symbolsLoading = 0;

  // GUI elements
  tickerSymbolsDB: string[] = [];
  tickerSymbolsDBSub: Subscription;
  tickerSymbols: string[] = [];
  surfacePlotData = [];
  linePlotData = [];
  plotLayout = {
    width: 800,
    height: 600,
    title: 'Sharpe Ratio by weights',
    xaxis: {
      title: 'Placeholder x axis title',
    },
    yaxis: {
      title: 'Placeholder y axis title',
    },
  };
  plotLayoutSurface = {
    width: 800,
    height: 600,
    title: 'Sharpe Ratio by weights',
    xaxis: {
      title: 'Placeholder x axis title',
      type: 'category'
    },
    yaxis: {
      title: 'Placeholder y axis title',
      type: 'category'
    },
  };

  constructor(
    private performanceWrapperService: PerformanceWrapperService,
    private firebasePerformanceService: FirebasePerformanceService
  ) { }

  ngOnInit(): void {
    this.performanceSeriesList = [];

    this.tickerSymbolsDBSub = this.firebasePerformanceService.getAllTickers().subscribe(tickers => {
      this.tickerSymbolsDB = tickers;
    });
  }

  ngOnDestroy(): void {
    this.tickerSymbolsDBSub.unsubscribe();
  }

  getCalculations(): {name: string, calc: PortfolioCalculation}[] {
    const calculations = [];
    let index = 0;
    this.performanceSeriesList.forEach(series => {
      const calc = new PortfolioCalculation();
      calc.sharpeRatio = series.sharpeRatio;
      calc.stDev = series.stDev;
      calc.performance = series.return;
      calc.holdingsData = [];
      for (let i = 0; i < this.performanceSeriesList.length; i++) {
        const element = this.performanceSeriesList[i];
        const holding = new PortfolioHolding();
        holding.ticker = element.ticker;
        if (i === index) {
          holding.weight = 1;
        } else {
          holding.weight = 0;
        }
        calc.holdingsData.push(holding);
      }
      const obj = {
        name: series.ticker,
        calc
      };
      calculations.push(obj);
      index++;
    });
    if (this.calculation !== undefined && this.calculation !== null) {
      const obj = {
        name: 'Evenly weighted',
        calc: this.calculation
      };
      calculations.push(obj);
    }
    if (this.calculationMaxSharpe !== undefined && this.calculationMaxSharpe !== null) {
      const obj = {
        name: 'Max Sharpe',
        calc: this.calculationMaxSharpe
      };
      calculations.push(obj);
    }
    if (this.calculationMinStdev !== undefined && this.calculationMinStdev !== null) {
      const obj = {
        name: 'Min volatility',
        calc: this.calculationMinStdev
      };
      calculations.push(obj);
    }
    return calculations;
  }

  makePortfolioCalculations(): void {
    const holdings: PortfolioHolding[] = [];

    this.performanceSeriesList.forEach(performanceSerie => {
      const holding = new PortfolioHolding();
      holding.performanceSeries = performanceSerie.performanceSeries;
      holding.ticker = performanceSerie.ticker;
      holding.weight = 1 / this.performanceSeriesList.length;
      holdings.push(holding);
    });

    const calculation = CalculatorUtils.runPortfolioCalculation(holdings);

    this.calculation = calculation;

    this.testSimulationLogic();
  }

  testSimulationLogic(): void {
    this.surfacePlotData = [];
    this.linePlotData = [];
    const sim = new Simulation(this.performanceSeriesList);
    sim.startSimulation();
    this.calculationMaxSharpe = sim.maxSharpeCalculation;
    this.calculationMinStdev = sim.minStdevCalculation;

    if (this.performanceSeriesList.length === 2) {
      this.linePlotData.push(sim.linePlotObject);
      this.plotLayout.xaxis.title = this.calculationMaxSharpe.holdingsData[0].ticker + ' weights';
      this.plotLayout.yaxis.title = this.calculationMaxSharpe.holdingsData[1].ticker + ' weights';
    }
    if (this.performanceSeriesList.length === 3) {
      const plotDataObject = {
        z: sim.surfacePlotData,
        type: 'contour',
        contours: {
          // start: this.calculationMaxSharpe.sharpeRatio - 1,
          // end: this.calculationMaxSharpe.sharpeRatio,
          // size: 0.01,
          coloring: 'heatmap',
          showlabels: true
        },
        x: sim.weights,
        y: sim.weights
      };
      this.plotLayoutSurface.xaxis.title = this.calculationMaxSharpe.holdingsData[1].ticker + ' weights';
      this.plotLayoutSurface.yaxis.title = this.calculationMaxSharpe.holdingsData[0].ticker + ' weights';
      this.surfacePlotData.push(plotDataObject);
      // console.log('Plot data: ' + JSON.stringify(plotDataObject));
    }
  }

  getTestRequest(): void {
    // console.log('Current model is ' + JSON.stringify(this.tickerSymbols));
    // const loadedTickers = [];
    // this.performanceSeriesList.forEach(series => {
    //   loadedTickers.push(series.ticker);
    // });
    // console.log('Current loaded series are ' + JSON.stringify(loadedTickers));

    this.calculation = null;
    this.calculationMaxSharpe = null;
    this.calculationMinStdev = null;
    this.surfacePlotData = [];
    this.linePlotData = [];

    // Remove from performance series those that are no longer present
    for (let index = 0; index < this.performanceSeriesList.length; index++) {
      const series = this.performanceSeriesList[index];
      const isInTickerList = this.tickerSymbols.find(ticker => {
        return ticker.toUpperCase() === series.ticker.toUpperCase();
      });
      if (isInTickerList === undefined) {
        this.performanceSeriesList.splice(index, 1);
      }
    }

    // Create an array of new ticker symbols
    const tickerSymbolsNew = [];
    this.tickerSymbols.forEach(ticker => {
      const isInSeriesList = this.performanceSeriesList.find(x => {
        return x.ticker.toUpperCase() === ticker.toUpperCase();
      });
      if (isInSeriesList === undefined) {
        tickerSymbolsNew.push(ticker);
      }
    });

    console.log('Tickers to ask for ' + JSON.stringify(tickerSymbolsNew));

    tickerSymbolsNew.forEach(symbol => {
      this.symbolsLoading++;
      this.performanceWrapperService.getPerformance(symbol, this.fromDate, this.toDate).subscribe(performanceSeries => {
        this.symbolsLoading--;
        console.log('Component observable response received for ticker ' + performanceSeries.ticker);
        if (performanceSeries !== null) {
          this.performanceSeriesList.push(performanceSeries);
        }
      }, error => {
        this.symbolsLoading--;
        const tickerIndex = this.tickerSymbols.findIndex(x => {
          return x === symbol;
        });
        this.tickerSymbols.splice(tickerIndex, 1);
        alert('Error from component observable: ' + JSON.stringify(error));
      });
    });

    return;
  }
}
