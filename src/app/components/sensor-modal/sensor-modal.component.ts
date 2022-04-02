import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SensorsPage } from 'src/app/pages/sensors/sensors.page';
import { DialogData } from 'src/app/pages/sensors/sensors.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonModule } from '@angular/common';
import { Sensor } from 'src/app/models/sensor.model'
import { SensorStoreService } from 'src/app/store/sensor-store.service';


@Component({
  selector: 'app-sensor-modal',
  templateUrl: './sensor-modal.component.html',
  styleUrls: ['./sensor-modal.component.scss'],
})
export class SensorModalComponent implements OnInit {

  sensorEditing: Sensor;

  measurementRandom: number
  minvoltageRandom: number
  maxvoltageRandom: number
  sensedinsecondsRandom: number
  storageplaceRandom: number
  configRandom: number
  sensinginsecondsRandom: number
  minvalueRandom: number
  maxvalueRandom: number

  selectedCategory: number = null;

  categories: string[] = [
    "Temperatura",
    "Humedad"
  ];

  measurementPlaceholder: string[] = [
    "Ej. Porcentaje",
    "Ej. Centigrados",
  ];
  

  /* minvoltagePlaceholder: string[] = [
    "1",
    "2",
    "3"
  ];
  
  maxvoltagePlaceholder: string[] = [
    "5",
    "6",
    "7"
  ];
  
  sensedinsecondsPlaceholder: string[] = [
    "2",
    "5",
    "10"
  ]; */

  /*
  configPlaceholder: string[] = [
    "???",
  
  ];
  
  sensinginsecondsPlaceholder: string[] = [
    "5"
  ];
  
  minvaluePlaceholder: string[] = [
    "0"
  ];
  
  maxvaluePlaceholder: string[] = [
    "45"
  ];
  */
  matcher = new MyErrorStateMatcher();
  sensorForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<SensorsPage>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private sensorStore: SensorStoreService) {

    this.sensorForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('',[Validators.required]),
      brand: new FormControl('',[Validators.required]),
      model: new FormControl('',[Validators.required]),
      category: new FormControl('',[Validators.required]),
      measurement: new FormControl('',[Validators.required]),
      storageplace: new FormControl('',[Validators.required]),
      maxvalue: new FormControl('',[Validators.required]),
      minvalue: new FormControl('',[Validators.required]),
      maxvoltage: new FormControl('',[Validators.required]),
      minvoltage: new FormControl('',[Validators.required]),
      sensinginseconds: new FormControl('', [Validators.required])
    });

    console.log(data);

    if (data.isEdit) {
      this.sensorEditing = data.sensor;
      this.sensorForm.get('name').setValue(this.sensorEditing.name);
      this.sensorForm.get('description').setValue(this.sensorEditing.description);
      this.sensorForm.get('brand').setValue(this.sensorEditing.brand);
      this.sensorForm.get('model').setValue(this.sensorEditing.model);
      this.sensorForm.get('category').setValue(this.sensorEditing.category);
      this.sensorForm.get('measurement').setValue(this.sensorEditing.measurement);
      this.sensorForm.get('storageplace').setValue(this.sensorEditing.storageplace);
      this.sensorForm.get('maxvalue').setValue(this.sensorEditing.config.maxvalue);
      this.sensorForm.get('minvalue').setValue(this.sensorEditing.config.minvalue);
      this.sensorForm.get('maxvoltage').setValue(this.sensorEditing.maxvoltage);
      this.sensorForm.get('minvoltage').setValue(this.sensorEditing.minvoltage);
      this.sensorForm.get('sensinginseconds').setValue(this.sensorEditing.config.sensinginseconds);

    } else {
      this.measurementRandom = Math.floor(Math.random() * this.measurementPlaceholder.length);
    }

  }

  ngOnInit() { }

  // Errors validations
  getNameErrorMessage() {
    if (this.sensorForm.get('name').hasError('required')) {
      return 'Por favor ingresa un nombre'
    }
  }

  getStoragePlaceErrorMessage() {
    if (this.sensorForm.get('storageplace').hasError('required')) {
      return 'Por favor ingresa un lugar'
    }
  }

  getBrandErrorMessage() {
    if (this.sensorForm.get('brand').hasError('required')) {
      return 'Por favor ingresa una marca'
    }
  }

  getCategoryErrorMessage() {
    if (this.sensorForm.get('category').hasError('required')) {
      return 'Por favor ingresa una categoría'
    }
  }

  getDescriptionErrorMessage() {
    if (this.sensorForm.get('description').hasError('required')) {
      return 'Por favor ingresa una descripción'
    }
  }

  getMaxVoltageErrorMessage() {
    if (this.sensorForm.get('maxvoltage').hasError('required')) {
      return 'Por favor ingresa el voltaje máximo'
    }
  }

  getMinVoltageErrorMessage() {
    if (this.sensorForm.get('minvoltage').hasError('required')) {
      return 'Por favor ingresa voltaje mínimo'
    }
  }

  getMeasurementErrorMessage() {
    if (this.sensorForm.get('measurement').hasError('required')) {
      return 'Por favor ingresa una medición'
    }
  }

  getModelErrorMessage() {
    if (this.sensorForm.get('model').hasError('required')) {
      return 'Por favor ingresa un modelo'
    }
  }

  
  getMaxValueErrorMessage() {
    if (this.sensorForm.get('maxvalue').hasError('required')) {
      return 'Por favor ingresa un valor máximo permitido'
    }
  }

  getMinValueErrorMessage() {
    if (this.sensorForm.get('maxvalue').hasError('required')) {
      return 'Por favor ingresa un valor mínimo permitido'
    }
  }

  getSensinginSecondsErrorMessage(){
    if (this.sensorForm.get('sensinginseconds').hasError('required')) {
      return 'Por favor ingresa el total en segundos'
    }
  }



  onSubmit() {
    
    if (this.sensorForm.invalid) {
      return;
    }

    var newSensor: Sensor = {
      _id: {$oid: ""},
      name: this.getFormValue('name'),
      brand: this.getFormValue('brand'),
      category: this.getFormValue('category'),
      config: {
        maxvalue: this.getFormValue('maxvalue'),
        minvalue: this.getFormValue('minvalue'),
        sensinginseconds: this.getFormValue('sensinginseconds')
      },
      description: this.getFormValue('description'),
      maxvoltage:  this.getFormValue('maxvoltage'),
      measurement: this.getFormValue('measurement'),
      minvoltage: this.getFormValue('minvoltage'),
      model: this.getFormValue('model'),
      storageplace: this.getFormValue('storageplace'),
      user: {
        email: this.authService.currentUserValue.email,
        id: this.authService.currentUserValue._id.$oid,
        imgurl: this.authService.currentUserValue.imgurl,
        username: this.authService.currentUserValue.username
      }
    };

    console.log(newSensor);

    if(this.data.isEdit){
      newSensor._id.$oid = this.sensorEditing._id.$oid;
      this.sensorStore.updateSensor(this.sensorEditing._id.$oid, newSensor).then(x => {
        console.log(x);
        this.sensorStore.updateSensor(this.sensorEditing._id.$oid, newSensor);
      });
    } else {
      this.sensorStore.addSensor(newSensor);
    }

    this.dialogRef.close();
  }

  getFormValue(formControlName: string){
    return this.sensorForm.get(formControlName).value;
  }

  clearValue(formControlName: string) {
    this.sensorForm.get(formControlName).setValue("");
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return control.parent.errors && control.parent.errors && control.touched && (invalidCtrl || invalidParent);
  }
}
