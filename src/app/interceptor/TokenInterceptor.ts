import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
 
  constructor(private jwtService: JwtService) { }
 
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.jwtService.getToken();
    req = req.clone({
      url:  req.url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(req);
    return next.handle(req);
  }
}