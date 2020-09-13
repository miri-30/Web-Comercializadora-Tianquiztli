import { Injectable } from "@angular/core";
import { Empleado } from "./empleados"; // Student data type interface class
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database"; // Firebase modules for Database, Data list and Single object

@Injectable({
  providedIn: "root",
})
export class CrudService {
  empleadosRef: AngularFireList<any>;
  empleadoRef: AngularFireObject<any>;
  empresas: AngularFireList<any>;
  empresa: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase) {}

  AddEmpleado(emplead: Empleado) {
    this.empleadosRef.push({
      empl_nombre: emplead.empl_nombre,
      empl_email: emplead.empl_email,
      empl_telefono: emplead.empl_telefono,
      emplUid: emplead.emplUid,
      fecha: emplead.fecha,
      empl_img: emplead.empl_img,
    });
  }

  GetEmpleado(id: string) {
    this.empleadoRef = this.db.object("sa_empleados/" + id);
    return this.empleadoRef;
  }

  GetEmpleadosList() {
    this.empleadosRef = this.db.list("sa_empleados");
    return this.empleadosRef;
  }

  UpdateEmpleado(emplead: Empleado) {
    this.empleadoRef.update({
      empl_nombre: emplead.empl_nombre,
      empl_email: emplead.empl_email,
      empl_telefono: emplead.empl_telefono,
      emplUid: emplead.emplUid,
      fecha: emplead.fecha,
      empl_img: emplead.empl_img,
    });
  }

  DeleteEmpleado(id: string) {
    this.empleadoRef = this.db.object("sa_empleados/" + id);
    this.empleadoRef.remove();
  }

  datosEmpresas() {
    this.empresas = this.db.list("sa_empresas/");
    return this.empresas;
  }
  public getFilteredEmployees(businessId) {
    return this.db.list('sa_empleados/', data => data.orderByChild('businessId').equalTo(businessId)).valueChanges();
  }
}
