import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private database: AngularFireDatabase) { }
  // Metodo para retornar el obejto del usuario
  public returnUserObject(userId) {
    return this.database.object<any>('sa_empresas/' + userId + '/').valueChanges();
  }
  // Metodo para retornar el obejto del usuario
}
