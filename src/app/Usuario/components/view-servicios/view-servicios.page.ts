import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Servicio } from "../shared/servicios";
import * as firebase from "firebase/app";
import { CrudService } from "./../shared/crud.service";
import { Location } from "@angular/common";
import { Usuario } from "./../../../Cliente/components/shared/usuario";
import { Paypal } from "../../../Usuario/components/view-servicios/functions";
import { from } from "rxjs";

@Component({
  selector: "app-view-servicios",
  templateUrl: "./view-servicios.page.html",
  styleUrls: ["./view-servicios.page.scss"],
})
export class ViewServiciosPage implements OnInit {
  updateBookingForm: FormGroup;
  id: any;
  UserObj = new Servicio();
  servicio: Servicio;
  datos = [];

  constructor(
    private aptService: CrudService,
    private route: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    public location: Location
  ) {}

  ngOnInit() {
    Paypal.fnc();
    
    this.route.params.subscribe((params) => {
      const id = params.id;

      if (id) {
        this.aptService
          .GetServicio(id)
          .snapshotChanges()
          .subscribe(
            (res) => {
              if (res.payload.exists()) {
                this.servicio = res.payload.toJSON() as Servicio;
                this.servicio.$key = res.key;
                console.log("res", res);
              } else {
                this.router.navigate(["/"]);
              }
            }
          );
      }
      console.log("id", id);
    });

    let userApp = this.aptService.datosUsuarios();
    userApp.snapshotChanges().subscribe((res) => {
      this.datos = [];
      res.forEach((item) => {
        if (item.key == firebase.auth().currentUser.uid) {
          let a = item.payload.toJSON();
          console.log(a);
          this.datos.push(a as Usuario);
        }
      });
    });
    
  }

  goBack() {
    this.location.back();
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
