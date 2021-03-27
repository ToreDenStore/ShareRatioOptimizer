/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HistoricalPriceService } from './historical-price.service';

describe('Service: HistoricalPrice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoricalPriceService]
    });
  });

  it('should ...', inject([HistoricalPriceService], (service: HistoricalPriceService) => {
    expect(service).toBeTruthy();
  }));
});
