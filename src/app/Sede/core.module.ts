import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ComponentsModule } from './components/components.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ReactiveFormsModule  } from '@angular/forms';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    AuthenticationModule,
    ComponentsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    FormsModule,
    FilterPipeModule,
    ReactiveFormsModule
  ]
})
export class CoreModule { }
