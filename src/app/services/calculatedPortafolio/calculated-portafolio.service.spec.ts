import { TestBed } from '@angular/core/testing';

import { CalculatedPortafolioService } from './calculated-portafolio.service';

describe('CalculatedPortafolioService', () => {
  let service: CalculatedPortafolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatedPortafolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
