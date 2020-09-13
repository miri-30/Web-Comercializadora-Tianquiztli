import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CrudService } from "./../Empresas/components/shared/crud.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase";
import { Empresa } from "./../Empresas/components/shared/student";

@Component({
  selector: "app-perfil-emp",
  templateUrl: "./perfil-emp.component.html",
  styleUrls: ["./perfil-emp.component.css"],
})
export class PerfilEmpComponent implements OnInit {
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
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log("user", user);
    });

    let usuariosApp = this.crudApi.datosUsuarios();
    usuariosApp.snapshotChanges().subscribe((res) => {
      this.datos = [];
      res.forEach((item) => {
        if (item.key == firebase.auth().currentUser.uid) {
          let a = item.payload.toJSON();
          console.log(a);
          this.datos.push(a as Empresa);
        }
      });
    });
    this.imgSrc = "/assets/img/File-Uploader.png";

    this.editForm = this.formBuilder.group({
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
  }

  get emp_nom() {
    return this.editForm.get("emp_nom");
  }
  get emp_desc() {
    return this.editForm.get("emp_desc");
  }
  get emp_rfc() {
    return this.editForm.get("emp_rfc");
  }
  get emp_numSede() {
    return this.editForm.get("emp_numSede");
  }
  get password() {
    return this.editForm.get("password");
  }
  get email() {
    return this.editForm.get("email");
  }
  get emp_check() {
    return this.editForm.get("emp_check");
  }
  get emp_img() {
    return this.editForm.get("emp_img");
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
    var user = firebase.auth().currentUser;
    console.log(user);
    this.crudApi.UpdateStudent(this.editForm.value);
    this.toastr.success(
      this.editForm.controls["cli_nombre"].value + "Actualizacion Completa"
    );
    this.router.navigate(["perfilE"]);
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
