import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CrudService } from "../shared/crud.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-edit-empleado",
  templateUrl: "./edit-empleado.component.html",
  styleUrls: ["./edit-empleado.component.css"],
})
export class EditEmpleadoComponent implements OnInit {
  editForm: FormGroup;

  constructor(
    private crudApi: CrudService,
    private fb: FormBuilder,
    private location: Location,
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      empl_nombre: ['', [Validators.required, Validators.minLength(3)]],
      empl_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      empl_telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      empl_img: ["", [Validators.required]],
      emplUid: ["", [Validators.required]],
      empUid: ["", [Validators.required]],
      fecha: ["", [Validators.required]],
    });
    const id = this.actRoute.snapshot.paramMap.get("id");
    this.crudApi
      .GetEmpleado(id)
      .valueChanges()
      .subscribe((data) => {
        this.editForm.setValue(data);
      });
  }
  get empl_nombre() {
    return this.editForm.get("empl_nombre");
  }
  get empl_email() {
    return this.editForm.get("empl_email");
  }
  get empl_telefono() {
    return this.editForm.get("empl_telefono");
  }
  get empl_img() {
    return this.editForm.get("empl_img");
  }
  goBack() {
    this.location.back();
  }

  updateForm() {
    this.crudApi.UpdateEmpleado(this.editForm.value);
    this.toastr.success(
      this.editForm.controls["empl_nombre"].value + " Actualizacion Completada"
    );
    this.router.navigate(["/view-empleados"]);
  }
}
