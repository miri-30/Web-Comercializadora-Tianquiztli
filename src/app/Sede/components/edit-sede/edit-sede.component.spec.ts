import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSedeComponent } from './edit-sede.component';

describe('EditSedeComponent', () => {
  let component: EditSedeComponent;
  let fixture: ComponentFixture<EditSedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
