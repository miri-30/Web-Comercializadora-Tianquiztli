import { Component, OnInit, TemplateRef } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { environment } from "../../../../environments/environment";
import { LocationService } from "../locations/location.service";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import * as firebase from "firebase";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  // Variable para el formulario de registro
  registerForm: FormGroup;
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
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  downloadURL: any;
  // Objeto para mostrar la informacion del modal
  // Variable para validar el registro
  registerSuccess = false;
  // Variable para validar el registro
  //Variable para obtener los datos de la ubicación//
  latitude: any;
  longitude: any;

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
      cli_nombre: ["", [Validators.required, Validators.minLength(2)]],
      cli_app: ["", [Validators.required, Validators.minLength(2)]],
      cli_apm: ["", [Validators.required, Validators.minLength(2)]],
      cli_usuario: ["", [Validators.required]],
      cli_check: ["", [Validators.required]],
      cli_img: ["", [Validators.required]],
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

    navigator.geolocation.getCurrentPosition((returedData) => {
      this.latitude = returedData.coords.latitude;
      this.longitude = returedData.coords.longitude;
      const latitude = returedData.coords.latitude;
      const longitude = returedData.coords.longitude;
      mapboxgl.accessToken = environment.mapAccessToken;
      const map = new mapboxgl.Map({
        container: "mapContainer",
        style: "mapbox://styles/mapbox/streets-v11",
        zoom: 17,
        center: [longitude, latitude],
      });
      const size = 100;
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd: function () {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },
        render: function () {
          const duration = 1000;
          const t = (performance.now() % duration) / duration;
          const radius = (size / 2) * 0.3;
          const outerRadius = (size / 2) * 0.7 * t + radius;
          const context = this.context;
          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = "rgba(8, 71, 209," + (1 - t) + ")";
          context.fill();
          // draw outer circle
          // draw inner circle
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = "rgba(8, 71, 209, 1)";
          context.strokeStyle = "white";
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();
          // draw inner circle
          // update this image's data with data from the canvas
          this.data = context.getImageData(0, 0, this.width, this.height).data;
          // keep the map repainting
          map.triggerRepaint();
          // return `true` to let the map know that the image was updated
          return true;
        },
      };
      map.on("load", function () {
        map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });
        map.addLayer({
          id: "points",
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                  },
                },
              ],
            },
          },
          layout: {
            "icon-image": "pulsing-dot",
          },
        });
      });
    });
  }

  get cli_nombre() {
    return this.registerForm.get("cli_nombre");
  }
  get cli_app() {
    return this.registerForm.get("cli_app");
  }
  get cli_apm() {
    return this.registerForm.get("cli_apm");
  }
  get cli_usuario() {
    return this.registerForm.get("cli_usuario");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get email() {
    return this.registerForm.get("email");
  }
  get cli_check() {
    return this.registerForm.get("cli_check");
  }
  get cli_img() {
    return this.registerForm.get("cli_img");
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
    const cli_nombre = this.registerForm.value.cli_nombre;
    const cli_app = this.registerForm.value.cli_app;
    const cli_apm = this.registerForm.value.cli_apm;
    const cli_usuario = this.registerForm.value.cli_usuario;
    const password = this.registerForm.value.password;
    const email = this.registerForm.value.email;
    const cli_check = this.registerForm.value.cli_check;
    const cli_img = this.registerForm.value.cli_img;
    const user = firebase.auth().currentUser;
    const fecha = this.dateActuality();
    // Extrayendo datos del formulario
    // Creando usuarios
    var name = this.selectedImage.name;
    const fileRef = this.storage.ref(name);
    this.storage
      .upload(name, this.selectedImage)
      .snapshotChanges()
      .pipe(
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
                    displayName: cli_nombre,
                  });
                  console.log(userData);
                });
                // Actualizando objeto del usuario
                // Creando registro del usuario en la base de datos
                const registerDate = Date.now();
                const userId = this.userAuth.auth.currentUser.uid;
                this.realtimeDatabase.database
                  .ref("sa_clientes/" + userId + "/")
                  .set({
                    lat: this.latitude,
                    lng: this.longitude,
                    cli_nombre: cli_nombre,
                    email: email,
                    password: password,
                    cliUid: userId,
                    cli_app: cli_app,
                    cli_apm: cli_apm,
                    cli_usuario: cli_usuario,
                    cli_check: cli_check,
                    cli_imag: this.downloadURL,
                    // user: user,
                    fecha: fecha,
                  });
                // Creando registro del usuario en la base de datos
                // Validando correo del usuario
                this.userAuth.auth.currentUser.sendEmailVerification();
                // Validando correo del usuario
                // Avisando a los usuarios sobre un registro exitoso
                this.modalData.modalIcon =
                  // "../../../../../assets/ilustrations/undraw_done_a34v.svg";
                  this.modalData.modalTitle = "¡Registro exitoso!";
                this.modalData.modalDescription =
                  "Gracias por registrarte " +
                  cli_nombre +
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
                    this.modalData.modalDescription =
                      "Dirección de correo invalida";
                    setTimeout(() => {
                      this.modalReference = this.modalService.show(
                        registerModal
                      );
                    }, 500);
                    break;
                  case "auth/email-already-in-use":
                    this.modalData.modalIcon =
                      // "../../../../../assets/ilustrations/undraw_cancel_u1it.svg";
                      this.modalData.modalTitle = "Error de autenticación";
                    this.modalData.modalDescription =
                      "La direccion de correo especificada esta vinculada a otra cuenta";
                    setTimeout(() => {
                      this.modalReference = this.modalService.show(
                        registerModal
                      );
                    }, 500);
                    break;
                  case "auth/operation-not-allowed":
                    this.modalData.modalIcon =
                      // "../../../../../assets/ilustrations/undraw_cancel_u1it.svg";
                      this.modalData.modalTitle = "Error de autenticación";
                    this.modalData.modalDescription =
                      "La operacion de registro ha sido deshabilitada";
                    setTimeout(() => {
                      this.modalReference = this.modalService.show(
                        registerModal
                      );
                    }, 500);
                    break;
                  case "auth/weak-password":
                    this.modalData.modalIcon =
                      // "../../../../../assets/ilustrations/undraw_cancel_u1it.svg";
                      this.modalData.modalTitle = "Error de autenticación";
                    this.modalData.modalDescription = "Contraseña débil";
                    setTimeout(() => {
                      this.modalReference = this.modalService.show(
                        registerModal
                      );
                    }, 500);
                    break;
                }
              });
          });
        })
      )
      .subscribe();
    // Este bloque de codigo se ejecutara en caso de un error
  }
  // Funcion para crear un usuario en la plataforma
  // Funcion para ir al login
  continuousFunction() {
    if (this.registerSuccess === true) {
      this.modalReference.hide();
      this.router.navigate(["/view-usuarios"]);
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
