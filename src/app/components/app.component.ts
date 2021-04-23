import { PerformanceWrapperService } from './../services/performance-wrapper.service';
import { FirebasePerformanceService } from './../services/firebase-performance.service';
import { Component, OnInit } from '@angular/core';
import { PerformancePoint, PerformanceSeries } from '../models/performance-series';
import { HistoricalPriceService } from '../services/historical-price.service';
import { std } from 'mathjs';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { CalculatorUtils } from '../utils/calculatorUtils';
import { Simulation } from '../utils/simulation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // TODO: Handle limit of max 5 api calls per second
  // TODO: Save loaded data into memory to avoid more API or database calls
  // TODO: Make one table for all data, make model for this also, also sortable table

  // Constants
  private fromDate = new Date('2020-01-01');
  private toDate = new Date('2020-12-31');

  // response: string;
  // data: ApiResponseHistoricalPrice[] = [];
  performanceSeriesList: PerformanceSeries[];
  calculation: PortfolioCalculation;
  calculationMaxSharpe: PortfolioCalculation;
  calculationMinStdev: PortfolioCalculation;

  // Control elements
  symbolsLoading = 0;

  // GUI elements
  tickerSymbols: string[] = [];

  constructor(
    private historicalPriceService: HistoricalPriceService,
    private firebasePerformanceService: FirebasePerformanceService,
    private performanceWrapperService: PerformanceWrapperService
  ) { }

  ngOnInit(): void {
    this.performanceSeriesList = [];
  }

  getCalculations(): {name: string, calc: PortfolioCalculation}[] {
    const calculations = [];
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
        name: 'Min Volatility',
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
    const sim = new Simulation(this.performanceSeriesList);
    sim.startSimulation();
    this.calculationMaxSharpe = sim.maxSharpeCalculation;
    this.calculationMinStdev = sim.minStdevCalculation;
  }

  getTestRequest(): void {
    // console.log('Current model is ' + JSON.stringify(this.tickerSymbols));
    const loadedTickers = [];
    this.performanceSeriesList.forEach(series => {
      loadedTickers.push(series.ticker);
    });
    // console.log('Current loaded series are ' + JSON.stringify(loadedTickers));

    this.calculation = null;
    this.calculationMaxSharpe = null;
    this.calculationMinStdev = null;

    // Remove from performance series those that are no longer present
    for (let index = 0; index < this.performanceSeriesList.length; index++) {
      const series = this.performanceSeriesList[index];
      const isInTickerList = this.tickerSymbols.find(ticker => {
        return ticker === series.ticker;
      });
      if (isInTickerList === undefined) {
        this.performanceSeriesList.splice(index, 1);
      }
    }

    // Create an array of new ticker symbols
    const tickerSymbolsNew = [];
    this.tickerSymbols.forEach(ticker => {
      const isInSeriesList = this.performanceSeriesList.find(x => {
        return x.ticker === ticker;
      });
      if (isInSeriesList === undefined) {
        tickerSymbolsNew.push(ticker);
      }
    });

    console.log('Tickers to ask for ' + JSON.stringify(tickerSymbolsNew));

    tickerSymbolsNew.forEach(symbol => {
      this.performanceWrapperService.getPerformance(symbol, this.fromDate, this.toDate);
      return;

      const performanceSeries = new PerformanceSeries();
      performanceSeries.dateFrom = this.fromDate;
      performanceSeries.dateTo = this.toDate;
      performanceSeries.ticker = symbol;
      this.performanceSeriesList.push(performanceSeries);

      console.log('Symbol: ' + symbol);
      this.symbolsLoading++;
      this.historicalPriceService.getHistoricalData(this.fromDate, this.toDate, symbol).subscribe(
        response => {
          this.symbolsLoading--;
          console.log('Response received for symbol ' + symbol + '.');
          // console.log('Response: ' + JSON.stringify(response));

          if (response != null) {

            const filteredList = response.prices.filter(x => {
              return x.type == null;
            });

            // console.log('Filtered list: ' + JSON.stringify(filteredList));
            const performances: PerformancePoint[] = [];
            const performancesNumbers: number[] = [];

            // List is sorted by latest date first
            for (let index = 0; index < filteredList.length - 1; index++) {
              const price = filteredList[index];
              const performancePoint: PerformancePoint = new PerformancePoint();
              performancePoint.date = new Date(price.date * 1000);
              performancePoint.performance = price.close / filteredList[index + 1].close - 1;
              performances.push(performancePoint);
              performancesNumbers.push(performancePoint.performance);
            }

            // console.log('Performance series: ' + JSON.stringify(performances));
            performanceSeries.performanceSeries = performances;

            console.log('Adding entry to db');
            this.firebasePerformanceService.addPerformance(performanceSeries).then(dbResponse => {
              console.log('Promise resolved, new id is: ' + JSON.stringify(dbResponse.id));
            }).catch(message => {
              console.log('Error caught: ' + JSON.stringify(message));
            });

            // performanceSeries.stDev = std(performancesNumbers);
            performanceSeries.return = filteredList[0].close / filteredList[filteredList.length - 1].close - 1;
            performanceSeries.stDev = std(performancesNumbers) * Math.sqrt(performancesNumbers.length);
            performanceSeries.sharpeRatio = performanceSeries.return / performanceSeries.stDev;
            // this.performanceSeriesList.push(performanceSeries);

            console.log('Return: ' + performanceSeries.return);
            console.log('Annualized volatility: ' + performanceSeries.stDev);
            console.log('Sharpe: ' + performanceSeries.sharpeRatio);
            console.log('End close: ' + filteredList[0].close);
            console.log('Start close: ' + filteredList[filteredList.length - 1].close);
          }
          // this.response = 'Response: ' + JSON.stringify(response);
        }
        , error => {
          this.symbolsLoading--;
          console.log('Error: ' + JSON.stringify(error));
        }

      );
    });
  }
}
