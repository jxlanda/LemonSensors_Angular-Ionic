import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { JwtService } from '../services/jwt.service';
// import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthenticationService,
    private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.jwtService.getToken()) {
        if (this.jwtService.isTokenExpired()) {
          console.log("Token expired");
          this.authService.logout();
          return false;
        } else {
          console.log("Authorized");
          return true;
        }
    } else {
      console.log("Navegando a login");
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
