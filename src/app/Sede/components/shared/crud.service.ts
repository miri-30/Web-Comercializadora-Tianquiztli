import { Injectable } from '@angular/core';
import { Sede } from './sedes';  // Student data type interface class
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import { Empresa } from '../../../Cliente/components/shared/student';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class  CrudService {
  sedesRef: AngularFireList<any>;
  sedeRef: AngularFireObject<any>;

  empresas: AngularFireList<any>;
  empresa: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase, private userAuth: AngularFireAuth
  ) { }

  AddSede(emplead: Sede) {
    this.sedesRef.push({
      sed_nombre: emplead.sed_nombre,
      sed_rfc: emplead.sed_rfc,
      sed_email: emplead.sed_email,
      lat: emplead.lat,
      lng: emplead.lng,
      sedUid: emplead.sedUid,
      fecha: emplead.fecha,
      sed_img: emplead.sed_img,
      empUid: emplead.empUid,

    })
  }

  GetSede(id: string) {
    this.sedeRef = this.db.object('sa_sedes/' + id);
    return this.sedeRef;
  }

  GetSedesList() {
    this.sedesRef = this.db.list('sa_sedes/');
    return this.sedesRef;
  }

  public getBranchOffices(businessId) {
    return this.db.list('sa_sedes/', data => data.orderByChild('empUid').equalTo(businessId)).valueChanges();
  }
  UpdateSede(emplead: Sede) {
    this.sedeRef.update({
      sed_nombre: emplead.sed_nombre,
      sed_rfc: emplead.sed_rfc,
      sed_email: emplead.sed_email,
      lat: emplead.lat,
      lng: emplead.lng,
      sedUid: emplead.sedUid,
      fecha: emplead.fecha,
      sed_img: emplead.sed_img,
      empUid: emplead.empUid,

    })
  }

  DeleteSede(id: string) {
    this.sedeRef = this.db.object('sa_sedes/' + id);
    this.sedeRef.remove();
  }

  datosEmpresas() {
    this.empresas = this.db.list("sa_empresas/");
    return this.empresas;
  }

}
