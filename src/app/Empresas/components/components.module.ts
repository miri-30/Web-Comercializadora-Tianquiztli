import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { EmpresasListComponent } from './empresas-list/empresas-list.component';
import { EditEmpresaComponent } from './edit-empresa/edit-empresa.component';
import { SharedComponent } from './shared/shared.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [EmpresasListComponent, EditEmpresaComponent, SharedComponent],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    
    NgxPaginationModule,
    Ng2SearchPipeModule,
    FormsModule,
    FilterPipeModule,
    ReactiveFormsModule,
  ]
})
export class ComponentsModule { }
