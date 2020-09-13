import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Servicio } from '../shared/servicios';
import * as firebase from 'firebase/app';
import { CrudService } from './../shared/crud.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-servicios',
  templateUrl: './view-servicios.page.html',
  styleUrls: ['./view-servicios.page.scss'],
})

export class ViewServiciosPage implements OnInit {
  updateBookingForm: FormGroup;
  id: any;

  UserObj = new Servicio();

  servicios = [ ];

  constructor(
    private aptService: CrudService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    public location: Location
  ) { }

  /* ngOnInit() {
    this.actRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        // redirect
        this.router.navigate(['/perfiles']);
      }
      const emp_id = paramMap.get("placeId");
      this.id = this.aptService.getBooking(emp_id);
    });
  } */

  ngOnInit(){
    let usuariosApp = this.aptService.GetServiciosList();
    usuariosApp.snapshotChanges().subscribe(res => {
      this.servicios =[];
      res.forEach(item => {
        let a = item.payload.toJSON();
        console.log(a);
        this.servicios.push(a as Servicio);
        }
      )
    })
  }

  getDatos (){
    this.aptService.GetServiciosList().valueChanges().subscribe(res =>{
      console.log(res);
    })
  }
  
  goBack() {
    this.location.back();
  }
}