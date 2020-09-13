import { Component, OnInit } from '@angular/core';
import { CrudService } from '../shared/crud.service';
import { Servicio } from './../shared/servicios';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';

@Component({
  selector: 'app-servicios-list',
  templateUrl: './servicios-list.component.html',
  styleUrls: ['./servicios-list.component.css']
})
export class ListaServiciosComponent implements OnInit {
  Filter: any = {serv_nombre: ''};
  p: number = 1;
  Servicio: Servicio[];
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;

  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService
  ) { }
  
  ngOnInit(): void {
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