/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PerformanceWrapperService } from './performance-wrapper.service';

describe('Service: PerformanceWrapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerformanceWrapperService]
    });
  });

  it('should ...', inject([PerformanceWrapperService], (service: PerformanceWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
