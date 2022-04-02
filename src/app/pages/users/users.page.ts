import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Role, User } from 'src/app/models/user.model';
import { UsersStoreService } from 'src/app/store/users-store.service';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from 'src/app/components/user-modal/user-modal.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { UserModalMobileComponent } from 'src/app/components/user-modal-mobile/user-modal-mobile.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DeactivatableComponentInterface } from 'src/app/components/deactivable/deactivable.component';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, DeactivatableComponentInterface {

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentUser: User = null;

  canDeactivateVar: boolean;

  filterTerm: string = '';
  panelOpenState: boolean = false;
  isDesktop: boolean = false;
  isMobile: boolean = false;

  array: any[] = [];
  displayedColumns: string[] = ['imgurl', 'name', 'username', 'email', 'role', 'actions'];
  dataSource: MatTableDataSource<User>;
  loading: boolean = false;
  users: User[] = [];
  @ViewChildren('panel', { read: ElementRef }) panels;

  constructor(private userStore: UsersStoreService,
    public dialog: MatDialog,
    public platform: Platform,
    private authService: AuthenticationService,
    public modalController: ModalController,
    public toastController: ToastController) {

    console.log(this.platform);

    this.authService.currentUser.subscribe( x=> {
      this.currentUser = x;
      console.log(this.currentUser.role.id);
      if(this.currentUser.role.id == 1){
        this.displayedColumns = ['imgurl', 'name', 'username', 'email', 'role'];
      }
    });
    
    if (this.platform.is('desktop')) {
      this.isDesktop = true;
    }

    if (this.platform.is('mobileweb') || this.platform.is('mobile')) {
      this.isMobile = true;
    }

    if (this.platform.width() >= 576) {
      this.isMobile = false;
      this.isDesktop = true;
    } else {
      this.isMobile = true;
      this.isDesktop = false;
    }

    this.platform.resize.subscribe(async (data) => {
      if (this.platform.width() >= 576) {
        this.isMobile = false;
        this.isDesktop = true;
      } else {
        this.isMobile = true;
        this.isDesktop = false;
      }
    });

    this.loading = true;
    this.userStore.users$.subscribe(data => {
      if (data.length == 0) {
        this.array = [];
        var userEmpty: User = { _id: null, email: null, password: null, tokensfcm: null, imgurl: null, name: null, role: { id: null, name: null }, username: null }
        for (var i = 0; i < 5; i++) {
          this.array.push(userEmpty);
        }
        this.dataSource = new MatTableDataSource(this.array);
      } else {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data, filter) => {
          return data.role.name.toLocaleLowerCase().includes(filter) ||
            data.email.toLocaleLowerCase().includes(filter) ||
            data.name.toLocaleLowerCase().includes(filter) ||
            data.username.toLocaleLowerCase().includes(filter);
        }
        // this.dataSource.filterPredicate = (data, filter) => {
        //   const dataStr = data.position + data.details.name + data.details.symbol + data.details.weight;
        //   return dataStr.indexOf(filter) != -1; 
        // }
        console.log(this.dataSource.data);
      }
    });

  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    console.log(this.canDeactivateVar);
    if (!this.canDeactivateVar) {
      this.dismissModal();
      return false;
    } else {
      return this.canDeactivateVar;
    }
  }

  ngOnInit() {
    this.canDeactivateVar = true;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    this.loading = false;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData)
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: { isEdit: false, user: null },
      height: 'auto',
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal fue cerrado');
    });
  }

  editUserDialog(user: User): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: { isEdit: true, user: user },
      height: 'auto',
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal fue cerrado');
    });
  }

  openConfirmDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      autoFocus: false,
      data: {
        title: "Eliminar usuario",
        content: "El usuario se eliminara permanentemente"
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog result: ${result}`);
      if (result == true) {

        this.removeUser(id, false);

        var deleteItem: Boolean = true;
        const toast = await this.toastController.create({
          message: 'Usuario eliminado',
          duration: 3000,
          position: 'bottom',
          buttons: [
            {
              text: 'Deshacer',
              handler: () => {
                deleteItem = false;
                console.log('Deshacer');
              }
            }
          ]
        });

        toast.onWillDismiss().then(x => {
          if (deleteItem) {
            console.log("No se cancelo, se eliminara");
            this.removeUser(id, true);
          } else {
            console.log("Se reagregara el usuario");
            this.readdUser(id);
          }
        })
        toast.present();
      }
    });
  }

  removeUser(id: string, server: boolean): void {
    console.log("Eliminando: ", id);
    this.userStore.removeUser(id, server);
  }

  readdUser(id: string): void {
    console.log("Deshaciendo: ", id);
    this.userStore.readdUser(id);
  }

  async addIonicModal() {
    var data: DialogData = {
      isEdit: false,
      user: null
    }
    const modal = await this.modalController.create({
      component: UserModalMobileComponent,
      componentProps: {
        'data': data
      }
    });
    this.canDeactivateVar = false;
    modal.onDidDismiss().then((_) => {
      this.canDeactivateVar = true;
    });
    return await modal.present();
  }

  async editIonicModal(user: User) {
    console.log(user);
    var data: DialogData = {
      isEdit: true,
      user: user
    }
    const modal = await this.modalController.create({
      component: UserModalMobileComponent,
      componentProps: {
        'data': data
      }
    });
    this.canDeactivateVar = false;
    modal.onDidDismiss().then((_) => {
      this.canDeactivateVar = true;
    });
    return await modal.present();
  }

  opened(i: number, panel: MatExpansionPanel) {
    this.panels
      .toArray()[i]
      .nativeElement
      .scrollIntoView({ behavior: 'smooth' });
  }

  async dismissModal() {
    this.canDeactivateVar = true;
    return await this.modalController.dismiss();
  }
}

export interface DialogData {
  isEdit: boolean;
  user: User
}
