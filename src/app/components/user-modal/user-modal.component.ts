import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { DialogData, UsersPage } from 'src/app/pages/users/users.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersStoreService } from 'src/app/store/users-store.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {

  imagesmall: boolean = false;
  hideDefaultImage:boolean = false;
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

  constructor(public dialogRef: MatDialogRef<UsersPage>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userStore: UsersStoreService
    ) {

    this.userForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      imgurl: new FormControl('')
    }, { validators: this.checkPasswords });

    console.log(data);

    if(data.isEdit){
      this.userEditing = data.user;
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
    }

  }

  ngOnInit() { }

  getEmailErrorMessage() {
    if (this.userForm.get('email').hasError('required')) {
      return 'Correo requerido';
    }

    if (this.userForm.get('email').hasError('email')) {
      return 'No es un correo valido';
    }

  }

  getNameErrorMessage() {
    if (this.userForm.get('name').hasError('required')) {
      return 'Nombre completo requerido';
    }
  }

  getPasswordErrorMessage() {
    if (this.userForm.get('password').hasError('required')) {
      return 'Correo electrónico requerido';
    }
  }

  getFormErrorMessage() {
    if (this.userForm.hasError('required', 'password')) {
      return 'Contraseña requerida';
    }
  }

  getForm2ErrorMessage() {
    if (this.userForm.hasError('notSame')) {
      return 'Las contraseñas no coinciden';
    }
  }

  getUsernameErrorMessage() {
    if (this.userForm.get('username').hasError('required')) {
      return 'Nombre de usuario requerido';
    }
  }

  getRoleErrorMessage() {
    if (this.userForm.get('role').hasError('required')) {
      return 'Tipo de usuario requerido';
    }
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('password2').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit() {

    if (this.userForm.invalid) {
      return;
    }

    var newUser: User = {
      _id: {$oid: ""},
      name: this.userForm.get('name').value,
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value,
      username: this.userForm.get('username').value,
      role: { 
        id: this.roles.findIndex(x => x == this.userForm.get('role').value), 
        name: this.userForm.get('role').value 
      },
      tokensfcm: [],
      imgurl: this.userForm.get('imgurl').value
    };

    console.log(newUser);

    if(this.data.isEdit){
      newUser._id.$oid = this.userEditing._id.$oid;
      this.userStore.updateUser(this.userEditing._id.$oid, newUser, true).then(x => {
        if(this.userEditing._id.$oid == this.authService.currentUserValue._id.$oid){
          this.authService.currentUserSubject.next(newUser);
          this.authService.userUpdate(newUser);
        }
      });
    } else {
      this.userStore.addUser(newUser);
    }
    this.dialogRef.close();
  }

  updateUrl(event: any, ){
    console.log(event);
    //event.target.style.display = 'none';
    this.hideDefaultImage = false;
    // event.target.src = "../assets/img/image-not-found.png";
    // event.target.style.display = '';
    //event.srcElement.currentSrc = "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg";
  }

  clearValue(formControlName: string){
    this.userForm.get(formControlName).setValue("");
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return control.parent.errors && control.parent.errors && control.touched && (invalidCtrl || invalidParent);
  }
}
