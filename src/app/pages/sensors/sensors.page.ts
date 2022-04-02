import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { SensorModalMobileComponent } from 'src/app/components/sensor-modal-mobile/sensor-modal-mobile.component';
import { SensorModalComponent } from 'src/app/components/sensor-modal/sensor-modal.component';
import { Sensor } from 'src/app/models/sensor.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SensorStoreService } from 'src/app/store/sensor-store.service';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.page.html',
  styleUrls: ['./sensors.page.scss'],
})
export class SensorsPage implements OnInit {

  // Close modal
  canDeactivateVar: boolean;
  // User
  user: User = null;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterTerm: string = '';
  panelOpenState: boolean = false;
  isDesktop: boolean = false;
  isMobile: boolean = false;


  array: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'brand', 'model', 'category', 'measurement', 'storageplace', 'actions'];

  dataSource: MatTableDataSource<Sensor>;
  loading: boolean = false;
  sensors: Sensor[] = [];
  @ViewChildren('panel', { read: ElementRef }) panels;

  constructor(private sensorStore: SensorStoreService,
    public dialog: MatDialog,
    public platform: Platform,
    private authService: AuthenticationService,
    public modalController: ModalController,
    public toastController: ToastController) {

    this.authService.currentUser.subscribe( x=> {
      this.user = x;
      console.log(this.user.role.id);
      if(this.user.role.id == 1){
        this.displayedColumns = ['name', 'description', 'brand', 'model', 'category', 'measurement', 'storageplace'];
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
    this.sensorStore.sensors$.subscribe(data => {
      if (data.length == 0) {
        this.array = [];
        var sensorEmpty: Sensor = {
          _id: null,
          name: null,
          description: null,
          brand: null,
          model: null,
          category: null,
          measurement: null,
          minvoltage: null,
          maxvoltage: null,
          storageplace: null,
          config: {
            sensinginseconds: null,
            minvalue: null,
            maxvalue: null
          },
          user: {
            id: null,
            username: null,
            email: null,
            imgurl: null,
          }
        }
        for (var i = 0; i < 5; i++) {
          this.array.push(sensorEmpty);
        }
        this.dataSource = new MatTableDataSource(this.array);
      } else {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.data);
      }
    });
  }

  canDeactivate () : boolean | Observable<boolean> | Promise<boolean> {
    console.log(this.canDeactivateVar);
    if(!this.canDeactivateVar){
      this.dismissModal();
      return false;
    }else {
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
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SensorModalComponent, {
      data: {
        isEdit: false, 
        sensor: null
      },
      height: 'auto',
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  editSensorDialog(sensor: Sensor): void {
    const dialogRef = this.dialog.open(SensorModalComponent, {
      data: {isEdit: true, sensor: sensor},
      height: 'auto',
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  openConfirmDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { 
      autoFocus: false, 
      data: {
        title: "Eliminar sensor",
        content: "El sensor se eliminara permanentemente"
      } 
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog result: ${result}`);
      if(result == true){

        this.removeSensor(id, false);

        var deleteItem: Boolean = true;
        const toast = await this.toastController.create({
          message: 'Sensor eliminado',
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
          if(deleteItem){
            console.log("No se cancelo, se eliminara");
            this.removeSensor(id, true);
          } else {
            console.log("Se reagregara el sensor");
            this.readSensor(id);
          }
        })
        toast.present();
      }
    });
  }

  removeSensor(id: string, server: boolean): void {
    console.log("Eliminando: ", id);
    this.sensorStore.removeSensor(id, server);
  }

  readSensor(id: string): void {
    console.log("Deshaciendo: ", id);
    this.sensorStore.readSensor();
  }

  // Mobile 

  async addIonicModal() {
    var data: DialogData = {
      isEdit: false,
      sensor: null
    }
    const modal = await this.modalController.create({
      component: SensorModalMobileComponent,
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

  async editIonicModal(sensor: Sensor) {
    console.log(sensor);
    var data: DialogData = {
      isEdit: true,
      sensor: sensor
    }
    const modal = await this.modalController.create({
      component: SensorModalMobileComponent,
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
  sensor: Sensor
}

export interface ConfirmDialogData {
  content: string;
  title: string;
}

