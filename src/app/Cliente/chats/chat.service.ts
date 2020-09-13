import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private realtimeDatabase: AngularFireDatabase, private userAuth: AngularFireAuth,) { }
  // Metodo publico para retornar la lista de contactos
  public returnContacts() {
    return this.realtimeDatabase.list('businessChat/users/').valueChanges();
  }
  // Metodo publico para retornar la lista de contactos

  // Metodo publico para retornar la lista de mensajes
  public returnMessages(userId) {
    return this.realtimeDatabase.list('businessChat/users/' + userId + '/chats/').valueChanges();
    // return this.realtimeDatabase.list('businessChat/chats/' + userId + '/chats/', ref => { return ref.orderByChild ('timeStamp'); }).valueChanges();
    // return this.realtimeDatabase.list('businessChat/chats/', ref => ref.orderByChild('senderId').equalTo(userId)).valueChanges();
  }
  // Metodo publico para retornar la lista de mensajes
  // Metodo para filtro masivo
  public bigFilter(chatCode) {
    return this.realtimeDatabase.list('businessChat/chats/', ref => ref.orderByChild('chatId').equalTo(chatCode)).valueChanges();
  }
  // Metodo para filtro masivo
}
