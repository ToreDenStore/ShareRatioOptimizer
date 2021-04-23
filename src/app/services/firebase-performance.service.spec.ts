/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirebasePerformanceService } from './firebase-performance.service';

describe('Service: FirebasePerformance', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebasePerformanceService]
    });
  });

  it('should ...', inject([FirebasePerformanceService], (service: FirebasePerformanceService) => {
    expect(service).toBeTruthy();
  }));
});
