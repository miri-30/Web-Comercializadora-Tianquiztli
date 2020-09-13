import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ViewServiciosPageRoutingModule } from './view-servicios-routing.module';

import { ViewServiciosPage } from './view-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ViewServiciosPageRoutingModule
  ],
  declarations: [ViewServiciosPage]
})
export class ViewServiciosPageModule { }
