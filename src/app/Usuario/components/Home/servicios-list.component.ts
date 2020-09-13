import { Validators } from '@angular/forms';
import { LocationService } from "./../../authentication/locations/location.service";
import { Component, OnInit } from '@angular/core';
import { CrudService } from '../shared/crud.service';
import { Servicio } from './../shared/servicios';
import { Usuario } from "./../../../Cliente/components/shared/usuario";

import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-servicios-list',
  templateUrl: './servicios-list.component.html',
  styleUrls: ['./servicios-list.component.css']
})
export class ListaServiciosComponent implements OnInit {
  categoriaLocation = [];
  Filter: any = {serv_nombre: '', fecha: ''};
  Select: any = { categoria: '' };

  p: number = 1;
  Servicio: Servicio[];
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  userData: any;
  datos = [];
  categoriesForm: FormGroup;

  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService,
    private Services: LocationService,
    private FormBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.Services.GetCategoria().subscribe((returnedData) => {
    console.log(returnedData);
    this.categoriaLocation = returnedData;
    //cargar información del arreglo  para categoria//
    })
    this.categoriesForm = this.FormBuilder.group({
      category: ['', [Validators.required]],
    })
    let usuariosApp = this.crudApi.datosUsuarios();
    usuariosApp.snapshotChanges().subscribe((res) => {
      this.datos = [];
      res.forEach((item) => {
        if (item.key == firebase.auth().currentUser.uid) {
          let a = item.payload.toJSON();
          console.log(a);
          this.datos.push(a as Usuario);
        }
      });
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
onSelect(){
  const category = this.categoriesForm.value.category;
  console.log(category);
  this.Services.getCategoriaFiltro(category).subscribe((returnedData: []) => {
    console.log(returnedData);
    this.Servicio = [];
    this.Servicio = returnedData;
  })
  
}
}
