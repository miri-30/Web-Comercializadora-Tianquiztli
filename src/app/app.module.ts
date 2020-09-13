import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Reactive Form Module
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
// Firebase Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import {EmpleadoService} from './Servicio/components/shared/employ.service';
// Router Module
import { AppRoutingModule } from './/app-routing.module';
import { AngularFireStorageModule } from "@angular/fire/storage";
// Toaster for Alert Messages
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
//AppComponent
import { AppComponent } from './app.component';
//Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Module
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { FeaturesModule } from './features/features.module';
// NGX Pagination
import { NgxPaginationModule } from 'ngx-pagination';
//Filter
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterPipeModule } from 'ngx-filter-pipe';
// ------------------------------------------Components-----------------------------------------------
//Cliente
import { ClientesListComponent } from './Cliente/components/clientes-list/clientes-list.component';
import { EditClienteComponent } from './Cliente/components/edit-cliente/edit-cliente.component';
//Empresa
import { EmpresasListComponent } from './Empresas/components/empresas-list/empresas-list.component';
import { EditEmpresaComponent } from './Empresas/components/edit-empresa/edit-empresa.component';
//Empleados
import { EmpleadosListComponent } from './Empleado/components/empleados-list/empleados-list.component';
import { EditEmpleadoComponent } from './Empleado/components/edit-empleado/edit-empleado.component';
//Sede
import { SedesListComponent } from './Sede/components/sedes-list/sedes-list.component';
import { EditSedeComponent } from './Sede/components/edit-sede/edit-sede.component';
//Servicios
import { ServiciosListComponent } from './Servicio/components/servicios-list/servicios-list.component';
import { EditServiciosComponent } from './Servicio/components/edit-servicios/edit-servicios.component';
//import { LoginComponent } from './login/login.component';
import { PerfilEmpComponent } from './perfil-emp/perfil-emp.component';
import { PerfilUserComponent } from './perfil-user/perfil-user.component';
import { SupportEmpComponent } from './support-emp/support-emp.component';
import { SupportUsComponent } from './support-us/support-us.component';
import { SupportGeneralComponent } from './support-general/support-general.component';
import { ActPerfilEmpComponent } from './act-perfil-emp/act-perfil-emp.component';
import { ActPerfilUserComponent } from './act-perfil-user/act-perfil-user.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientesListComponent,
    EditClienteComponent,
    EmpresasListComponent,
    EditEmpresaComponent,
    EditEmpleadoComponent,
    EmpleadosListComponent,
    EditServiciosComponent,
    ServiciosListComponent,
    SedesListComponent,
    EditSedeComponent,
    //LoginComponent,
    PerfilEmpComponent,
    PerfilUserComponent,
    SupportEmpComponent,
    SupportUsComponent,
    SupportGeneralComponent,
    ActPerfilEmpComponent,
    ActPerfilUserComponent,
  ],
  imports: [
    BrowserModule,
    FilterPipeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    AppRoutingModule,
    BrowserAnimationsModule,    // Required animations module for Toastr
    ToastrModule.forRoot({      // Register NgxToast NPM module
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ModalModule.forRoot(),
    CoreModule,
    SharedModule,
    FeaturesModule,
    NgxPaginationModule,  // NGX pagination module
    Ng2SearchPipeModule,
FormsModule,
  ],
  providers: [EmpleadoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
