import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

/*
  Generated class for the PredictionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PredictionProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PredictionProvider Provider');
  }
  films: Observable<any>;

  // test() {
  //   console.log("Test Called in provider")
  //   // http://192.168.0.33:5000/timestamp

  //   //  this.http.get("http://192.168.0.15:5000/timestamp")
  //   //  .map(res => res.json()).subscribe(data => {
  //   //   console.log(data)
  //   // })

  //   this.http.get("http://192.168.0.33:5000/timestamp").subscribe(data => {
  //     console.log(data);
  //   });


  //   this.http.post("http://192.168.0.33:5000/postjson",{"millis":"1548510875488"}).subscribe(data => {
  //     console.log(data);
  //   });
  //   //1548510875488

  //   // this.films.map(res => res.json()).subscribe(data => {
  //   //   console.log(data)
  //   // })


  //   // .subscribe(data => {
  //   //   console.log(data)
  //   // })

  //   // .map(res => console.log(res.status))

  //   // .subscribe(data => {
  //   //   console.log(data)
  //   // })
  // }

}
