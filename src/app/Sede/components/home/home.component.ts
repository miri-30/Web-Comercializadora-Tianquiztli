import { Component, OnInit, TemplateRef } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { environment } from "../../../../environments/environment";
import { LocationService } from "../locations/location.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireDatabase } from "@angular/fire/database";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import { Location } from "@angular/common";
import { AngularFireStorage } from "@angular/fire/storage";
import { AuthenticationService } from 'src/app/core-c/services/authentication/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  //Variable para obtener los datos de la ubicación//
  latitude: any;
  longitude: any;
  //Variable para obtener los datos de la ubicación//
  // Formulario
  agregarInfo: FormGroup;
  // Formulario
  // Referencia del modal
  modalReference: BsModalRef;
  // Referencia del modal
  // Objeto para mostrar la informacion del modal
  modalData = {
    modalTitle: null,
    modalIcon: null,
    modalDescription: null,
  };
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  numberOfSedes: any;
  downloadURL: any;
  locationModal: TemplateRef<any>
  // Objeto para mostrar la informacion del modal
  constructor(
    private rotuer: Router,
    private formBuilder: FormBuilder,
    private realtimeDatebase: AngularFireDatabase,
    private modalService: BsModalService,
    private Service: LocationService,
    private location: Location,
    private storage: AngularFireStorage,
    private authServie: AuthenticationService,
    private userAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    // this.imgSrc = "/assets/img/File-Uploader.png";
    //inicializacion formulario
    this.agregarInfo = this.formBuilder.group({
      sed_nombre: ["", [Validators.required, Validators.minLength(3)]],
      sed_rfc: [
        "",
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13),
        ],
      ],
      sed_email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ],
      ],
      sed_img: ["", [Validators.required]],
    });
    navigator.geolocation.getCurrentPosition((returedData) => {
      this.latitude = returedData.coords.latitude;
      this.longitude = returedData.coords.longitude;
      const latitude = returedData.coords.latitude;
      const longitude = returedData.coords.longitude;
      mapboxgl.accessToken = environment.mapAccessToken;
      const map = new mapboxgl.Map({
        container: "mapContainer",
        style: "mapbox://styles/mapbox/streets-v11",
        zoom: 15,
        center: [longitude, latitude],
      });
      const size = 50;
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
  get sed_nombre() {
    return this.agregarInfo.get("sed_nombre");
  }
  get sed_rfc() {
    return this.agregarInfo.get("sed_rfc");
  }
  get sed_email() {
    return this.agregarInfo.get("sed_email");
  }
  get sed_img() {
    return this.agregarInfo.get("sed_img");
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

  validationFunction(locationModal: TemplateRef<any>) {
    if (this.numberOfSedes == null || this.numberOfSedes == undefined) {
      this.crearEmpresa(locationModal);
    } else {
      const arrayResult = Object.values(this.numberOfSedes);
      console.log(arrayResult);
      if (arrayResult.length <= 5) {
        this.crearEmpresa(locationModal);
      } else {
        alert('Debes de realizar una subscripcion a nuestro servicio empresarial');
      }
    }
  }
  // Funcion para crear empresas en la base de datos
  crearEmpresa(locationModal) {
    // Extrayendo los datos del formulario y del sistema
    const sed_nombre = this.agregarInfo.value.sed_nombre;
    const sed_rfc = this.agregarInfo.value.sed_rfc;
    const sed_email = this.agregarInfo.value.sed_email;
    const sed_img = this.agregarInfo.value.sed_img;
    const fecha = this.dateActuality();
    // Extrayendo los datos del formulario y del sistema
    // Creando registro en la base de datos
    const locationId = this.realtimeDatebase.createPushId();
    var user = this.userAuth.auth.currentUser.uid;
    var name = this.selectedImage.name;
    const fileRef = this.storage.ref(name);
    this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(finalize(() => {
      fileRef.getDownloadURL().subscribe((url) => {
      this.downloadURL = url;
      this.realtimeDatebase.database.ref("sa_sedes/" + locationId + "/").set({
        lat: this.latitude,
        lng: this.longitude,
        sed_nombre: sed_nombre,
        sed_rfc: sed_rfc,
        sed_email: sed_email,
        sedUid: locationId,
        sed_img: this.downloadURL,
        empUid: user,
        fecha: fecha,
      }).then(() => {
        const userID = this.userAuth.auth.currentUser.uid;
        this.realtimeDatebase.database.ref('sa_empresas/' + userID + '/emp_sedes/' + locationId + '/').set({
          lat: this.latitude,
        lng: this.longitude,
        sed_nombre: sed_nombre,
        sed_rfc: sed_rfc,
        sed_email: sed_email,
        sedUid: locationId,
        sed_img: this.downloadURL,
        empUid: user,
        fecha: fecha,
        });
        // Limpiando el formulario y avisando a los usuairos
        this.agregarInfo.reset();
        this.modalData.modalTitle = "Registro exitoso";
        this.modalData.modalDescription =
          "La sede " +
          sed_nombre +
          ", fue agregada exitosamente al sistema.";
        this.modalData.modalIcon =
          "../../../../../assets/ilustrations/undraw_done_a34v.png";
        this.modalReference = this.modalService.show(locationModal);
        // Limpiando el formulario y avisando a los usuairos
      })
              .catch((error) => {
                // Limpiando el formulario y avisando a los usuairos
                this.agregarInfo.reset();
                this.modalData.modalTitle = "Error de registro";
                this.modalData.modalDescription =
                  "Ocurrió un error al agregar esta empresa al sistema.";
                this.modalData.modalIcon =
                  "../../../../../assets/ilustrations/undraw_cancel_u1it.png";
                this.modalReference = this.modalService.show(locationModal);
                // Limpiando el formulario y avisando a los usuairos
              });
          });
        })
      )
      .subscribe();
    // Creando registro en la base de datos
  }
  // Funcion para crear empresas en la base de datos
  ResetForm() {
    this.agregarInfo.reset();
    this.imgSrc = "/assets/img/File-Uploader.png";
    this.selectedImage = null;
    this.isSubmitted = false;
  }
  
  goBack() {
    this.location.back();
  }
}
