import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';

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
  constructor(private http: HttpClient) {
    this.columns = [
      { name: 'Word' },
      { name: 'Tries' },
      { name: 'Guessed' }
    ];
    this.http.get<Data>('../../assets/tries.json')
      .subscribe((res) => {
        console.log(res);
        this.rows = res.statistics;
      });
  }
}
