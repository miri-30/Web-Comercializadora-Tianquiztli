export interface Servicio {
  $key: string;
  serv_nombre: string;
  serv_descripcion: string;
  serv_costo: Number;
  serv_categoria: string;
  fecha: string;
  lat: string;
  lng: string;
  servUid: string;
   serv_img: string;
  empl_nombre: string;
}

export class Servicio {
  $key: string;
  serv_nombre: string;
  serv_descripcion: string;
  serv_costo: Number;
  serv_categoria: string;
  fecha: string;
  lat: string;
  lng: string;
  servUid: string;
   serv_img: string;
  empl_nombre: string;
}