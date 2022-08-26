import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User, WordFound } from '../../app/models/user';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  baseUrl: string = environment.urlApi;
  word$ = new Subject<Array<any>>();
  wordSubject$ = new BehaviorSubject<Array<any>>([]);

  constructor(private http: HttpClient) {
    this.getAll();
  }

   async getAll(): Promise<any> {
       await this.http.get<any>(this.baseUrl + '/word').subscribe(
        data => {
          console.log(data);
          this.word$.next(data);
        }
      );
    }

    postWordFound(word: WordFound): Observable<any> {
      return this.http.post<any>(this.baseUrl + '/wordfound', word)
      .pipe(
        map(
          (resp: any) => {
            console.log(resp);
            console.log('Word sent to front');
            console.log(resp.content);
            this.wordSubject$.next(resp.content);
            return resp;
          }
        )
      );
    };

}
