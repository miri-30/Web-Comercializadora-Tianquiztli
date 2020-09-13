import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudService } from '../shared/crud.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-empresa',
  templateUrl: './edit-empresa.component.html',
  styleUrls: ['./edit-empresa.component.css']
})
export class EditEmpresaComponent implements OnInit {
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
      emp_nom: ["", [Validators.required, Validators.minLength(2)]],
      emp_desc: ["", [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      emp_rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      emp_numSede: ["", [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      lat: ["", [Validators.required]],
      lng: ["", [Validators.required]],
      empUid: ["", [Validators.required]],
      fecha: ["", [Validators.required]],
      emp_imag: ["", [Validators.required]],
      emp_check: ["", [Validators.required]],
})
    const id = this.actRoute.snapshot.paramMap.get('id');  // Getting current component's id or information using ActivatedRoute service
    this.crudApi.GetStudent(id).valueChanges().subscribe(data => {
      this.editForm.setValue(data)  // Using SetValue() method, It's a ReactiveForm's API to store intial value of reactive form 
    })
  }
  get emp_nom() {
    return this.editForm.get('emp_nom');
  }
  get email() {
    return this.editForm.get('email');
  }  
  get emp_rfc() {
    return this.editForm.get('emp_rfc');
  }
  get emp_numSede() {
    return this.editForm.get('emp_numSede');
  }
  get emp_desc() {
    return this.editForm.get('emp_desc');
  }
  get password() {
    return this.editForm.get('password');
  }
  get emp_check() {
    return this.editForm.get("emp_check");
  }

  goBack() {
    this.location.back();
  }

  updateForm(){
    this.crudApi.UpdateStudent(this.editForm.value);
    this.toastr.success(this.editForm.controls['emp_nom'].value + ' Actualizacion Completada');
    this.router.navigate(['view-empresas']);
  }

}
