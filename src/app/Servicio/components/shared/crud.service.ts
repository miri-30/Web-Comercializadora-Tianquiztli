import { Injectable } from "@angular/core";
import { Servicio } from "./servicios";

import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database"; // Firebase modules for Database, Data list and Single object

@Injectable({
  providedIn: "root",
})
export class CrudService {
  serviciosRef: AngularFireList<any>; // Reference to Student data list, its an Observable
  servicioRef: AngularFireObject<any>; // Reference to Student object, its an Observable too

  empresas: AngularFireList<any>;
  empresa: AngularFireObject<any>;
  // Inject AngularFireDatabase Dependency in Constructor
  constructor(private db: AngularFireDatabase) {}

  AddServicio(servi: Servicio) {
    this.serviciosRef.push({
      serv_nombre: servi.serv_nombre,
      serv_descripcion: servi.serv_descripcion,
      serv_costo: servi.serv_costo,
      categoria: servi.categoria,
      fecha: servi.fecha,
      servUid: servi.servUid,
      serv_img: servi.serv_img,
      empl_nombre: servi.empl_nombre,
    });
  }

  GetServicio(id: string) {
    this.servicioRef = this.db.object("sa_servicios/" + id);
    return this.servicioRef;
  }

  GetServiciosList() {
    this.serviciosRef = this.db.list("sa_servicios");
    return this.serviciosRef;
  }

  UpdateServicio(servi: Servicio) {
    this.servicioRef.update({
      serv_nombre: servi.serv_nombre,
      serv_descripcion: servi.serv_descripcion,
      serv_costo: servi.serv_costo,
      categoria: servi.categoria,
      fecha: servi.fecha,
      servUid: servi.servUid,
      serv_img: servi.serv_img,
      empl_nombre: servi.empl_nombre,
    });
  }

  DeleteServicio(id: string) {
    this.servicioRef = this.db.object("sa_servicios/" + id);
    this.servicioRef.remove();
  }

  ViewServicio(servi: Servicio) {
    this.servicioRef.update({
      serv_nombre: servi.serv_nombre,
      serv_descripcion: servi.serv_descripcion,
      serv_costo: servi.serv_costo,
      categoria: servi.categoria,
      fecha: servi.fecha,
      servUid: servi.servUid,
      serv_img: servi.serv_img,
      empl_nombre: servi.empl_nombre,
    });
  }

  datosEmpresas() {
    this.empresas = this.db.list("sa_empresas/");
    return this.empresas;
  }

}
