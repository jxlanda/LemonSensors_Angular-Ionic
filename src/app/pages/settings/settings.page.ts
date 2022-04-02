import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { MessagingService } from 'src/app/services/messaging.service';
import { AlertController, ToastController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersStoreService } from 'src/app/store/users-store.service';
import { take } from 'rxjs/operators';
const { Clipboard } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  showToken: boolean = false;
  loading: boolean = false;
  enabledNotifications: boolean =  false;
  tokenFCM: string;

  constructor(
    private authService: AuthenticationService,
    private messagingService: MessagingService,
    private userStore: UsersStoreService,
    private toastCtrl: ToastController) { 
      
    }

  ngOnInit() {
    var tokenFound = this.messagingService.findToken();
    if(tokenFound){
      this.enabledNotifications = true;
      this.showToken = true;
      this.tokenFCM = tokenFound;
    } else {
      console.log("token not found");
    }
  }

  onChange($event){
    if(this.enabledNotifications == false){
      this.deleteToken();
    } else {
      this.loading = true;
      this.requestPermission();
    }
  }
  
  async onClick(){
    Clipboard.write({
      string: this.tokenFCM
    });
    const toast = await this.toastCtrl.create({
      message: 'Token copiado al portapapeles',
      duration: 3000
    });
    toast.present();
  }

  requestPermission() {

    
    this.messagingService.requestPermission().pipe(take(1)).subscribe(
      async token => {
        this.tokenFCM = token;
        this.showToken = true;
        this.loading = false;
        console.log("request: " + token);
        let currentUser = this.authService.currentUserValue;
        var allTokens: string[] = [];
        if(currentUser.tokensfcm != undefined){
          allTokens = currentUser.tokensfcm;
        } else {
          currentUser.tokensfcm = allTokens;
        }
        if(allTokens != undefined){
          if(!allTokens.find(x => x == token)){
            currentUser.tokensfcm.push(token);
            this.userStore.updateUser(currentUser._id.$oid, currentUser, false).then(x => {
                this.authService.currentUserSubject.next(currentUser);
                this.authService.userUpdate(currentUser);
            });
            console.log(allTokens);
          }
        }
      },
      async (err) => {
        console.log(err);
        this.showToken = false;
        this.loading = false;
      }
    );
  }

  deleteToken() {
    this.showToken = false;
    this.messagingService.deleteToken();
  }

}
