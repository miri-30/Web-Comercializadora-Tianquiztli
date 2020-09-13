import { Component, OnInit } from '@angular/core';
import { CrudService } from '../shared/crud.service';  // CRUD API service class
import { Usuario } from './../shared/usuario';   // Student interface class for Data types.
import { ToastrService } from 'ngx-toastr';      // Alert message using NGX toastr
import * as firebase from 'firebase';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {
  Filter: any = {cli_nombre: ''};
  p: number = 1;                      // Fix for AOT compilation error for NGX pagination
  Usuario: Usuario[];                 // Save usuarios data in Student's array.
  hideWhenNoStudent: boolean = false; // Hide usuarios data table when no student.
  noData: boolean = false;            // Showing No Student Message, when no student in database.
  preLoader: boolean = true;          // Showing Preloader to show user data is coming for you from thre server(A tiny UX Shit)
  

  constructor(
    public crudApi: CrudService, // Inject student CRUD services in constructor.
    public toastr: ToastrService // Toastr service for alert message
    ){ }


  ngOnInit() {
    this.dataState(); // Initialize student's list, when component is ready
    let s = this.crudApi.GetUsuariosList(); 
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.Usuario = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.Usuario.push(a as Usuario);
      })
    })
  }

  // Using valueChanges() method to fetch simple list of students data. It updates the state of hideWhenNoStudent, noData & preLoader variables when any changes occurs in student data list in real-time.
  dataState() {     
    this.crudApi.GetUsuariosList().valueChanges().subscribe(data => {
      this.preLoader = false;
      if(data.length <= 0){
        this.hideWhenNoStudent = false;
        this.noData = true;
      } else {
        this.hideWhenNoStudent = true;
        this.noData = false;
      }
    })
  }

  // Method to delete student object
  deleteStudent(users) {
    if (window.confirm('Esta seguro de eliminar al Usuario: ' + users.cli_nombre + ' ?' )) { // Asking from user before Deleting student data.
      this.crudApi.DeleteUsuario(users.$key) // Using Delete student API to delete student.
      this.toastr.success(users.cli_nombre + ' successfully deleted!'); // Alert message will show up when student successfully deleted.
    }
  }
  SesionFin () {
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
          window.location.href = "/home";
      }
  });
}
}