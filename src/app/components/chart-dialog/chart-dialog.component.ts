import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FilterData } from 'src/app/models/history.model';
import { Sensor } from 'src/app/models/sensor.model';
import { HistoryPage } from 'src/app/pages/history/history.page';
import { HistoryStoreService } from 'src/app/store/history-store.service';
import { SensorStoreService } from 'src/app/store/sensor-store.service';

@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chart-dialog.component.html',
  styleUrls: ['./chart-dialog.component.scss'],
})
export class ChartDialogComponent implements OnInit {

  chartForm: FormGroup;
  sensors: Sensor[] = [];
  // Filter data
  filter: FilterData = {
    from: null,
    to: null,
    sensorid: null
  }
  
  constructor(public dialogRef: MatDialogRef<HistoryPage>,
    private sensorStore: SensorStoreService,
    private historyStore: HistoryStoreService,
    private formBuilder: FormBuilder) { 
    this.chartForm = this.formBuilder.group({
      chartDateRange: this.formBuilder.group({
        startDate: new FormControl('',[Validators.required]),
        endDate: new FormControl('',[Validators.required])
        }),
      sensor: new FormControl('',[Validators.required])
    });
    this.sensorStore.sensors$.subscribe(data => {
      this.sensors = data;
    })
  }

  ngOnInit() {}

  getDateRangeErrorMessage() {

    // if (this.chartForm.get('chartDateRange').hasError('required')) {
    //   return 'Por favor seleccione un rango de fechas';
    // } 

    if(this.chartForm.get('chartDateRange').invalid){
      return 'Por favor seleccione un rango de fechas valido';
    }

    // if(this.chartForm.get('chartDateRange').get('startDate').hasError('required')){
    //   return 'La fecha de inicio es requerida';
    // } 

    // if(this.chartForm.get('chartDateRange').get('startDate').hasError('matStartDateInvalid')){
    //   return 'La fecha de inicio no es valida';
    // } 

    // if(this.chartForm.get('chartDateRange').get('endDate').hasError('matEndDateInvalid')){
    //   return 'La fecha de fin no es valida';
    // }

    // if(this.chartForm.get('chartDateRange').get('endDate').hasError('required')){
    //   return 'La fecha de fin es requerida';
    // }
  }

  getSensorErrorMessage() {
    if (this.chartForm.get('sensor').hasError('required')) {
      return 'Por favor seleccione un sensor';
    }
  }

  onSubmit() {
    if (this.chartForm.invalid) {
      return;
    }

    this.filter = {
      from: new Date(this.chartForm.get('chartDateRange').get('startDate').value),
      to: this.chartForm.get('chartDateRange').get('endDate').value,
      sensorid: this.chartForm.get('sensor').value
    }

    console.log(this.filter);

    this.historyStore.getHistoryByRange(this.filter).then(data => {
      console.log(data);
      this.dialogRef.close(data);
    }); 
  }

}
