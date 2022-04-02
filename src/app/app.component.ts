import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AvatarMenuComponent } from './components/avatar-menu/avatar-menu.component';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { User } from './models/user.model';
import { AuthenticationService } from './services/authentication.service';
import { iif } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  user: User;
  letterUser: string;

  isLogin: boolean = true;

  iconArrowDown: string = "caret-down-outline";
  iconArrowUp: string = "caret-up-outline";
  iconArrowAvatar: string = "caret-down-outline";

  currentPopover = null;

  public currentText: string;
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Usuarios',
      url: '/users',
      icon: 'people'
    },
    {
      title: 'Sensores',
      url: '/sensors',
      icon: 'pulse'
    },
    {
      title: 'Historial',
      url: '/history',
      icon: 'time'
    },
    {
      title: 'Configuración',
      url: '/settings',
      icon: 'settings'
    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    public popoverController: PopoverController
  ) {
    this.selectedIndex = 0;
    this.currentText = this.appPages[0].title;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.authService.currentUser.subscribe(res => {
      if (res != null) {
        console.log("No es login");
        this.isLogin = false;
        console.log(this.user);
        console.log(res);
        if(this.user == null){
          this.selectedIndex = 0;
          this.currentText = this.appPages[0].title;
        }
        // if(this.user != null && this.user._id.$oid != res._id.$oid){
        //   this.selectedIndex = 0;
        //   this.currentText = this.appPages[0].title;
        // }
        this.user = res;
        this.letterUser = this.user.name.substr(0, 1);
      } else {
        console.log("Es login");
        this.isLogin = true;
        this.user = null;
        // this.selectedIndex = 0;
        // this.currentText = this.appPages[0].title;
        this.dismissPopover()
      }
    });
  }

  ngOnInit() {
    var path = window.location.pathname.split('/')[1];
    const allPath = window.location.pathname;

    console.log(allPath);
    if (path != undefined) {
      if (allPath == "/" && this.authService.currentUserValue != null) {
        this.selectedIndex = 0;
        this.currentText = this.appPages[0].title;
      } else {
        this.selectedIndex = this.appPages.findIndex(page => {
          this.currentText = page.title;
          return page.url === allPath;
        });
      }
    }
  }

  async presentPopover(ev: any) {
    this.iconArrowAvatar = this.iconArrowUp;

    const popover = await this.popoverController.create({
      component: AvatarMenuComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(x => {
      this.iconArrowAvatar = this.iconArrowDown;
    });

    popover.onDidDismiss().then((result) => {
      console.log(result['data']);
      if (result['data'] == "settings") {
        this.selectedIndex = 4;
        this.currentText = "Configuración";
      }
    });

    this.currentPopover = popover;

    return await popover.present();
  }

  dismissPopover() {
    if (this.currentPopover) {
      this.currentPopover.dismiss().then(() => {
        this.currentPopover = null;
      });
    }
  }

}
