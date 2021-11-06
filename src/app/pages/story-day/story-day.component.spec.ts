import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDayComponent } from './story-day.component';

describe('StoryDayComponent', () => {
  let component: StoryDayComponent;
  let fixture: ComponentFixture<StoryDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
