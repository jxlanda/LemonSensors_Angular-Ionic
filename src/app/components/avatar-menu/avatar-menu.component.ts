import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-avatar-menu',
  templateUrl: './avatar-menu.component.html',
  styleUrls: ['./avatar-menu.component.scss'],
})
export class AvatarMenuComponent implements OnInit {

  constructor(
    private router: Router,
    public popoverController: PopoverController,
    private authService: AuthenticationService) { }

  ngOnInit() {}

  logout(ev: any) {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToSettings(ev: any) {
    console.log("Configuracion");
    this.popoverController.dismiss("settings");
    this.router.navigate(['/settings']);
  }
}
