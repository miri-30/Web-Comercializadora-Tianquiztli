import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActPerfilUserComponent } from './act-perfil-user.component';

describe('ActPerfilUserComponent', () => {
  let component: ActPerfilUserComponent;
  let fixture: ComponentFixture<ActPerfilUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActPerfilUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActPerfilUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
