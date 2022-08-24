import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../app/models/user';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.urlApi;

  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }

    register(user: User): Observable<any> {
      return this.http.post<any>(this.baseUrl + '/auth/register', user);
    }

    login(user: User): Observable<any> {
      return this.http.post<any>(this.baseUrl + '/auth/login', user)
      .pipe(
        map(
          (resp: any) => {
            console.log(resp);
            localStorage.setItem('TOKEN_APPLI', resp.accessToken);
            localStorage.setItem('USER_EMAIL', resp.email);
            localStorage.setItem('USER_NAME', resp.usermame);
            console.log('Token Save');
            console.log(resp.email);
            console.log(resp.usermame);
            return resp;
          }
        )
      );
    }

    getIdByToken(){
      const token = localStorage.getItem('TOKEN_APPLI');
      const helper = new JwtHelperService();
      if( token ) {
        const decodedToken = helper.decodeToken(token);
        console.log(decodedToken);
        const id = decodedToken.userId;
        return id;
      }
    }


    logout() {
      localStorage.removeItem('TOKEN_APPLI');
      localStorage.removeItem('USER_EMAIL');
      localStorage.removeItem('USER_NAME');
      this.router.navigate(['/tabs/tab1']);
    }
}
