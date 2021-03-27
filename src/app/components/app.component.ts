import { Component } from '@angular/core';
import { ApiResponseHistoricalPrice } from '../models/api-response-historical-price';
import { HistoricalPriceService } from '../services/historical-price.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public response: string;
  public data: ApiResponseHistoricalPrice;

  constructor(
    private historicalPriceService: HistoricalPriceService
  ) { }

  ngOnInit(): void {
  }

  getTestRequest(): void {
    const date2020jan = new Date('2020-01-01');
    const date2020dec = new Date('2020-12-31');
    const appleTicker = 'AAPL';

    this.historicalPriceService.getHistoricalData(date2020jan, date2020dec, appleTicker).subscribe(
      response => {
        this.data = response;
        this.response = JSON.stringify(response);
      }
    );
  }
}
