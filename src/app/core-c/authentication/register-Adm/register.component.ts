import {
  Component,
  OnInit,
  TemplateRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import * as mapboxgl from "mapbox-gl";
import { environment } from "../../../../environments/environment";
import { LocationService } from "../locations/location.service";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Location } from "@angular/common";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import * as firebase from "firebase";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  modalReference: BsModalRef;
  modalData = {
    modalTitle: null,
    modalIcon: null,
    modalDescription: null,
  };
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  downloadURL: any;
  registerSuccess = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userAuth: AngularFireAuth,
    private realtimeDatabase: AngularFireDatabase,
    private modalService: BsModalService,
    private location: Location,
    private rotuer: Router,
    private realtimeDatebase: AngularFireDatabase,
    private Service: LocationService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.imgSrc = "/assets/img/File-Uploader.png";
    // Inicializando formulario
    this.registerForm = this.formBuilder.group({
      adm_nombre: ["", [Validators.required, Validators.minLength(3)]],
      adm_img: ["", [Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(12),
        ],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ],
      ],
    });
    // Inicializando formulario
  }
  get adm_nombre() {
    return this.registerForm.get("adm_nombre");
  }
  get adm_img() {
    return this.registerForm.get("adm_img");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get email() {
    return this.registerForm.get("email");
  }
  dateActuality() {
    var fh = new Date();
    return (
      fh.getDate() +
      "-" +
      (fh.getMonth() + 1) +
      "-" +
      fh.getFullYear() +
      " " +
      fh.getHours() +
      ":" +
      fh.getMinutes()
    );
  }
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = "/assets/img/File-Uploader.png";
      this.selectedImage = null;
    }
  } 
  // Funcion para crear un usuario en la plataforma
  createUser(registerModal: TemplateRef<any>) {
    // Extrayendo datos del formulario
    const adm_nombre = this.registerForm.value.adm_nombre;
    const adm_img = this.registerForm.value.adm_img;
    const password = this.registerForm.value.password;
    const email = this.registerForm.value.email;
    const user = firebase.auth().currentUser;
    const fecha = this.dateActuality();
    // Extrayendo datos del formulario
    // Creando usuarios
    var name = this.selectedImage.name;
    const fileRef = this.storage.ref(name);
    this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
           this.downloadURL = url;
    this.userAuth.auth
      .createUserWithEmailAndPassword(email, password)
      // Creando usuarios
      // Este bloque de codigo se ejecutara en caso de un registro exitoso
      .then(() => {
        // Validando el registro
        this.registerSuccess = true;
        // Validando el registro
        // Actualizando objeto del usuario
        this.userAuth.auth.onAuthStateChanged((userData) => {
          userData.updateProfile({
            displayName: adm_nombre,
          });
          console.log(userData);
        });
        // Actualizando objeto del usuario
        // Creando registro del usuario en la base de datos
        const registerDate = Date.now();
        const userId = this.userAuth.auth.currentUser.uid;
        this.realtimeDatabase.database.ref("sa_administrador/" + userId + "/").set({
          adm_nombre: adm_nombre,
          adm_img: adm_img,
          password: password,
          email: email,
          adm_imag: this.downloadURL,
          user: user,
          fecha: fecha,
          id: userId,
          lastSession: registerDate,
          metadata: {
            defaultData: "Aquí van los metadatos de los chats de los usuarios",
          },
          registerDate: registerDate,
          chats: {
            defaultData: "Aquí van los chats de los usuarios",
          },
        });
        // Creando registro del usuario en la base de datos
        // Validando correo del usuario
        this.userAuth.auth.currentUser.sendEmailVerification();
        // Validando correo del usuario
        // Avisando a los usuarios sobre un registro exitoso
        this.modalData.modalIcon =
          "../../../../../assets/ilustrations/undraw_done_a34v.svg";
        this.modalData.modalTitle = "¡Registro exitoso!";
        this.modalData.modalDescription =
          "Gracias por registrarte " +
          adm_nombre +
          ", ya puedes acceder a tu cuenta";
        setTimeout(() => {
          this.modalReference = this.modalService.show(registerModal);
        }, 1000);
        // Avisando a los usuarios sobre un registro exitoso
      })
      // Este bloque de codigo se ejecutara en caso de un registro exitoso
      // Este bloque de codigo se ejecutara en caso de un error
      .catch((error) => {
        const errorCodes = error.code;
        switch (errorCodes) {
          case "auth/invalid-email":
            this.modalData.modalIcon =
              // "../../../../../assets/ilustrations/undraw_cancel_u1it.svg";
            this.modalData.modalTitle = "Error de autenticación";
            this.modalData.modalDescription = "Dirección de correo invalida";
            setTimeout(() => {
              this.modalReference = this.modalService.show(registerModal);
            }, 500);
            break;
          case "auth/email-already-in-use":
            this.modalData.modalIcon =
              // "../../../../../assets/ilustrations/undraw_cancel_u1it.svg";
            this.modalData.modalTitle = "Error de autenticación";
            this.modalData.modalDescription =
              "La direccion de correo especificada esta vinculada a otra cuenta";
            setTimeout(() => {
              this.modalReference = this.modalService.show(registerModal);
            }, 500);
            break;
          case "auth/operation-not-allowed":
            this.modalData.modalIcon =
              // "../../../../../assets/ilustrations/undraw_cancel_u1it.svg";
            this.modalData.modalTitle = "Error de autenticación";
            this.modalData.modalDescription =
              "La operacion de registro ha sido deshabilitada";
            setTimeout(() => {
              this.modalReference = this.modalService.show(registerModal);
            }, 500);
            break;
          case "auth/weak-password":
            this.modalData.modalIcon =
              // "../../../../../assets/ilustrations/undraw_cancel_u1it.svg";
            this.modalData.modalTitle = "Error de autenticación";
            this.modalData.modalDescription = "Contraseña débil";
            setTimeout(() => {
              this.modalReference = this.modalService.show(registerModal);
            }, 500);
            break;
        }
      });
    })
  })
).subscribe();  
    // Este bloque de codigo se ejecutara en caso de un error
  }
  // Funcion para crear un usuario en la plataforma
  // Funcion para ir al login
  continuousFunction() {
    if (this.registerSuccess === true) {
      this.modalReference.hide();
      this.router.navigate(["/login"]);
    } else {
      this.modalReference.hide();
    }
  }
  // Funcion para ir al login
  ResetForm() {
    this.registerForm.reset();
  }

  goBack() {
    this.location.back();
  }
}
