import { TestBed } from '@angular/core/testing';

import { InsertScholarsService } from './insert-scholars.service';

describe('InsertScholarsService', () => {
  let service: InsertScholarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsertScholarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
