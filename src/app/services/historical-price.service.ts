import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { local } from 'src/environments/local';

@Injectable({
  providedIn: 'root'
})
export class HistoricalPriceService {

  private apiUrl = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2';

  httpOptions = {
    headers: new HttpHeaders({
      // 'Content-Type': 'application/json',
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      'X-RapidAPI-Key': local.rapidKey
      // useQueryString: 'true'
      // 'access-control-allow-credentials': 'true',
      // 'access-control-allow-headers': 'ver',
      // 'access-control-allow-methods': 'GET, POST',
      // 'access-control-allow-origin': '*',
      // 'content-type': 'application/json',
      // date: 'Thu, 04 Jul 2019 08:01:10 GMT',
      // server: 'RapidAPI-1.0.16',
      // 'x-rapidapi-region': 'AWS - ap-southeast-1',
      // 'x-rapidapi-version': '1.0.16',
      // 'transfer-encoding': 'chunked',
      // connection: 'Close'
    }),
    params: {
      frequency: '1d',
      filter: 'history',
      period1: '1546448400',
      period2: '1562086800',
      symbol: 'AMRN'
    }
  };

  constructor(
    private http: HttpClient
  ) { }

  getHistoricalData(): Observable<any> {
    const urlString: string = this.apiUrl + '/get-historical-data';

    // const request =  {
    //   frequency: '1d',
    //   filter: 'history',
    //   period1: '1546448400',
    //   period2: '1562086800',
    //   symbol: 'AMRN'
    // };

    console.log('Calling ' + urlString);
    return this.http.get(urlString, this.httpOptions)
      .pipe(
        tap(x => console.log('Got historical data')),
        catchError(this.handleError<any>('Get historical data failed'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(result?: T) {
    // console.log('Handling error');
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log('logging error');
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
