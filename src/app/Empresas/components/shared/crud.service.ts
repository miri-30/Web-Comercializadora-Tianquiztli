import { Injectable } from '@angular/core';
import { Empresa } from '../shared/student';  // Student data type interface class
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object

@Injectable({
  providedIn: 'root'
})

export class CrudService {
  studentsRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  studentRef: AngularFireObject<any>;   // Reference to Student object, its an Observable too

  usuarios: AngularFireList<any>;
  usuario: AngularFireObject<any>;

  // Inject AngularFireDatabase Dependency in Constructor
  constructor(private db: AngularFireDatabase) { }

  AddStudent(empres: Empresa) {
    this.studentsRef.push({
      emp_nom: empres.emp_nom,
      emp_desc: empres.emp_desc,
      email: empres.email,
      emp_rfc: empres.emp_rfc,
      emp_numSede: empres.emp_numSede,
      // emp_sedes: empres.emp_sedes,
      password: empres.password,
      emp_imag: empres.emp_imag,
      // emp_img: empres.emp_img,
      lat: empres.lat,
      lng: empres.lng,
      empUid: empres.empUid,
      fecha: empres.fecha,
    })
  }

  GetStudent(id: string) {
    this.studentRef = this.db.object('sa_empresas/' + id);
    return this.studentRef;
  }

  GetStudentsList() {
    this.studentsRef = this.db.list('sa_empresas');
    return this.studentsRef;
  }

  UpdateStudent(empres: Empresa) {
    this.studentRef.update({
      emp_nom: empres.emp_nom,
      emp_desc: empres.emp_desc,
      email: empres.email,
      emp_rfc: empres.emp_rfc,
      emp_numSede: empres.emp_numSede,
      // emp_sedes: empres.emp_sedes,
      password: empres.password,
      emp_imag: empres.emp_imag,
      // emp_img: empres.emp_img,
      lat: empres.lat,
      lng: empres.lng,
      empUid: empres.empUid,
      fecha: empres.fecha,
    })
  }

  DeleteStudent(id: string) {
    this.studentRef = this.db.object('sa_empresas/'+id);
    this.studentRef.remove();
  }

  datosUsuarios(){
    this.usuarios = this.db.list('sa_empresas/');
    return this.usuarios;
  }

  async deletePerfil(empUid: string) {
    this.usuario = this.db.object('/sa_empresas/' + empUid);
    this.usuario.remove();
  }

}
