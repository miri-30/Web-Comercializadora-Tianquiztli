import { Component, OnInit } from '@angular/core';
import { CrudService } from '../shared/crud.service';
import { Empleado } from './../shared/empleados';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { Empresa } from "./../../../Empresas/components/shared/student";
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-empleados-list',
  templateUrl: './empleados-list.component.html',
  styleUrls: ['./empleados-list.component.css']
})
export class EmpleadosListComponent implements OnInit {
  Filter: any = {empl_nombre: ''};
  p: number = 1;
  Empleado: Empleado[];
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  datos = [];

  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService,
    private userAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    let usuariosApp = this.crudApi.datosEmpresas();
    usuariosApp.snapshotChanges().subscribe((res) => {
      this.datos = [];
      res.forEach((item) => {
        if (item.key == firebase.auth().currentUser.uid) {
          let a = item.payload.toJSON();
          console.log(a);
          this.datos.push(a as Empresa);
        }
      });
    });

    this.dataState();
    const uid = this.userAuth.auth.currentUser.uid;
    this.crudApi.getFilteredEmployees(uid).subscribe((returnedData: any = []) => {
      this.Empleado = returnedData;
    })
    // let s = this.crudApi.GetEmpleadosList();
    // s.snapshotChanges().subscribe(data => {
    //   this.Empleado = [];
    //   data.forEach(item => {
    //     let a = item.payload.toJSON();
    //     a['$key'] = item.key;
    //     this.Empleado.push(a as Empleado);
    //   })
    // })
  }

  dataState() {
    this.crudApi.GetEmpleadosList().valueChanges().subscribe(data => {
      this.preLoader = false;
      if(data.length <= 0){
        this.hideWhenNoStudent = false;
        this.noData = true;
      } else {
        this.hideWhenNoStudent = true;
        this.noData = false;
      }
    })
  }

  deleteEmpleado(emplea) {
    if (window.confirm('Esta seguro de eliminar la Empresa ' + emplea.empl_nombre + '?')) {
      this.crudApi.DeleteEmpleado(emplea.$key)
      this.toastr.error(emplea.empl_nombre + ' Eliminado correctamente!');
    }
  }
  SesionFin () {
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
          window.location.href = "/home";
      }
  });
}
}
