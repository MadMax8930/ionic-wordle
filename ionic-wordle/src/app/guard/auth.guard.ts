import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = localStorage.getItem('TOKEN');
      if (token) {
        console.log('Ok Guard -> ACCESS GRANTED');
        return true;
      } else {
        console.log('NO Guard -> NO ACCESS, REDIRECT');
        this.router.navigate(['/tabs/tab1']);
        return false;
      }
    }
}
