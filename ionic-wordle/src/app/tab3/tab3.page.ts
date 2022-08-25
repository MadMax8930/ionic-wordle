import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Data {
  statistics: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Tab3Page {
  public data: Data;
  public columns: any;
  public rows: any;

  baseUrl: string = environment.urlApi;
  constructor(private http: HttpClient) {
    this.columns = [
      { name: 'Id' },
      { name: 'Content' },
    ];
    this.http.get<Data>(this.baseUrl + '/word')
      .subscribe((res) => {
        console.log(res);
        this.rows = res;
      });
  }
}
