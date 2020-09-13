import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGeneralComponent } from './support-general.component';

describe('SupportGeneralComponent', () => {
  let component: SupportGeneralComponent;
  let fixture: ComponentFixture<SupportGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
