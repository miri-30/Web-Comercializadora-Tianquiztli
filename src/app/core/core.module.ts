import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ComponentsModule } from './components/components.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreRoutingModule,
    AuthenticationModule,
    ComponentsModule
  ]
})
export class CoreModule { }
