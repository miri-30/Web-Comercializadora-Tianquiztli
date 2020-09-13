import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { EditServiciosComponent } from './edit-servicios/edit-servicios.component';
import { ServiciosListComponent } from './servicios-list/servicios-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ReactiveFormsModule  } from '@angular/forms';


@NgModule({
  declarations: [EditServiciosComponent, ServiciosListComponent],
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
