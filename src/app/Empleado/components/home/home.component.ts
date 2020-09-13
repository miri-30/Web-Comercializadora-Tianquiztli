import { Component, OnInit, TemplateRef} from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { environment } from "../../../../environments/environment";
import { LocationService } from "../locations/location.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireDatabase } from "@angular/fire/database";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import { Location } from "@angular/common";
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  agregarInfo: FormGroup;
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
  constructor(
    private rotuer: Router,
    private formBuilder: FormBuilder,
    private realtimeDatebase: AngularFireDatabase,
    private modalService: BsModalService,
    private Service: LocationService,
    private location: Location,
    private storage: AngularFireStorage,
    private userAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.imgSrc = "/assets/img/File-Uploader.png";
    //inicializacion formulario
    this.agregarInfo = this.formBuilder.group({
      empl_nombre: ['', [Validators.required, Validators.minLength(3)]],
      empl_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      empl_telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      empl_img: ["", [Validators.required]],
    });
    //inicializacion formulario
  }
  get empl_nombre() {
    return this.agregarInfo.get('empl_nombre');
  }
  get empl_email() {
    return this.agregarInfo.get('empl_email');
  }  
  get empl_telefono() {
    return this.agregarInfo.get('empl_telefono');
  }
  get empl_img() {
    return this.agregarInfo.get('empl_img');
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
  // Funcion para crear empresas en la base de datos
  crearEmpresa(locationModal: TemplateRef<any>) {
    // Extrayendo los datos del formulario y del sistema
    const empl_nombre = this.agregarInfo.value.empl_nombre;
    const empl_email = this.agregarInfo.value.empl_email;
    const empl_telefono = this.agregarInfo.value.empl_telefono;
    const empl_img = this.agregarInfo.value.empl_img;
    const fecha = this.dateActuality();
    // Extrayendo los datos del formulario y del sistema
    // Creando registro en la base de datos
    var user = this.userAuth.auth.currentUser.uid;
    const locationId = this.realtimeDatebase.createPushId();
    var name = this.selectedImage.name;
    const fileRef = this.storage.ref(name);
    this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
           this.downloadURL = url;
this.realtimeDatebase.database
      .ref("sa_empleados/" + locationId + "/")
      .set({
        empl_nombre: empl_nombre,
        empl_email: empl_email,
        empl_telefono: empl_telefono,
        emplUid: locationId,
        empl_img: this.downloadURL,
        empUid: user,
        fecha: fecha,
      })
      .then(() => {
        // Limpiando el formulario y avisando a los usuairos
        this.agregarInfo.reset();
        this.modalData.modalTitle = "Registro exitoso";
        this.modalData.modalDescription =
          "El empleado " + empl_nombre + ", fue agregada exitosamente al sistema.";
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
          "Ocurrió un error al agregar al empleado al sistema.";
        this.modalData.modalIcon =
          "../../../../../assets/ilustrations/undraw_cancel_u1it.png";
        this.modalReference = this.modalService.show(locationModal);
        // Limpiando el formulario y avisando a los usuairos
      });
        })
      })
    ).subscribe();    
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
