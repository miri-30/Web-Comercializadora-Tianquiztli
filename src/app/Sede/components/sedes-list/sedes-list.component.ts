import { Component, OnInit } from '@angular/core';
import { CrudService } from '../shared/crud.service';
import { Sede } from './../shared/sedes';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { Empresa } from "./../../../Empresas/components/shared/student";

@Component({
  selector: 'app-sedes-list',
  templateUrl: './sedes-list.component.html',
  styleUrls: ['./sedes-list.component.css']
})
export class SedesListComponent implements OnInit {
  Filter: any = { sed_nombre: '' };
  p: number = 1;
  Sede: Sede[];
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  datos = [];

  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService
  ) { 
    let usuariosApp = this.crudApi.datosEmpresas();
    usuariosApp.snapshotChanges().subscribe((res) => {
      this.datos = [];
      res.forEach((item) => {
        if (item.key == firebase.auth().currentUser.uid) {
          let a = item.payload.toJSON();
          console.log('Usuario',a);
          this.datos.push(a as Empresa);
        }
      });
    });
  }

  ngOnInit(): void {
    this.dataState();
    let s = this.crudApi.GetSedesList();
    s.snapshotChanges().subscribe(data => {
      this.Sede = [];
      data.forEach(item => {
          let a = item.payload.toJSON();
        a['$key'] = item.key;
        console.log('Sede',a);
        this.Sede.push(a as Sede);        
      })
    })
  }

  dataState() {
    this.crudApi.GetSedesList().valueChanges().subscribe(data => {
      this.preLoader = false;
      if (data.length <= 0) {
        this.hideWhenNoStudent = false;
        this.noData = true;
      } else {
        this.hideWhenNoStudent = true;
        this.noData = false;
      }
    })
  }

  deleteSede(emplea) {
    if (window.confirm('Esta seguro de eliminar la Sede ' + emplea.sed_nombre + '?')) {
      this.crudApi.DeleteSede(emplea.$key)
      this.toastr.error(emplea.sed_nombre + ' Eliminado correctamente!');
    }
  }
  SesionFin() {
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
        window.location.href = "/home";
      }
    });
  }
}
