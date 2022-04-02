import { Injectable } from '@angular/core';
import { of, Subscribable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { flatMap, map } from 'rxjs/operators';
import { LoginKeys, User } from '../models/user.model';
import { JwtService } from './jwt.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Current User
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public userUpdate(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  login(keys: LoginKeys): Observable<any> {
    return this.usersService.login(keys).pipe(map((data) => {
      console.log(data.token);
      if(data.token != null){
        this.jwtService.setToken(data.token);
        var userid = this.jwtService.getUserId();
        console.log(userid);
        return this.usersService.getOneById(userid).pipe(map(user => {
          console.log(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user as User);
          //return user;
        })).subscribe();
      }
    }));

  }

  logout() {
    // Remove User from local storage
    localStorage.removeItem('currentUser');
    this.jwtService.removeToken();
    this.currentUserSubject.next(null);
  }

}
