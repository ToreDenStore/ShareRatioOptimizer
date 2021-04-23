import { PerformanceSeriesDb } from './../models/performance-series-db';
import { FirebasePerformanceService } from './firebase-performance.service';
import { Injectable } from '@angular/core';
import { HistoricalPriceService } from './historical-price.service';
import { PerformanceSeries } from '../models/performance-series';

@Injectable({
  providedIn: 'root'
})
export class PerformanceWrapperService {

  constructor(
    private historicalPriceService: HistoricalPriceService,
    private firebasePerformanceService: FirebasePerformanceService) { }

  getPerformance(ticker: string, dateFrom: Date, dateTo: Date) {
    // 1: Check if data exist in db
    this.firebasePerformanceService.getPerformance(ticker).subscribe(response => {
      console.log('Response received from DB');
      if (response.length === 1) {
        console.log('Found ticker in db');
        return response[0];
      } else if (response.length > 1) {
        alert('Error! Ticker ' + ticker + ' was found more than once when searching the database');
      } else if (response.length === 0) {
        console.log('Ticker is not loaded in database, retrieving from API...');
      }
    });
  }

}
