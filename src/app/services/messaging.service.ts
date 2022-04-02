import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { LocalStorageService } from './local-storage.service';
import { take, tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  token = null;
  tokenKey: string;

  constructor(
    private afMessaging: AngularFireMessaging,
    private authService: AuthenticationService,
    private storageService: LocalStorageService) {
      
      if(this.authService.currentUserValue != (null || undefined)){
        this.tokenKey = "FCMToken-" + this.authService.currentUserValue._id.$oid;
      }
    }

  requestPermission() {
    //this.tokenKey = "FCMToken-" + this.authService.currentUserValue._id.$oid;
    return this.afMessaging.requestToken.pipe(
      tap(token => {
        console.log('Token almacenado: ', token);
        this.token = token;
        this.storageService.set(this.tokenKey, token);
      })
    );
  }

  getMessages() {
    return this.afMessaging.messages;
  }

  findToken(){
    //var tokenTemp = "FCMToken-" + this.authService.currentUserValue._id.$oid;
    return this.storageService.get(this.tokenKey);
  }

  getToken() {
    return this.token;
  }
 
  deleteToken() {
    console.log("delete token...");
    return this.afMessaging.deleteToken(this.token).toPromise().then(x => {
      // if(this.tokenKey == undefined){
      //   this.tokenKey = "FCMToken-" + this.authService.currentUserValue._id.$oid;
      // }
      this.storageService.remove(this.tokenKey);
      this.token = null;
      console.log("Token eliminado");
    });
  }
}
