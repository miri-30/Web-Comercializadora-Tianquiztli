import * as core from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@core.Injectable({
  providedIn: 'root'
})
export class LocationService {
//variable para extrar los datos del componente//
dataExtractor1: any;
dataCategoria: any;
//variable para extrar los datos del componente//

  constructor(private database: AngularFireDatabase) { }
  //Metodo para recibir  los datos del componente//
gettingData(data: any){
  this.dataExtractor1 = data;
  this.dataCategoria = data;
  //Metodo para recibir  los datos del componente//

}
//Metodo publico para consultar los empleados desde la base de datos//
public getempleados(){
  return this.database.list('sa_empleados/').valueChanges();
}

public GetCategoria(){
  return this.database.list('categoria/').valueChanges();
}
//Metodo publico para consultar los empleados desde la base de datos//
//filtro Categoria//
getCategoriaFiltro(filtro :string){
  this.dataCategoria = this.database.list('/categoria'),
  data => data.orderByChild('dataCategoria').equalTo('dataCategoria')
}
//filtro Categoria//
}
