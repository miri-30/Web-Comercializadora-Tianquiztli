import { Injectable } from "@angular/core";
import { Usuario } from "../shared/usuario"; // Student data type interface class
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database"; // Firebase modules for Database, Data list and Single object

@Injectable({
  providedIn: "root",
})
export class CrudService {
  usuariosRef: AngularFireList<any>; // Reference to Student data list, its an Observable
  usuarioRef: AngularFireObject<any>; // Reference to Student object, its an Observable too

  usuarios: AngularFireList<any>;
  usuario: AngularFireObject<any>;
  
  // Inject AngularFireDatabase Dependency in Constructor
  constructor(private db: AngularFireDatabase) {}

  AddUsuario(empres: Usuario) {
    this.usuariosRef.push({
      cli_nombre: empres.cli_nombre,
      cli_app: empres.cli_app,
      cli_apm: empres.cli_apm,
      cli_usuario: empres.cli_usuario,
      password: empres.password,
      email: empres.email,
      cli_imag: empres.cli_imag,
      // cli_img: empres.cli_img,
      lat: empres.lat,
      lng: empres.lng,
      cliUid: empres.cliUid,
      fecha: empres.fecha,
    });
  }

  GetUsuario(id: string) {
    this.usuarioRef = this.db.object("sa_clientes/" + id);
    return this.usuarioRef;
  }

  GetUsuariosList() {
    this.usuariosRef = this.db.list("sa_clientes");
    return this.usuariosRef;
  }

  UpdateUsuario(empres: Usuario) {
    this.usuarioRef.update({
      cli_nombre: empres.cli_nombre,
      cli_app: empres.cli_app,
      cli_apm: empres.cli_apm,
      cli_usuario: empres.cli_usuario,
      password: empres.password,
      email: empres.email,
      // cli_img: empres.cli_img,
      cli_imag: empres.cli_imag,
      lat: empres.lat,
      lng: empres.lng,
      cliUid: empres.cliUid,
      fecha: empres.fecha,
    });
  }

  DeleteUsuario(id: string) {
    this.usuarioRef = this.db.object("sa_clientes/" + id);
    this.usuarioRef.remove();
  }

  datosUsuarios(){
    this.usuarios = this.db.list('sa_clientes/');
    return this.usuarios;
  }

  async deletePerfil(cliUid: string) {
    this.usuario = this.db.object('/sa_clientes/' + cliUid);
    this.usuario.remove();
  }
}
