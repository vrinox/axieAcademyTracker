import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityPerfilComponent } from './community-perfil.component';

describe('CommunityPerfilComponent', () => {
  let component: CommunityPerfilComponent;
  let fixture: ComponentFixture<CommunityPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
