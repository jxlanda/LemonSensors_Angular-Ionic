import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { UsersStoreService } from 'src/app/store/users-store.service';
import { MyErrorStateMatcher } from '../user-modal/user-modal.component';
import { DialogData } from 'src/app/pages/users/users.page';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-user-modal-mobile',
  templateUrl: './user-modal-mobile.component.html',
  styleUrls: ['./user-modal-mobile.component.scss'],
})
export class UserModalMobileComponent implements OnInit {

  @Input() data: DialogData;

  imagesmall: boolean = false;
  hideDefaultImage: boolean = false;
  userEditing: User;

  nameRandom: number;
  emailRandom: number;
  usernameRandom: number;
  passwordRandom: number;
  imgRandom: number;

  selectedRole: number = null;

  namePlaceholder: string[] = [
    "Agustin Arroyo",
    "Fran Ramiro",
    "Raquel Chaparro",
    "Juan-Andres Mohamed",
    "Aurora Cespedes",
    "Emílio Paez"
  ];

  emailPlaceholder: string[] = [
    "ejemplo@gmail.com",
    "ejemplo@outlook.com",
    "ejemplo@yahoo.com",
  ];

  usernamePlaceholder: string[] = [
    "raverio",
    "artemica49",
    "boxartermio",
    "corona19",
    "juan2020"
  ];

  passwordPlaceholder: string[] = [
    "az&UZhFZ",
    "3P@g!bXK",
    "vQ^Enx%r",
    "DPe&eHAt",
    "^dVtJ5Wy"
  ];

  imgPlaceholder: string[] = [
    "https://imgur.com/gallery/xIoNU5h",
    "https://es.imgbb.com/img001",
    "https://photobucket.com/img/pb.png"
  ];

  roles: string[] = [
    "Administrador",
    "Normal"
  ];

  matcher = new MyErrorStateMatcher();
  userForm: FormGroup;

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userStore: UsersStoreService) {
    this.userForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      imgurl: new FormControl('')
    }, { validators: this.checkPasswords });

    this.nameRandom = Math.floor(Math.random() * this.namePlaceholder.length);
    this.emailRandom = Math.floor(Math.random() * this.emailPlaceholder.length);
    this.usernameRandom = Math.floor(Math.random() * this.usernamePlaceholder.length);
    this.passwordRandom = Math.floor(Math.random() * this.passwordPlaceholder.length);
    this.imgRandom = Math.floor(Math.random() * this.imgPlaceholder.length);

  }


  ngOnInit() { 
    
    console.log(this.data);
    
    if(this.data.isEdit){
    this.userEditing = this.data.user;
    this.userForm.get('name').setValue(this.userEditing.name);
    this.userForm.get('email').setValue(this.userEditing.email);
    this.userForm.get('role').setValue(this.roles[this.userEditing.role.id]);
    //this.selectedRole = this.roles.findIndex(x => x == "Administrador");
    this.userForm.get('username').setValue(this.userEditing.username);
    this.userForm.get('imgurl').setValue(this.userEditing.imgurl);

  } else {
    this.nameRandom = Math.floor(Math.random() * this.namePlaceholder.length);
    this.emailRandom = Math.floor(Math.random() * this.emailPlaceholder.length);
    this.usernameRandom = Math.floor(Math.random() * this.usernamePlaceholder.length);
    this.passwordRandom = Math.floor(Math.random() * this.passwordPlaceholder.length);
    this.imgRandom = Math.floor(Math.random() * this.imgPlaceholder.length);
  } }

  async dismiss() {
    console.log("Dismiss");
    await this.modalCtrl.dismiss();
  }
  getEmailErrorMessage() {
    if (this.userForm.get('email').hasError('required')) {
      return 'El correo es requerido';
    }

    if (this.userForm.get('email').hasError('email')) {
      return 'No es un correo valido';
    }

  }

  getNameErrorMessage() {
    if (this.userForm.get('name').hasError('required')) {
      return 'Por favor ingrese su nombre';
    }
  }

  getPasswordErrorMessage() {
    if (this.userForm.get('password').hasError('required')) {
      return 'Por favor ingrese un correo electrónico';
    }
  }

  getFormErrorMessage() {
    if (this.userForm.hasError('required', 'password')) {
      return 'Por favor ingrese una contraseña';
    }
  }

  getForm2ErrorMessage() {
    if (this.userForm.hasError('notSame')) {
      return 'Las contraseñas no coinciden';
    }
  }

  getUsernameErrorMessage() {
    if (this.userForm.get('username').hasError('required')) {
      return 'Por favor ingrese un nombre de usuario';
    }
  }

  getRoleErrorMessage() {
    if (this.userForm.get('role').hasError('required')) {
      return 'Por favor ingrese un tipo de usuario';
    }
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('password2').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit() {

    if (this.userForm.invalid) {
      console.log("Form invalid");
      return;
    }

    var newUser: User = {
      _id: { $oid: "" },
      name: this.userForm.get('name').value,
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value,
      username: this.userForm.get('username').value,
      role: {
        id: this.roles.findIndex(x => x == this.userForm.get('role').value),
        name: this.userForm.get('role').value
      },
      tokensfcm: [],
      imgurl: this.userForm.get('imgurl').value,
    };

    console.log(newUser);

    if(this.data.isEdit){
      newUser._id.$oid = this.userEditing._id.$oid;
      this.userStore.updateUser(this.userEditing._id.$oid, newUser, true).then(x => {
        if(this.userEditing._id.$oid == this.authService.currentUserValue._id.$oid){
          this.authService.currentUserSubject.next(newUser);
          this.authService.userUpdate(newUser);
          this.dismiss();
        } else {
          this.dismiss();
        }
      });
      //this.userStore.updateUser(this.userEditing._id.$oid, newUser);
    } else {
      this.userStore.addUser(newUser).then(x => this.dismiss())
    }
  }

  updateUrl(event: any,) {
    console.log(event);
    this.hideDefaultImage = false;
  }

  clearValue(formControlName: string){
    this.userForm.get(formControlName).setValue("");
  }
}

