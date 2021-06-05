import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { Observable } from 'rxjs';
import { local } from 'src/environments/local';
import { ApiResponseHistoricalPrice } from '../models/api-response-historical-price';

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
      period1: '',
      period2: '',
      // symbol: 'AMRN'
      symbol: ''
    }
  };

  constructor(
    private http: HttpClient
    // ,private ngxCsvParser: NgxCsvParser
  ) { }

  getHistoricalData(dateFrom: Date, dateTo: Date, ticker: string): Observable<ApiResponseHistoricalPrice> {
    const urlString: string = this.apiUrl + '/get-historical-data';

    // const request =  {
    //   frequency: '1d',
    //   filter: 'history',
    //   period1: '1546448400',
    //   period2: '1562086800',
    //   symbol: 'AMRN'
    // };

    this.httpOptions.params.period1 = (dateFrom.getTime() / 1000).toString();
    this.httpOptions.params.period2 = (dateTo.getTime() / 1000).toString();
    this.httpOptions.params.symbol = ticker;

    console.log('Calling ' + urlString);
    console.log('Http options: ' + JSON.stringify(this.httpOptions));

    return this.http.get<ApiResponseHistoricalPrice>(urlString, this.httpOptions);
  }

  // getTBillData(): Observable<Price[]> {
  //   return this.http.get('assets/BOND_BX_XTUP_TMUBMUSD01M.csv', {responseType: 'text'}).pipe(
  //     map(x => {
  //       const prices: Price[] = [];
  //       const parseResult: any[][] = this.ngxCsvParser.csvStringToArray(x, ',');
  //       for (let index = 1; index < parseResult.length - 1; index++) {
  //         const row = parseResult[index];
  //         const price: Price = {
  //           date: new Date(row[0]),
  //           close: this.parsePercentage(row[4])
  //         };
  //         prices.push(price);
  //       }
  //       return prices;
  //     })
  //   );
  // }

  // private parsePercentage(input: string): number {
  //   return parseFloat(input) / 100.0;
  // }

}
