import { TestBed } from '@angular/core/testing';

import { FiltersAxiesService } from './filters-axies.service';

describe('FiltersAxiesService', () => {
  let service: FiltersAxiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltersAxiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
