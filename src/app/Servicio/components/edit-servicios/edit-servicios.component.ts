import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudService } from '../shared/crud.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from "../locations/location.service";
import { AngularFireObject } from '@angular/fire/database';


@Component({
  selector: 'app-edit-servicios',
  templateUrl: './edit-servicios.component.html',
  styleUrls: ['./edit-servicios.component.css']
})
export class EditServiciosComponent implements OnInit {
  editForm: FormGroup;
  employeeLocation = [];
  categoriaLocation = [];
  servicioRef: AngularFireObject<any>; // Reference to Student object, its an Observable too
  constructor(
    private crudApi: CrudService,
    private fb: FormBuilder,
    private location: Location,
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private Service: LocationService,

  ){ }

  ngOnInit(): void {
    this.Service.GetCategoria().subscribe((returnedData) => {
      this.categoriaLocation = returnedData;
      //cargar información del arreglo  para categoria//
      })
    this.Service.getempleados().subscribe((returnedData) => {
      this.employeeLocation = returnedData;
    });

    this.editForm = this.fb.group({
      serv_nombre: ['', [Validators.required, Validators.minLength(3)]],
      serv_descripcion: ['', [Validators.required, Validators.minLength(50)]],
      serv_costo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      categoria: ['', [Validators.required]],
      empl_nombre: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      servUid: ['', [Validators.required]],
      empUid: ['', [Validators.required]],
      serv_img: ["", [Validators.required]],
    })
    const id = this.actRoute.snapshot.paramMap.get('id');
      this.crudApi.GetServicio(id).valueChanges().subscribe(data => {
      this.editForm.setValue(data)
    })
  }

  get serv_nombre() {
    return this.editForm.get('serv_nombre');
  }
  get serv_descripcion() {
    return this.editForm.get('serv_descripcion');
  }
  get serv_costo() {
    return this.editForm.get('serv_costo');
  }
  get categoria() {
    return this.editForm.get("categoria");
  }
  get empl_nombre() {
    return this.editForm.get('empl_nombre')
  }
  get fecha() {
    return this.editForm.get('fecha')
  }
  get servUid() {
    return this.editForm.get('servUid')
  }
  get serv_img() {
    return this.editForm.get("serv_img");
  }
  goBack() {
    this.location.back();
  }

  updateForm(){
    this.crudApi.UpdateServicio(this.editForm.value);
    this.toastr.success(this.editForm.controls['serv_nombre'].value + ' Actualizacion Completada');
    this.router.navigate(['/view-servicios']);
  }
}
