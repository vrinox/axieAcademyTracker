import { TestBed } from '@angular/core/testing';

import { AgregarNewBecadoService } from './agregar-new-becado.service';

describe('AgregarNewBecadoService', () => {
  let service: AgregarNewBecadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgregarNewBecadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
