import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  
  jwtToken: string;
  //decodedToken: { [key: string]: string };
  decodedToken: any;

  constructor(private storageService: LocalStorageService) { }

  setToken(token: string) {
    if (token) {
      this.jwtToken = token;
      this.storageService.set("jwt", this.jwtToken);
    }
  }

  removeToken(){
    if (this.jwtToken) {
      this.jwtToken = null;
      this.storageService.remove("jwt");
    }
  }

  getToken() {
    this.jwtToken = this.storageService.get("jwt");
    return this.jwtToken ? this.jwtToken : null;
  }

  decodeToken() {
    if (this.jwtToken) {
    this.decodedToken  = jwt_decode(this.jwtToken);
    //console.log(this.decodedToken);
    }
  }

  getDecodeToken() {
    return jwt_decode(this.jwtToken);
  }

  getUserId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.id : null;
  }

  getUsername() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.username : null;
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: any = this.getExpiryTime();
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }
}
