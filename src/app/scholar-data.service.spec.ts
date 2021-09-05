import { TestBed } from '@angular/core/testing';

import { ScholarDataService } from './scholar-data.service';

describe('ScholarDataService', () => {
  let service: ScholarDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScholarDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
