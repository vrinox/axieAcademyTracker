import { TestBed } from '@angular/core/testing';

import { GetAxiesService } from './get-axies.service';

describe('GetAxiesService', () => {
  let service: GetAxiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAxiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
