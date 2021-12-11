import { TestBed } from '@angular/core/testing';

import { AutoClaimService } from './auto-claim.service';

describe('AutoClaimService', () => {
  let service: AutoClaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoClaimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
