import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, shareReplay } from 'rxjs/operators'
import { throwError } from 'rxjs/internal/observable/throwError';
import { FilterData, History } from 'src/app/models/history.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private readonly apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  index() {
    return this.http.get<History[]>(`${this.apiBaseUrl}/history`).pipe(
      catchError(this.handleError)
    );
  }

  getOneById(id: string) {
    return this.http.get(`${this.apiBaseUrl}/history/${id}`).pipe(catchError(this.handleError));
  }

  getByDateRange(filter: FilterData) {
    return this.http.post<History[]>(`${this.apiBaseUrl}/history/range`, filter).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    return throwError(
      'Something bad happened; please try again later.');
  }
}
