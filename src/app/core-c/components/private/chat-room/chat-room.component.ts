import { ChatService } from './../../../services/chats/chat.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  // Arreglo para el listado de chats
  chatsList = [];
  // Arreglo para el listado de chats
  // Arreglo para el listado de contactos
  contactList = [];
  // Arreglo para el listado de contactos
  // Variable global para extraer los datos del usuario
  userData: any;
  // Variable global para extraer los datos del usuario
  // Variable para la referencia del modal
  modalReference: BsModalRef;
  // Variable para la referencia del modal
  // Variable para el formulario del chat
  chatForm: FormGroup;
  // Variable para el formulario del chat
  // Variable para extraer el codigo del chat
  codeExtractor: any;
  // Variable para extraer el codigo del chat
  // Objeto para mostrar la informacion del modal
  modalData = {
    modalTitle: null,
    modalIcon: null,
    modalDescription: null,
  };
  // Objeto para mostrar la informacion del modal
  // Arreglo para el listado de mensajes
  messageList = [];
  // Arreglo para el listado de mensajes
  panelOpenState = false;
  constructor(private router: Router, private userAuth: AngularFireAuth, private chatService: ChatService,
              private modalService: BsModalService, private realtimeDatabase: AngularFireDatabase, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // Inicializando formulario
    this.chatForm = this.formBuilder.group({
      message: ['', [Validators.required]],
    })
    // Inicializando formulario
    // Extrayendo datos del usuario
    this.userAuth.auth.onAuthStateChanged((returnedData) => {
      if (returnedData) {
        this.userData = returnedData;
      }
    });
    // Extrayendo datos del usuario
    setTimeout(() => {
      this.getMessages();
      // Consumiendo datos del servicio
      this.chatService.returnContacts().subscribe((returnedData: []) => {
        const myPosition = returnedData.map((positionData: any) => {return positionData.id;}).indexOf(this.userData.uid);
        returnedData.splice(myPosition, 1);
        this.contactList = returnedData;
      });
      // Consumiendo datos del servicio
    }, 1200);
  }

  // Funcion para obtener la lista de chats de un usuario
  getMessages() {
    // Extrayendo id del usuario
    const userId = this.userData.uid;
    // Extrayendo id del usuario
    const subscriber = this.chatService.returnMessages(userId);
    this.chatsList = [];
    subscriber.subscribe((returnedData: any) =>   {
      const lastPosition = returnedData.length - 1;
      returnedData.splice(lastPosition, 1);
      const listOfCodes = returnedData;
      for (let index = 0; index < listOfCodes.length; index++) {
        const element = listOfCodes[index].chatId;
        this.chatService.bigFilter(element).subscribe((returnedSecondData: any) => {
          console.log(returnedSecondData);
          this.chatsList.push(returnedSecondData);
        })
      }
      // returnedData.sort((a, b) => (a.lastChatWrote > b.lastChatWrote) ? 1: -10);
      // this.chatsList = returnedData;
    })
  }
  // Funcion para obtener la lista de chats de un usuario
  // Funcion para escoger un contacto para chatear
  async selectContact(contact: any) {
    const contactData = contact;
    const chatId = this.realtimeDatabase.createPushId();
    const lastWrote = new Date().getTime();
    
    await this.realtimeDatabase.database.ref('businessChat/chats/' + chatId + '/').set({
      chatId: chatId,
      timeStamp: lastWrote,
      contactName: contactData.name,
      myName: this.userData.displayName,
      contactId: contactData.id,
      senderId: this.userData.uid,
      messages: 'Aqui van los mensajes de los usuarios de este chat'
    }).then(async () => {
      this.modalReference.hide();
      await this.realtimeDatabase.database.ref('businessChat/users/' + this.userData.uid + '/chats/' + chatId + '/').set({
        chatId: chatId,
      }).then(async () => {
        await this.realtimeDatabase.database.ref('businessChat/users/' + contactData.id + '/chats/' + chatId + '/').set({
          chatId: chatId,
        }).then(() => {
          this.modalReference.hide();
        })
      })
    })
    // await this.realtimeDatabase.database.ref('businessChat/users/' + this.userData.uid + '/chats/' + chatId + '/').set({
    //   chatId: chatId,
    //   timeStamp: lastWrote,
    //   contactName: contactData.name,
    //   contactId: contactData.id,
    //   messages: 'Aqui van los mensajes de los usuarios de este chat'
    // }).then(() => {
    //   this.modalReference.hide();
    // })
  }
  // Funcion para escoger un contacto para chatear
  // Funcion para mostar el modal de eliminar chat
  showDeleteModal(deleteModal: TemplateRef<any>, chat) {
    this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_throw_away_ldjd.svg';
    this.modalData.modalTitle = 'Eliminar chat';
    this.modalData.modalDescription = 'Al presionar eliminar usted estará removiendo de forma permanente el chat de ' + chat.contactName + ' de la lista.'
    this.modalReference = this.modalService.show(deleteModal);
  }
  // Funcion para mostar el modal de eliminar chat
  // Funcion para mostrar el modal de contactos
  showContactModal(contactModal: TemplateRef<any>) {
    this.modalReference = this.modalService.show(contactModal);
  }
  // Funcion para mostrar el modal de contactos
  // Funcion para eliminar un chat
  async deleteChat(chat) {
    const chatCode = chat.chatId;
    await this.realtimeDatabase.database.ref('businessChat/users/' + this.userData.uid + '/chats/' + chatCode + '/').remove().then(() => {
      this.modalReference.hide();
    })
  }
  // Funcion para eliminar un chat
  // Funcion para mostrar los detalles de un chat\
  showDetails(chat: any) {
    console.log(chat[0]);
    this.messageList = [];
    const resultMessage = chat[0].messages;
    const currentMessaages = Object.values(resultMessage).splice(0, 1);
    if (resultMessage != 'Aqui van los mensajes de los usuarios de este chat') {
      const messageArray = Object.values(resultMessage);
      this.messageList = messageArray;
    }
    // currentMessaages.splice(0, 1);
    // this.messageList = currentMessaages;
    // console.log(currentMessaages);
    this.codeExtractor = chat[0];
  }
  // Funcion para mostrar los detalles de un chat
  // Funcion para enviar un mensaje
  async sendMessage() {
    // Extrayendo datos del formulario
    const message = this.chatForm.value.message;    
    // Extrayendo datos del formulario
    const messageId = this.realtimeDatabase.createPushId();
    this.chatsList = [];
    await this.realtimeDatabase.database.ref('businessChat/chats/' + this.codeExtractor.chatId + '/messages/' + messageId + '/').set({
      messageBody: message,
      contactId: this.codeExtractor.contactId,
      senderId: this.userData.uid,
      senderName: this.userData.displayName,
      contactName: this.codeExtractor.contactName,
      timeStamp: new Date().getTime(),
    }).then(() => {
      this.getMessages();
      console.log(this.chatsList);
      this.chatForm.reset();
    });
  }
  // Funcion para enviar un mensaje
  SesionFin () {
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
          window.location.href = "/home";
      }
  });
}
}
