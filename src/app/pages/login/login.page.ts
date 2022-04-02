import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormControl, Validators, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { LoginKeys, User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { first } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {

  loading: boolean = false;
  error404: boolean = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private jwtService: JwtService,
    public menu: MenuController) { 

      if(this.jwtService.getToken()){
        console.log("You have a token");
        this.router.navigate(['home']);
      } else {
        console.log("You not have a token");
      }
    }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menu.enable(false);
    this.menu.swipeGesture(false);
  }
  
  ionViewDidLeave() {
    this.menu.enable(true);
  }

  getEmailErrorMessage() {
    this.error404 = false;
    if (this.loginForm.get('email').hasError('required')) {
      return 'El correo eléctronico es requerido';
    }
    return this.loginForm.get('email').hasError('email') ? 'No es un correo valido' : '';
  }
  
  getPasswordErrorMessage() {
    this.error404 = false;
    if (this.loginForm.get('password').hasError('required')) {
      return 'La contraseña es requerida';
    }
  }

  async onSubmit(){

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    var keys: LoginKeys = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }
    

    this.authService.login(keys)
    .pipe(first())
    .subscribe(
      data => {
        this.router.navigate(['/home']);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.error404 = true;
        this.loading = false;
      });
      
  }

  // Button Options
  btnOpts: MatProgressButtonOptions = {
    active: false,
    text: 'Iniciar sesión',
    spinnerSize: 19,
    raised: true,
    stroked: false,
    flat: false,
    fab: false,
    buttonColor: 'primary',
    spinnerText: 'cargando',
    //spinnerColor: 'white',
    fullWidth: true,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'some-class',
    // add an icon to the button
    buttonIcon: {
      fontSet: 'fa',
      fontIcon: 'fa-heart',
      inline: true
    }
  };

  btnClick(): void {
    this.btnOpts.active = true;
    setTimeout(() => {
      this.btnOpts.active = false;
    }, 3350);
  }

}
