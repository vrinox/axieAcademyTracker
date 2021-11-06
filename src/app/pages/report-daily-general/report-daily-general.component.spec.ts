import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDailyGeneralComponent } from './report-daily-general.component';

describe('ReportDailyGeneralComponent', () => {
  let component: ReportDailyGeneralComponent;
  let fixture: ComponentFixture<ReportDailyGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDailyGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDailyGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
