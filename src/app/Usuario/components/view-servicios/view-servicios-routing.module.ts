import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewServiciosPage } from './view-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: ViewServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewServiciosPageRoutingModule {}
