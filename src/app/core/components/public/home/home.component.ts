import { Component, OnInit } from '@angular/core';
import { CrudService } from './../../shared/crud.service';
import { Servicio } from './../../shared/servicios';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  Filter: any = {serv_nombre: ''};
  p: number = 1;
  Servicio: Servicio[];
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  userData: any;
  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService,
    private userAuth: AngularFireAuth,
  ) { }
  
  ngOnInit(): void {
    this.userAuth.auth.onAuthStateChanged((returnedData) => {
      if (returnedData) {
        this.userData = returnedData;
      }
    });

    this.dataState();
    let s = this.crudApi.GetServiciosList(); 
    s.snapshotChanges().subscribe(data => {
      this.Servicio = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.Servicio.push(a as Servicio);
      })
    })
  }

  dataState() {     
    this.crudApi.GetServiciosList().valueChanges().subscribe(data => {
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

  deleteServicio(servic) {
    if (window.confirm('Esta seguro de eliminar la Empresa ' + servic.serv_nombre + '?')) {
      this.crudApi.DeleteServicio(servic.$key)
      this.toastr.error(servic.serv_nombre + ' Eliminado correctamente!');
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