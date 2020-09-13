import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServiciosComponent } from './edit-servicios.component';

describe('EditServiciosComponent', () => {
  let component: EditServiciosComponent;
  let fixture: ComponentFixture<EditServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
