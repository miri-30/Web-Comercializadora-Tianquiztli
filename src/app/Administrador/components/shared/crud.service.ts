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

  // Inject AngularFireDatabase Dependency in Constructor
  constructor(private db: AngularFireDatabase) {}

  AddServicio(servi: Servicio) {
    this.serviciosRef.push({
      serv_imag: servi.serv_imag,
      serv_nombre: servi.serv_nombre,
      serv_descripcion: servi.serv_descripcion,
      serv_costo: servi.serv_costo,
      serv_categoria: servi.serv_categoria,
      fecha: servi.fecha,
      lat: servi.lat,
      lng: servi.lng,
      servUid: servi.servUid,
      // serv_img: servi.serv_img,
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
      serv_imag: servi.serv_imag,
      serv_nombre: servi.serv_nombre,
      serv_descripcion: servi.serv_descripcion,
      serv_costo: servi.serv_costo,
      serv_categoria: servi.serv_categoria,
      fecha: servi.fecha,
      lat: servi.lat,
      lng: servi.lng,
      servUid: servi.servUid,
      // serv_img: servi.serv_img,
      empl_nombre: servi.empl_nombre,
    });
  }

  DeleteServicio(id: string) {
    this.servicioRef = this.db.object("sa_servicios/" + id);
    this.servicioRef.remove();
  }
}
