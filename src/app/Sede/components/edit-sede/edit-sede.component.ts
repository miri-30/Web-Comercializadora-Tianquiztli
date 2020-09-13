import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CrudService } from "../shared/crud.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { Sede } from "../shared/sedes";

@Component({
  selector: "app-edit-sede",
  templateUrl: "./edit-sede.component.html",
  styleUrls: ["./edit-sede.component.css"],
})
export class EditSedeComponent implements OnInit {
  editForm: FormGroup;
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  numberOfSedes: any;
  downloadURL: any;
  userSede: Sede;
  constructor(
    private crudApi: CrudService,
    private fb: FormBuilder,
    private location: Location,
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.imgSrc = "/assets/img/File-Uploader.png";

    this.editForm = this.fb.group({
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
      lat: ["", [Validators.required]],
      lng: ["", [Validators.required]],
      sedUid: ["", [Validators.required]],
      fecha: ["", [Validators.required]],
      empUid: ["", [Validators.required]],
      sed_img: ["", [Validators.required]],
    });
    const id = this.actRoute.snapshot.paramMap.get("id");
    this.crudApi
      .GetSede(id)
      .valueChanges()
      .subscribe((data) => {
        this.editForm.setValue(data);
      });
  }

  get sed_nombre() {
    return this.editForm.get("sed_nombre");
  }
  get empUid() {
    return this.editForm.get("empUid");
  }
  get sed_rfc() {
    return this.editForm.get("sed_rfc");
  }
  get sed_email() {
    return this.editForm.get("sed_email");
  }
  get sed_img() {
    return this.editForm.get("sed_img");
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
    this.crudApi.UpdateSede(this.editForm.value);
    this.toastr.success(
      this.editForm.controls["sed_nombre"].value + " Actualizacion Completada"
    );
    this.router.navigate(["/view-sedes"]);
  }
}
