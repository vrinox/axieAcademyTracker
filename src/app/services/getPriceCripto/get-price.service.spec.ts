import { TestBed } from '@angular/core/testing';

import { GetPriceService } from './get-price.service';

describe('GetPriceService', () => {
  let service: GetPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
