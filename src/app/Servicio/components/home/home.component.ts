import { Component, OnInit, TemplateRef } from "@angular/core";
import { LocationService } from "../locations/location.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireDatabase } from "@angular/fire/database";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import { Location } from "@angular/common";
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  employeeLocation = [];
  categoriaLocation = [];
  // Formulario
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

    this.Service.GetCategoria().subscribe((returnedData) => {
      this.categoriaLocation = returnedData;
      })

    this.imgSrc = "/assets/img/File-Uploader.png";
    this.Service.getempleados().subscribe((returnedData) => {
      this.employeeLocation = returnedData;
    });
    this.agregarInfo = this.formBuilder.group({
      serv_nombre: ["", [Validators.required, Validators.minLength(3)]],
      serv_descripcion: ["", [Validators.required, Validators.minLength(50)]],
      serv_costo: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
        ],
      ],
      categoria: ['', [Validators.required]],
      serv_img: ["", [Validators.required]],
      empl_nombre: ["", [Validators.required]],
    });
  }
  get serv_nombre() {
    return this.agregarInfo.get("serv_nombre");
  }
  get serv_descripcion() {
    return this.agregarInfo.get("serv_descripcion");
  }
  get serv_costo() {
    return this.agregarInfo.get("serv_costo");
  }
  get categoria() {
    return this.agregarInfo.get("categoria");
  }
  get empl_nombre() {
    return this.agregarInfo.get("empl_nombre");
  }
  get serv_img() {
    return this.agregarInfo.get("serv_img");
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
    const serv_nombre = this.agregarInfo.value.serv_nombre;
    const serv_descripcion = this.agregarInfo.value.serv_descripcion;
    const serv_costo = this.agregarInfo.value.serv_costo;
    const categoria = this.agregarInfo.value.categoria;
    const empl_nombre = this.agregarInfo.value.empl_nombre;
    const serv_img = this.agregarInfo.value.serv_img;
    const fecha = this.dateActuality();
    var user = this.userAuth.auth.currentUser.uid;
    const locationId = this.realtimeDatebase.createPushId();
    var name = this.selectedImage.name;
    const fileRef = this.storage.ref(name);
    this.storage
      .upload(name, this.selectedImage)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.downloadURL = url;
            this.realtimeDatebase.database
              .ref("sa_servicios/" + locationId + "/")
              .set({
                serv_nombre: serv_nombre,
                serv_descripcion: serv_descripcion,
                serv_costo: serv_costo,
                categoria: categoria,
                empl_nombre: empl_nombre,
                servUid: locationId,
                serv_img: this.downloadURL,
                fecha: fecha,
                empUid: user,
              })
              .then(() => {
                // Limpiando el formulario y avisando a los usuairos
                this.agregarInfo.reset();
                this.modalData.modalTitle = "Registro exitoso";
                this.modalData.modalDescription =
                  "El servicio " +
                  serv_nombre +
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
                  "Ocurrió un error al agregar este servicio al sistema.";
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
