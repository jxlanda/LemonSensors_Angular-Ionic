import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, shareReplay } from 'rxjs/operators'
import { AddedUser, LoginKeys, User } from '../models/user.model';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  private readonly apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  index() {
    return this.http.get<User[]>(`${this.apiBaseUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  login(keys: LoginKeys) {
    return this.http.post<any>(`${this.apiBaseUrl}/login`, keys).pipe(
      catchError(this.handleError)
    );
  }

  getOneById(id: string) {
    return this.http.get(`${this.apiBaseUrl}/user/${id}`).pipe(catchError(this.handleError));
  }


  create(user: User) {
    return this.http.post<AddedUser>(`${this.apiBaseUrl}/user/create`, user).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, user: User, updatepassword: boolean = true) {
    return this.http.put<User>(`${this.apiBaseUrl}/user/${id}?updatepassword=${updatepassword}`, user).pipe(
      catchError(this.handleError)
    );
  }

  remove(id: string) {
    return this.http.delete(`${this.apiBaseUrl}/user/${id}`).pipe(
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
