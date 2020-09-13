import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CrudService } from "./../Cliente/components/shared/crud.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase";
import { Usuario } from "./../Cliente/components/shared/usuario";

@Component({
  selector: "app-perfil-user",
  templateUrl: "./perfil-user.component.html",
  styleUrls: ["./perfil-user.component.css"],
})
export class PerfilUserComponent implements OnInit {
  editForm: FormGroup;
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  downloadURL: any;
  datos = [];
  constructor(
    private crudApi: CrudService,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    let usuariosApp = this.crudApi.datosUsuarios();
    usuariosApp.snapshotChanges().subscribe((res) => {
      this.datos = [];
      res.forEach((item) => {
        if (item.key == firebase.auth().currentUser.uid) {
          let a = item.payload.toJSON();
          console.log(a);
          this.datos.push(a as Usuario);
        }
      });
    });
    this.imgSrc = "/assets/img/File-Uploader.png";
    // Inicializando formulario
    this.editForm = this.formBuilder.group({
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
  }

  get cli_nombre() {
    return this.editForm.get("cli_nombre");
  }
  get cli_app() {
    return this.editForm.get("cli_app");
  }
  get cli_apm() {
    return this.editForm.get("cli_apm");
  }
  get cli_usuario() {
    return this.editForm.get("cli_usuario");
  }
  get password() {
    return this.editForm.get("password");
  }
  get email() {
    return this.editForm.get("email");
  }
  get cli_check() {
    return this.editForm.get("cli_check");
  }
  get cli_img() {
    return this.editForm.get("cli_img");
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

  goBack() {
    this.location.back();
  }

  updateForm() {
    this.crudApi.UpdateUsuario(this.editForm.value);
    this.toastr.success(
      this.editForm.controls["cli_nombre"].value + "Actualizacion Completa"
    );
    this.router.navigate(["view-usuarios"]);
  }

  async deletePerfil(emp_id) {
    this.crudApi.deletePerfil(emp_id);
    console.log("Confirm Okay");
    this.router.navigate(['/home']);
  }

  SesionFin() {
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
        window.location.href = "/home";
      }
    });
  }
}
