import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User, WordFound } from '../../app/models/user';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  baseUrl: string = environment.urlApi;

  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }

    getWordFound(word: WordFound): Observable<any> {
      return this.http.post<any>(this.baseUrl + '/wordfound', word);
    };

    postWordFound(word: WordFound): Observable<any> {
      return this.http.post<any>(this.baseUrl + '/wordfound', word)
      .pipe(
        map(
          (resp: any) => {
            console.log(resp);
            console.log('Word sent to the front');
            console.log(resp.word);
            return resp;
          }
        )
      );
    };

}
