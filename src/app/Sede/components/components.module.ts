import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { EditSedeComponent } from './edit-sede/edit-sede.component';
import { SedesListComponent } from './sedes-list/sedes-list.component';
import { SharedComponent } from './shared/shared.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ReactiveFormsModule  } from '@angular/forms';

@NgModule({
  declarations: [EditSedeComponent, SedesListComponent, SharedComponent],
  imports: [
    CommonModule,
    ComponentsRoutingModule, 
    NgxPaginationModule,
    Ng2SearchPipeModule,
    FormsModule,
    FilterPipeModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
