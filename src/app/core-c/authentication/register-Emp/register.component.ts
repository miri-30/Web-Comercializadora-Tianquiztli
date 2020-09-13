import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import * as mapboxgl from "mapbox-gl";
import { GeoJson, FeatureCollection } from "./map";
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
  clickMessage = "";
  onClickMe() {
    this.clickMessage = "{phoneNumber}";
  }
  /// default settings
  map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/outdoors-v9";
  lat = 0;
  lng = 0;
  message = "";
  // data
  source: any;
  markers: any;
  marker = new mapboxgl.Marker();
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
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userAuth: AngularFireAuth,
    private realtimeDatabase: AngularFireDatabase,
    private modalService: BsModalService,
    private location: Location,
    private storage: AngularFireStorage
  ) {
    mapboxgl.accessToken = environment.mapAccessToken;
  }

  ngOnInit() {
    this.imgSrc = "/assets/img/File-Uploader.png";
    // Inicializando formulario
    this.registerForm = this.formBuilder.group({
      emp_nom: ["", [Validators.required, Validators.minLength(2)]],
      emp_desc: ["", [Validators.required, Validators.minLength(2)]],
      emp_rfc: [
        "",
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13),
        ],
      ],
      emp_numSede: ["", [Validators.required, Validators.minLength(1)]],
      emp_check: ["", [Validators.required]],
      emp_img: ["", [Validators.required]],
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

    this.markers = this.getMarkers();
    this.initializeMap();
  }

  public initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat],
        });
      });
    }
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: "map",
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
    });
    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.FullscreenControl());
    // Add geolocate control to the map.
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    //// Add Marker on Click
    this.map.on("click", (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat];
      const newMarker = new GeoJson(coordinates);
      this.createMarker(newMarker);
    });

    var size = 100;

    var pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      render: function () {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
        context.fill();

        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 100, 100, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();
        this.data = context.getImageData(0, 0, this.width, this.height).data;
        // this.map.triggerRepaint();
        return true;
      },
    };

    /// Add realtime firebase data on map load
    this.map.on("load", (event) => {
      /// register source
      this.map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

      this.map.addSource("firebase", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      /// get source
      this.source = this.map.getSource("firebase");

      /// subscribe to realtime database and set data source
      this.markers.subscribe((markers) => {
        let data = new FeatureCollection(markers);
        this.source.setData(data);
      });

      /// create map layers with realtime data
      this.map.addLayer({
        id: "firebase",
        source: "firebase",
        type: "symbol",
        layout: {
          "text-field": " ",
          "text-size": 20,
          "text-transform": "uppercase",
          "icon-image": "pulsing-dot",
          "text-offset": [0, 1.5],
        },
        paint: {
          "text-color": "#FF0000",
          "text-halo-color": "#fff",
          "text-halo-width": 1,
        },
      });
    });
  }

  get emp_nom() {
    return this.registerForm.get("emp_nom");
  }
  get emp_desc() {
    return this.registerForm.get("emp_desc");
  }
  get emp_rfc() {
    return this.registerForm.get("emp_rfc");
  }
  get emp_numSede() {
    return this.registerForm.get("emp_numSede");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get email() {
    return this.registerForm.get("email");
  }
  get emp_check() {
    return this.registerForm.get("emp_check");
  }
  get emp_img() {
    return this.registerForm.get("emp_img");
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

  remove(marker) {
    this.removeMarker(marker.$key);
  }

  removeMarker($key) {
    return this.realtimeDatabase
      .object("/sa_empresa/connectedUser" + $key)
      .remove();
  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates,
    });
  }

  getMarkers() {
    return this.realtimeDatabase
      .list("/sa_empresa/connectedUser")
      .valueChanges();
  }

  createMarker(data: GeoJson) {
    return this.realtimeDatabase.list("/ub_empresa/").push(data);
  }

  ResetForm() {
    this.registerForm.reset();
  }

  goBack() {
    this.location.back();
  }
  // Funcion para crear un usuario en la plataforma
  createUser(registerModal: TemplateRef<any>) {
    // Extrayendo datos del formulario
    const emp_nom = this.registerForm.value.emp_nom;
    const emp_desc = this.registerForm.value.emp_desc;
    const password = this.registerForm.value.password;
    const email = this.registerForm.value.email;
    const emp_rfc = this.registerForm.value.emp_rfc;
    const emp_numSede = this.registerForm.value.emp_numSede;
    const emp_img = this.registerForm.value.emp_img;
    const emp_check = this.registerForm.value.emp_check;
    const user = firebase.auth().currentUser;
    const fecha = this.dateActuality();
    // const ub = this.flyTo();
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
              .then(async () => {
                // Validando el registro
                this.registerSuccess = true;
                // Validando el registro
                // Actualizando objeto del usuario
                this.userAuth.auth.onAuthStateChanged((userData) => {
                  userData.updateProfile({
                    displayName: emp_nom,
                  });
                  console.log(userData);
                });
                // Actualizando objeto del usuario
                // Creando registro del usuario en la base de datos
                const registerDate = Date.now();
                const userId = this.userAuth.auth.currentUser.uid;
                await this.realtimeDatabase.database
                  .ref("sa_empresas/" + userId + "/")
                  .set({
                    lat: this.lat,
                    lng: this.lng,
                    emp_nom: emp_nom,
                    emp_desc: emp_desc,
                    emp_rfc: emp_rfc,
                    emp_numSede: emp_numSede,
                    emp_check: emp_check,
                    emp_imag: this.downloadURL,
                    // user: user,
                    fecha: fecha,
                    email: email,
                    password: password,
                    empUid: userId,
                    emp_sedes: "",
                  })
                  .then(() => {
                    this.realtimeDatabase.database
                      .ref("allUsers/" + userId + "/")
                      .set({
                        lat: this.lat,
                        lng: this.lng,
                        emp_nom: emp_nom,
                        emp_desc: emp_desc,
                        emp_rfc: emp_rfc,
                        emp_numSede: emp_numSede,
                        emp_check: emp_check,
                        emp_imag: this.downloadURL,
                        // user: user,
                        fecha: fecha,
                        email: email,
                        password: password,
                        empUid: userId,
                        emp_sedes: "",
                      });
                  });
                // Creando registro del usuario en la base de datos
                // Validando correo del usuario
                this.userAuth.auth.currentUser.sendEmailVerification();
                // Validando correo del usuario
                // Avisando a los usuarios sobre un registro exitoso
                this.modalData.modalIcon = './../../../../assets/ImgAlert/candado.svg';
                this.modalData.modalTitle = "¡Registro exitoso!";
                this.modalData.modalDescription =
                  "Gracias por registrarte " +
                  emp_nom +
                  ", ya puedes acceder a tu cuenta";
                setTimeout(() => {
                  this.modalReference = this.modalService.show(registerModal, {
                    backdrop: 'static',
                    keyboard: false
                  });
                }, 1000);
                // Avisando a los usuarios sobre un registro exitoso
              })
              // Este bloque de codigo se ejecutara en caso de un registro exitoso
              // Este bloque de codigo se ejecutara en caso de un error
              .catch((error) => {
                const errorCodes = error.code;
                switch (errorCodes) {
                  case "auth/invalid-email":
                    this.modalData.modalIcon = './../../../../assets/ImgAlert/a.svg';
                      this.modalData.modalTitle = "Error de autenticación";
                    this.modalData.modalDescription =
                      "Dirección de correo invalida";
                    setTimeout(() => {
                      this.modalReference = this.modalService.show(
                        registerModal, {
                          backdrop: 'static',
                          keyboard: false
                        }
                      );
                    }, 500);
                    break;
                  case "auth/email-already-in-use":
                    this.modalData.modalIcon = './../../../../assets/ImgAlert/a.svg';
                      this.modalData.modalTitle = "Error de autenticación";
                    this.modalData.modalDescription =
                      "La direccion de correo especificada esta vinculada a otra cuenta";
                    setTimeout(() => {
                      this.modalReference = this.modalService.show(
                        registerModal, {
                          backdrop: 'static',
                          keyboard: false
                        }
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
                        registerModal, {
                          backdrop: 'static',
                          keyboard: false
                        }
                      );
                    }, 500);
                    break;
                  case "auth/weak-password":
                    this.modalData.modalIcon =
                    this.modalData.modalIcon = './../../../../assets/ImgAlert/incorrecto.svg';
                      this.modalData.modalTitle = "Error de autenticación";
                    this.modalData.modalDescription = "Contraseña débil";
                    setTimeout(() => {
                      this.modalReference = this.modalService.show(
                        registerModal, {
                          backdrop: 'static',
                          keyboard: false
                        }
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
      this.router.navigate(["/login"]);
    } else {
      this.modalReference.hide();
    }
  }
  // Funcion para ir al login
}
