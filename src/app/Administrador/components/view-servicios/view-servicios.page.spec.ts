import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiciosPage } from './view-servicios.page';

describe('ViewServiciosPage', () => {
  let component: ViewServiciosPage;
  let fixture: ComponentFixture<ViewServiciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewServiciosPage ],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(ViewServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
