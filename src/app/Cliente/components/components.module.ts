import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { EditClienteComponent } from './edit-cliente/edit-cliente.component';
import { SharedComponent } from './shared/shared.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [ClientesListComponent, EditClienteComponent, SharedComponent],
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
