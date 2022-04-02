import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, shareReplay } from 'rxjs/operators'
import { throwError } from 'rxjs/internal/observable/throwError';
import { AddedSensor, Sensor } from '../models/sensor.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {

  private readonly apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  index() {
    return this.http.get<Sensor[]>(`${this.apiBaseUrl}/sensors`).pipe(
      catchError(this.handleError)
    );
  }

  getOneById(id: string) {
    return this.http.get(`${this.apiBaseUrl}/sensor/${id}`).pipe(catchError(this.handleError));
  }


  create(sensor: Sensor) {
    return this.http.post<AddedSensor>(`${this.apiBaseUrl}/sensor/create`, sensor).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, sensor: Sensor) {
    return this.http.put<Sensor>(`${this.apiBaseUrl}/sensor/${id}`, sensor).pipe(
      catchError(this.handleError)
    );
  }

  remove(id: string) {
    return this.http.delete(`${this.apiBaseUrl}/sensor/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
