import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesListComponent } from './Cliente/components/clientes-list/clientes-list.component';
import { EditClienteComponent } from './Cliente/components/edit-cliente/edit-cliente.component';

import { EmpresasListComponent } from './Empresas/components/empresas-list/empresas-list.component';
import { EditEmpresaComponent } from './Empresas/components/edit-empresa/edit-empresa.component';

import { EmpleadosListComponent } from './Empleado/components/empleados-list/empleados-list.component';
import { EditEmpleadoComponent } from './Empleado/components/edit-empleado/edit-empleado.component';

import { SedesListComponent } from './Sede/components/sedes-list/sedes-list.component';
import { EditSedeComponent } from './Sede/components/edit-sede/edit-sede.component';

import { ServiciosListComponent } from './Servicio/components/servicios-list/servicios-list.component';
import { EditServiciosComponent } from './Servicio/components/edit-servicios/edit-servicios.component';

import { PerfilEmpComponent } from './perfil-emp/perfil-emp.component';
import { PerfilUserComponent } from './perfil-user/perfil-user.component';

import { SupportGeneralComponent } from './support-general/support-general.component';
import { SupportUsComponent } from './support-us/support-us.component';
import { SupportEmpComponent } from './support-emp/support-emp.component';
import { ActPerfilEmpComponent } from './act-perfil-emp/act-perfil-emp.component';
import { ActPerfilUserComponent } from './act-perfil-user/act-perfil-user.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./core/components/public/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./core-c/authentication/login/login.module').then(m => m.LoginModule) },
  { path: 'registroPrinU', loadChildren: () => import('./core-c/authentication/register/register.module').then(m => m.RegisterModule) },
  { path: 'registroPrinE', loadChildren: () => import('./core-c/authentication/register-Emp/register.module').then(m => m.RegisterModule) },
  { path: 'registroPrinA', loadChildren: () => import('./core-c/authentication/register-Adm/register.module').then(m => m.RegisterModule) },
  { path: 'chatRoom', loadChildren: () => import('./core-c/components/private/chat-room/chat-room.module').then(m => m.ChatRoomModule) },
  { path: 'support-g', component: SupportGeneralComponent },



  //-----------------------------------------------------Usuario---------------------------------------------------------------------------
  { path: 'inicio', loadChildren: () => import('./Usuario/components/Home/servicios.module').then(m => m.ServicioModule) },
  { path: 'perfilU', component: PerfilUserComponent },
  { path: 'Act-perfilU/:id', component: ActPerfilUserComponent },
  { path: 'support-u', component: SupportUsComponent },

  {
    path: 'view-servicios/:id',
    loadChildren: () => import('./Usuario/components/view-servicios/view-servicios.module').then( m => m.ViewServiciosPageModule)
  },
//--------------------------------------------------------Administrador--------------------------------------------------------------------
{ path: 'inicioAdm', loadChildren: () => import('./Administrador/components/Home/servicios.module').then(m => m.ServicioModule) },
  //Cliente
  { path: 'registroUser', loadChildren: () => import('./Cliente/components/home/home.module').then(m => m.HomeModule) },
  { path: 'view-usuarios', component: ClientesListComponent },
  { path: 'edit-usuario/:id', component: EditClienteComponent },
  //Empresa
  { path: 'registroEmpr', loadChildren: () => import('./Empresas/components/home/home.module').then(m => m.HomeModule) },
  { path: 'view-empresas', component: EmpresasListComponent },
  { path: 'edit-empresa/:id', component: EditEmpresaComponent },

  //-----------------------------------------------------Empresa---------------------------------------------------------------------------
  { path: 'perfilE', component: PerfilEmpComponent },
  { path: 'Act-perfilE/:id', component: ActPerfilEmpComponent },
  { path: 'support-e', component: SupportEmpComponent },
  // Empleado
  { path: 'registroEmpl', loadChildren: () => import('./Empleado/components/home/home.module').then(m => m.HomeModule) },
  { path: 'view-empleados', component: EmpleadosListComponent },
  { path: 'edit-empleado/:id', component: EditEmpleadoComponent },

    //Sede
  { path: 'registroSede', loadChildren: () => import('./Sede/components/home/home.module').then(m => m.HomeModule) },
  { path: 'view-sedes', component: SedesListComponent },
  { path: 'edit-sede/:id', component: EditSedeComponent },

    //Servicio
  { path: 'registroServ', loadChildren: () => import('./Servicio/components/home/home.module').then(m => m.HomeModule) },
  { path: 'view-servicios', component: ServiciosListComponent },
  { path: 'edit-servicio/:id', component: EditServiciosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
