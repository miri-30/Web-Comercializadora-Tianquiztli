import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class EmpleadoService {
  employList: AngularFireList<any>;
  array = [];
  
  constructor(private db: AngularFireDatabase,
    ) {
      this.employList = this.db.list('sa_empleados');
    this.employList.snapshotChanges().subscribe(
      list => {
        this.array = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
      });
   }
}