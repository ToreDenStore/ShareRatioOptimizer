import { Component } from '@angular/core';
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
export class AppComponent {

  // TODO: Handle limit of max 5 api calls per second
  // TODO: Only make new API call for newly added ticker codes

  constructor(
    private historicalPriceService: HistoricalPriceService
  ) { }

  // Constants
  private fromDate = new Date('2020-01-01');
  private toDate = new Date('2020-12-31');

  // response: string;
  // data: ApiResponseHistoricalPrice[] = [];
  performanceSeriesList: PerformanceSeries[];
  calculation: PortfolioCalculation;

  // GUI elements
  public tickerSymbols: string[] = [];

  ngOnInit(): void {
  }

  change(): void {
    console.log('Current model is ' + JSON.stringify(this.tickerSymbols));
  }

  makePortfolioCalculation(): void {
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

    // console.log('Portfolio calculation: ' + JSON.stringify(calculation));
  }

  // optimizeSharpe(): void {
  //   this.calculation = CalculatorUtils.optimizeSharpe(this.performanceSeriesList);
  // }

  testSimulationLogic(): void {
    // console.log('Start sim button clicked');
    // const weights: number[] = [0.001, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 100, 1000];
    const sim = new Simulation(this.performanceSeriesList);
    const result = sim.startSimulation();
    // console.log('Result of simulation: ' + JSON.stringify(result));
    this.calculation = result;
    // console.log('Number of simulations completed: ' + result.length);
  }

  getTestRequest(): void {
    // this.data = [];
    this.performanceSeriesList = [];
    this.calculation = null;

    this.tickerSymbols.forEach(symbol => {
      const performanceSeries = new PerformanceSeries();
      performanceSeries.dateFrom = this.fromDate;
      performanceSeries.dateTo = this.toDate;
      performanceSeries.ticker = symbol;

      console.log('Symbol: ' + symbol);
      this.historicalPriceService.getHistoricalData(this.fromDate, this.toDate, symbol).subscribe(
        response => {
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

            // performanceSeries.stDev = std(performancesNumbers);
            performanceSeries.return = filteredList[0].close / filteredList[filteredList.length - 1].close - 1;
            performanceSeries.stDev = std(performancesNumbers) * Math.sqrt(performancesNumbers.length);
            performanceSeries.sharpeRatio = performanceSeries.return / performanceSeries.stDev;
            this.performanceSeriesList.push(performanceSeries);

            console.log('Return: ' + performanceSeries.return);
            console.log('Annualized volatility: ' + performanceSeries.stDev);
            console.log('Sharpe: ' + performanceSeries.sharpeRatio);
            console.log('End close: ' + filteredList[0].close);
            console.log('Start close: ' + filteredList[filteredList.length - 1].close);
          }
          // this.response = 'Response: ' + JSON.stringify(response);
        }
        , error => {
          console.log('Error: ' + JSON.stringify(error));
        }

      );
    });
  }
}
