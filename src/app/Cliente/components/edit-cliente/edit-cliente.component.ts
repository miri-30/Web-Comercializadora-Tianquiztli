import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudService } from '../shared/crud.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {
  editForm: FormGroup; 

  constructor(
    private crudApi: CrudService,
    private fb: FormBuilder,
    private location: Location,
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ){ }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      cli_nombre: ["", [Validators.required, Validators.minLength(2)]],
      cli_app: ["", [Validators.required, Validators.minLength(2)]],
      cli_apm: ["", [Validators.required, Validators.minLength(2)]],
      cli_usuario: ["", [Validators.required]],
      cli_check: ["", [Validators.required]],
      // cli_img: ["", [Validators.required]],
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
      lat: ["", [Validators.required]],
      lng: ["", [Validators.required]],
      cliUid: ["", [Validators.required]],
      fecha: ["", [Validators.required]],
      cli_imag: ["", [Validators.required]],
    });
    const id = this.actRoute.snapshot.paramMap.get('id');  // Getting current component's id or information using ActivatedRoute service
    this.crudApi.GetUsuario(id).valueChanges().subscribe(data => {
      this.editForm.setValue(data)  // Using SetValue() method, It's a ReactiveForm's API to store intial value of reactive form 
    })
  }

  // Accessing form control using getters
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
  // get cli_img() {
  //   return this.editForm.get("cli_img");
  // }
  goBack() {
    this.location.back();
  }

  updateForm(){
    this.crudApi.UpdateUsuario(this.editForm.value); 
    this.toastr.success(this.editForm.controls['cli_nombre'].value + 'Actualizacion Completa');
    this.router.navigate(['view-usuarios']);
  }

}
