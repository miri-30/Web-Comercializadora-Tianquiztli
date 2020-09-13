import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportEmpComponent } from './support-emp.component';

describe('SupportEmpComponent', () => {
  let component: SupportEmpComponent;
  let fixture: ComponentFixture<SupportEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
