import { ModelDbConverter } from './../utils/modelDbConverter';
import { PerformanceSeriesDb } from './../models/performance-series-db';
import { FirebasePerformanceService } from './firebase-performance.service';
import { Injectable } from '@angular/core';
import { HistoricalPriceService } from './historical-price.service';
import { PerformanceSeries } from '../models/performance-series';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceWrapperService {

  constructor(
    private historicalPriceService: HistoricalPriceService,
    private firebasePerformanceService: FirebasePerformanceService) {
  }

  /*
    https://angular.io/guide/observables
  */
  getPerformance(ticker: string, dateFrom: Date, dateTo: Date): Observable<PerformanceSeries> {
    const observable = new Observable<PerformanceSeries>(observer => {
      // 1: Check if data exist in db
      const sub = this.firebasePerformanceService.getPerformance(ticker).subscribe(response => {
        console.log('Response received from DB');
        if (response.length === 1) {
          console.log('Found ticker in db');
          observer.next(ModelDbConverter.convertToGUIModel(response[0]));
          observer.complete();
        } else if (response.length > 1) {
          observer.error('Error! Ticker ' + ticker + ' was found more than once when searching the database');
        } else if (response.length === 0) {
          observer.error('Ticker is not loaded in database, retrieving from API...');
        }
      });

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return {
        unsubscribe(): void {
          console.log('Unsubscribing from observable');
          sub.unsubscribe();
        }
      };
    });

    return observable;
  }

}
