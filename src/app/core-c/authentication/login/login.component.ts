import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  // Variable para el formulario de registro
  errorMessage: string;
  loginForm: FormGroup;
  passwordForm: FormGroup;
  // Variable para el formulario de registro
  // Variables para el modal

  modalReference: BsModalRef;
  // Variables para el modal
  // Objeto para mostrar la informacion del modal
  modalData = {
    modalTitle: null,
    modalIcon: null,
    modalDescription: null,
  };
  // Objeto para mostrar la informacion del modal
  // Variable para validar el registro
  loginSuccess = false;
  // Variable para validar el registro

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userAuth: AngularFireAuth,
    private realtimeDatabase: AngularFireDatabase,
    private modalService: BsModalService,
    private location: Location,
    public afAuth: AngularFireAuth,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Inicializando formulario
    this.loginForm = this.formBuilder.group({
      password: ["", [Validators.required]],
      email: ["", [Validators.email]],
    });
    // Inicializando formulario
    // Inicializando formulario de recuperacion de cuentas
    this.passwordForm = this.formBuilder.group({
      userEmail: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ],
      ],
    });
    // Inicializando formulario de recuperacion de cuentas
  }
  get password() {
    return this.loginForm.get("password");
  }
  get email() {
    return this.loginForm.get("email");
  }
  //Fecha
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
  // Funcion para iniciar la sesion del usuario
  async loginUser() {
    // Extrayendo datos del formulario
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    // Extrayendo datos del formulario
    // Iniciando la sesion del usuario
    await this.userAuth.auth
      .signInWithEmailAndPassword(email, password)
      // Este bloque de codigo se ejecutara en caso de un registro exitoso
      .then(async () => {
        const isVerified = this.userAuth.auth.currentUser.emailVerified;
        const name = this.userAuth.auth.currentUser.displayName;
        if (isVerified == true) {
          this.loginSuccess = true;
          this.toastr.success(
            this.loginForm.controls["email"].value +
              " ¡Inicio de sesión exitoso!"
          );

          if (this.loginSuccess === true) {
            firebase.auth().onAuthStateChanged(function (user) {
              if (user) {
                var userID = firebase.auth().currentUser.uid;

                firebase
                  .database()
                  .ref("sa_empresas/" + userID)
                  .once("value")
                  .then(function (snapshot) {
                    if (snapshot.val()) {
                      window.location.href = "/view-empleados";
                    } else {
                    }
                  });

                firebase
                  .database()
                  .ref("sa_clientes/" + userID)
                  .once("value")
                  .then(function (snapshot) {
                    if (snapshot.val()) {
                      window.location.href = "/inicio";
                    } else {
                    }
                  });

                firebase
                  .database()
                  .ref("sa_administrador/" + userID)
                  .once("value")
                  .then(function (snapshot) {
                    if (snapshot.val()) {
                      window.location.href = "/inicioAdm";
                    } else {
                    }
                  });
              }
            });
          }
        } else {
          this.modalData.modalIcon = "./../../../../assets/ImgAlert/cerrar.svg";
          this.modalData.modalTitle = "Error de autenticación";
          this.modalData.modalDescription =
            "Estimado" +
            name +
            ", no has verificado tu correo electrónico, por lo tanto no tienes acceso a tu cuenta";
        }

      })
      // Este bloque de codigo se ejecutara en caso de un registro exitoso
      // Este bloque de codigo se ejecutara en caso de un error
      .catch((error) => {
        const errorCodes = error.code;
        switch (errorCodes) {
          case "auth/invalid-email":
            console.log(errorCodes);
            this.errorMessage = error;
            this.toastr.error(" Dirección de correo electrónico invalido.");
            this.router.navigate(["/auth/signin"]);
            break;
          case "auth/user-disabled":
            console.log(errorCodes);
            this.errorMessage = error;
            this.toastr.error(" Usuario Deshabilitado.");
            this.router.navigate(["/auth/signin"]);
            break;
          case "auth/user-not-found":
            console.log(errorCodes);
            this.errorMessage = error;
            this.toastr.error(" No existe el usuario");
            this.router.navigate(["/auth/signin"]);
            break;
          case "auth/wrong-password":
            console.log(errorCodes);
            this.errorMessage = error;
            this.toastr.error(" Contraseña Incorrecta");
            this.router.navigate(["/auth/signin"]);
            break;
        }
      });
    // Este bloque de codigo se ejecutara en caso de un error
    // Iniciando la sesion del usuario
  }
  // Funcion para iniciar la sesion del usuario
  // Funcion para recuperar la contraseña
  async recoverPassword() {
    // Extrayendo datos del formulario de recuperacion de cuentas
    const emailToRecover = this.passwordForm.value.userEmail;
    // Extrayendo datos del formulario de recuperacion de cuentas
    // Enviando enlace
    await this.userAuth.auth
      .sendPasswordResetEmail(emailToRecover)
      // Enviando enlace
      // Cerrando el modal
      .then(() => {
        this.modalReference.hide();
      });
    // Cerrando el modal
  }
  // Funcion para recuperar la contraseña
  showPasswordModal(passwordModal: TemplateRef<any>) {
    (this.modalData.modalIcon =
      "../../../../../assets/ilustrations/undraw_authentication_fsn5.png"),
      (this.modalData.modalTitle = "Recuperación de cuentas"),
      (this.modalData.modalDescription =
        "Introduzca la dirección de correo electrónico vinculada a su cuenta, luego enviaremos un enlace de recuperación");
    setTimeout(() => {
      this.modalReference = this.modalService.show(passwordModal, {
        backdrop: "static",
        keyboard: false,
      });
    }, 600);
  }

  async loginGoogle() {
    const provider = new auth.GoogleAuthProvider();
    await this.afAuth.auth.signInWithPopup(provider).then((userData) => {
      this.router.navigate(["/view-empleados"]);
    });
  }

  goBack() {
    this.location.back();
  }
}
