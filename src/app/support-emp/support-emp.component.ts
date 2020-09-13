import { Component, OnInit } from '@angular/core';
import { CrudService } from './../Empresas/components/shared/crud.service';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { Empresa } from "./../Empresas/components/shared/student";

@Component({
  selector: 'app-support-emp',
  templateUrl: './support-emp.component.html',
  styleUrls: ['./support-emp.component.css']
})
export class SupportEmpComponent implements OnInit {
  p: number = 1;
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  datos = [];

  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    let usuariosApp = this.crudApi.datosUsuarios();
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
  }

  dataState() {
    this.crudApi.GetStudentsList().valueChanges().subscribe(data => {
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
  SesionFin () {
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
          window.location.href = "/home";
      }
  });
}
}
