import { TestBed } from '@angular/core/testing';

import { ReferenceScholarsService } from './reference-scholars.service';

describe('ReferenceScholarsService', () => {
  let service: ReferenceScholarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceScholarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
