import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonwloadPdfComponent } from './donwload-pdf.component';

describe('DonwloadPdfComponent', () => {
  let component: DonwloadPdfComponent;
  let fixture: ComponentFixture<DonwloadPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonwloadPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonwloadPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
