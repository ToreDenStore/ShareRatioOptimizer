import { Component } from '@angular/core';
import { PerformancePoint, PerformanceSeries } from '../models/performance-series';
import { HistoricalPriceService } from '../services/historical-price.service';
import { std } from 'mathjs';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { PerformanceUtils } from '../utils/performanceUtils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private historicalPriceService: HistoricalPriceService
  ) { }

  // Constants
  private fromDate = new Date('2020-01-01');
  private toDate = new Date('2020-12-31');

  // response: string;
  // data: ApiResponseHistoricalPrice[] = [];
  performanceSeriesList: PerformanceSeries[];

  // GUI elements
  public tickerSymbols: string[] = [];

  private static optimizeSharpe(listOfSeries: PerformanceSeries[]): PerformanceSeries[] {
    return null;
  }

  private static runPortfolioCalculation(holdings: PortfolioHolding[]): PortfolioCalculation {
    const days = holdings[0].performanceSeries.length;
    const performances: number[] = [];
    const performancePoints: PerformancePoint[] = [];

    for (let index = 0; index < days; index++) {
      let performance = 0;
      holdings.forEach(holding => {
        performance += holding.performanceSeries[index].performance * holding.weight;
      });
      performances.push(performance);

      const point: PerformancePoint = {
        date: holdings[0].performanceSeries[index].date,
        performance
      };
      performancePoints.push(point);
    }

    const calculation = new PortfolioCalculation();
    calculation.holdingsData = holdings;
    calculation.performanceSeries = performancePoints;
    calculation.performance = PerformanceUtils.getTotalPerformance(performances);

    return calculation;
  }

  ngOnInit(): void {
  }

  change(): void {
    console.log('Current model is ' + JSON.stringify(this.tickerSymbols));
  }

  makePortfolioCalculation(): void {
    const holdings: PortfolioHolding[] = [];

    let holding = new PortfolioHolding();
    let example = this.performanceSeriesList[0];
    holding.performanceSeries = example.performanceSeries;
    holding.ticker = example.ticker;
    holding.weight = 1;

    holdings.push(holding);

    const calculation = AppComponent.runPortfolioCalculation(holdings);

    console.log('Portfolio calculation: ' + JSON.stringify(calculation));
  }

  getTestRequest(): void {
    // this.data = [];
    this.performanceSeriesList = [];

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
