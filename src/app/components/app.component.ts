import { Component } from '@angular/core';
import { HistoricalPriceService } from '../services/historical-price.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public response: string;

  constructor(
    private historicalPriceService: HistoricalPriceService
  ) { }

  ngOnInit(): void {
  }

  getTestRequest(): void {
    this.historicalPriceService.getHistoricalData().subscribe(
      response => {
        this.response = JSON.stringify(response);
      }
    );
  }
}
