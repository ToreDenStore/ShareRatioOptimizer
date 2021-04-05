import { Component } from '@angular/core';
import { ApiResponseHistoricalPrice } from '../models/api-response-historical-price';
import { PerformancePoint, PerformanceSeries } from '../models/performance-series';
import { HistoricalPriceService } from '../services/historical-price.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Constants
  private fromDate = new Date('2020-01-01');
  private toDate = new Date('2020-12-31');

  response: string;
  data: ApiResponseHistoricalPrice[] = [];

  // GUI elements
  public tickerSymbols: string[] = [];

  constructor(
    private historicalPriceService: HistoricalPriceService
  ) { }

  ngOnInit(): void {
  }

  change(): void {
    console.log('Current model is ' + JSON.stringify(this.tickerSymbols));
  }

  getTestRequest(): void {
    this.data = [];

    this.tickerSymbols.forEach(symbol => {
      const performanceSeries = new PerformanceSeries();
      performanceSeries.dateFrom = this.fromDate;
      performanceSeries.dateTo = this.toDate;
      performanceSeries.ticker = symbol;

      console.log('Symbol: ' + symbol);
      this.historicalPriceService.getHistoricalData(this.fromDate, this.toDate, symbol).subscribe(
        response => {
          console.log('Response received for symbol ' + symbol + '.');
          if (response != null) {
            this.data.push(response);

            const performances: PerformancePoint[] = [];
            // response.prices.forEach(price => {
            //   let performance: PerformancePoint = new PerformancePoint();
            //   performance.date = new Date(price.date);
            //   performance.performance
            // });

            const filteredList = response.prices.filter(x => {
              return x.type == null;
            });

            console.log('Filtered list: ' + JSON.stringify(filteredList));

            // List is sorted by latest date first
            for (let index = 0; index < filteredList.length - 1; index++) {
              const price = filteredList[index];
              const performancePoint: PerformancePoint = new PerformancePoint();
              performancePoint.date = new Date(price.date * 1000);
              performancePoint.performance = price.close / filteredList[index + 1].close - 1;
              performances.push(performancePoint);
            }

            console.log('Performance series: ' + JSON.stringify(performances));
            
          }
          this.response = 'Response: ' + JSON.stringify(response);
        }
        , error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      );
    });
  }
}
