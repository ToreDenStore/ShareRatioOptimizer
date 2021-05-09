import { PerformanceSeriesDb } from './../models/performance-series-db';
import { ModelConverter } from './../utils/modelDbConverter';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { PerformanceSeries } from '../models/performance-series';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebasePerformanceService {

  private collectionName = 'performance-series';

  performanceCollection: AngularFirestoreCollection<PerformanceSeriesDb>;

  constructor(private firestore: AngularFirestore) {
    this.performanceCollection = this.firestore.collection<PerformanceSeriesDb>(this.collectionName);
  }

  addPerformance(series: PerformanceSeries): Promise<DocumentReference<PerformanceSeriesDb>> {
    const convertedModel = ModelConverter.convertToDbModel(series);
    // console.log('Converted model: ' + JSON.stringify(convertedModel));
    return this.performanceCollection.add(convertedModel);
  }

  // Assume only one time range
  getPerformance(ticker: string): Observable<PerformanceSeriesDb[]> {
    return this.firestore.collection<PerformanceSeriesDb>(this.collectionName, ref => ref.where('ticker', '==', ticker).limit(1))
      .valueChanges();
  }

  getAllTickers(): Observable<string[]> {
    return this.firestore.collection<PerformanceSeriesDb>(this.collectionName).valueChanges().pipe(
      map((series) => {
        const tickerSymbolsDB: string[] = [];
        series.forEach(serie => {
          const hasTicker = tickerSymbolsDB.find(x => {
            return x === serie.ticker.toUpperCase();
          });
          if (!hasTicker) {
            tickerSymbolsDB.push(serie.ticker.toUpperCase());
          }
        });
        tickerSymbolsDB.sort((a, b) => {
          return a.localeCompare(b);
        });
        return tickerSymbolsDB;
      })
    );
  }

}
