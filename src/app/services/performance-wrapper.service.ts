import { ModelConverter } from './../utils/modelDbConverter';
import { PerformanceSeriesDb } from './../models/performance-series-db';
import { FirebasePerformanceService } from './firebase-performance.service';
import { Injectable } from '@angular/core';
import { HistoricalPriceService } from './historical-price.service';
import { PerformancePoint, PerformanceSeries } from '../models/performance-series';
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
    1: Get data from db
    2: If data doesn't exist, get data from API
    3: Add data from API to db
  */
  getPerformance(ticker: string, dateFrom: Date, dateTo: Date): Observable<PerformanceSeries> {
    const observable = new Observable<PerformanceSeries>(observer => {
      // 1: Check if data exist in db
      const dbSub = this.firebasePerformanceService.getPerformance(ticker).subscribe(
        dbGetResponse => {
          console.log('Response received from DB');
          if (dbGetResponse.length === 1) {
            console.log('Found ticker in db');
            observer.next(ModelConverter.convertToGUIModel(dbGetResponse[0]));
            observer.complete();
          } else if (dbGetResponse.length > 1) {
            observer.error('Error! Ticker ' + ticker + ' was found more than once when searching the database');
          } else if (dbGetResponse.length === 0) {
            // observer.error('Ticker is not loaded in database, retrieving from API...');
            console.log('Ticker is not loaded in database, retrieving from API...');
            this.historicalPriceService.getHistoricalData(dateFrom, dateTo, ticker).subscribe(
              apiResponse => {
                console.log('Response from API received for symbol ' + ticker + '.');
                // console.log('Response from API received for symbol ' + ticker + ': ' + JSON.stringify(apiResponse));
                if (apiResponse != null) {
                  const performanceSeries = ModelConverter.historicPricesToPerformance(ticker, dateFrom, dateTo, apiResponse);
                  observer.next(performanceSeries);
                  observer.complete();
                  console.log('Adding entry to db');
                  this.firebasePerformanceService.addPerformance(performanceSeries).then(dbAddResponse => {
                    console.log('Promise resolved when adding to db, new id is: ' + JSON.stringify(dbAddResponse.id));
                  }).catch(message => {
                    console.log('Error caught when adding to db: ' + JSON.stringify(message));
                  });
                }
              },
              error => {
                observer.error(error);
              }
            );
          }
        },
        error => {
          // If firebase error
          observer.error(error);
        }
      );

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return {
        unsubscribe(): void {
          console.log('Unsubscribing from observable');
          dbSub.unsubscribe();
        }
      };
    });

    return observable;
  }

}
