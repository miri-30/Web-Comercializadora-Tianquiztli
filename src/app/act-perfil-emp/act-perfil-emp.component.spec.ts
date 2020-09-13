import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActPerfilEmpComponent } from './act-perfil-emp.component';

describe('ActPerfilEmpComponent', () => {
  let component: ActPerfilEmpComponent;
  let fixture: ComponentFixture<ActPerfilEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActPerfilEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActPerfilEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
