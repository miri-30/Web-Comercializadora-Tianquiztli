import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaServiciosComponent } from './servicios-list.component';

const routes: Routes = [{ path: '', component: ListaServiciosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule { }