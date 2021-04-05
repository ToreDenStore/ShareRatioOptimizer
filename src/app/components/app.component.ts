import { Component } from '@angular/core';
import { ApiResponseHistoricalPrice } from '../models/api-response-historical-price';
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
  data: ApiResponseHistoricalPrice;

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
    // const date2020jan = new Date('2020-01-01');
    // const date2020dec = new Date('2020-12-31');
    // const appleTicker = 'AAPL';

    let symbol = this.tickerSymbols[0];

    console.log('Symbol: ' + symbol);

    this.historicalPriceService.getHistoricalData(this.fromDate, this.toDate, symbol).subscribe(
      response => {
        console.log('Response received!');
        this.data = response;
        this.response = JSON.stringify(response);
      }
    );
  }
}
