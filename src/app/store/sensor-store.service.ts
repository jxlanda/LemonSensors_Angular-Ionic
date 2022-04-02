import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Sensor } from '../models/sensor.model';
import { SensorsService } from '../services/sensors.service';
import { uuid } from './users-store.service';

@Injectable({
  providedIn: 'root'
})
export class SensorStoreService {

  constructor(private sensorsService: SensorsService) {
    this.fetchAll();
  }

  private readonly _sensors = new BehaviorSubject<Sensor[]>([]);
  readonly sensors$ = this._sensors.asObservable();

  // Sensors temp deleted
  _sensorDeleted: Sensor;

  get sensors(): Sensor[] {
    return this._sensors.getValue();
  }

  set sensors(val: Sensor[]) {
    this._sensors.next(val);
  }

  async addSensor(sensorToAdd: Sensor) {

    if(sensorToAdd) {

      // This is called an optimistic update
      // updating the record locally before actually getting a response from the server
      // this way, the interface seems blazing fast to the enduser
      // and we just assume that the server will return success responses anyway most of the time.
      // if server returns an error, we just revert back the changes in the catch statement 

      const tmpId = uuid();
      const tempSensor: Sensor = sensorToAdd;
      tempSensor._id.$oid = tmpId;

      this.sensors = [
        ...this.sensors, 
        tempSensor
      ];

      try {
        // POST Sensor
        const sensorId = await this.sensorsService
          .create(sensorToAdd)
          .toPromise();

        console.log(sensorId);
        // we swap the local tmp record with the record from the server (id must be updated)
        const index = this.sensors.indexOf(this.sensors.find(t => t._id.$oid === tmpId));

        sensorToAdd._id.$oid = sensorId.$oid;

        this.sensors[index] = {
          ...sensorToAdd
        }

        this.sensors = [...this.sensors];
      } catch (e) {
        // is server sends back an error, we revert the changes
        console.error(e);
        console.error("Necesitamos eliminar el registro");
        this.removeSensor(tmpId, false);
      } 
    }
  }

  async removeSensor(id: string, serverRemove = true) {
    //optimistic update
    this._sensorDeleted = this.sensors.find(t => t._id.$oid === id);
    this.sensors = this.sensors.filter(todo => todo._id.$oid !== id);

    if(serverRemove) {
      try {
        var response = await this.sensorsService.remove(id).toPromise();
        console.log(response);
      } catch (e) {
        console.error(e);
        this.sensors = [...this.sensors, this._sensorDeleted];
      }
    }
  }

  
  readSensor(){
    this.sensors = [...this.sensors, this._sensorDeleted];
  }

  async updateSensor(id: string, sensorToUpdate: Sensor) {
    let sensor = this.sensors.find(item => item._id.$oid === id);

    if(sensor) {
      // optimistic update
      const index = this.sensors.indexOf(sensor);

      this.sensors[index] = {
        ...sensorToUpdate
      }

      console.log(this.sensors);

      this.sensors = [...this.sensors];

      console.log(this.sensors);

      try {
        var response = await this.sensorsService
          .update(id, sensorToUpdate)
          .toPromise();

        console.log(response);

      } catch (e) {

        console.error(e);
        this.sensors[index] = {
          ...sensor
        }
      }
    }
  }

  async fetchAll() {
    this.sensors = await this.sensorsService.index().toPromise();
    console.log(this.sensors);
  }
}
