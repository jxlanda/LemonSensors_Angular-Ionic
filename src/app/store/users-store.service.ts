import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import {UsersService} from '../services/users.service';


@Injectable({
  providedIn: 'root'
})
export class UsersStoreService {

  constructor(private usersService: UsersService) {
    this.fetchAll();
  }

  private readonly _users = new BehaviorSubject<User[]>([]);

  // Expose the observable$ part of the _todos subject (read only stream)
  readonly users$ = this._users.asObservable();


  // we'll compose the todos$ observable with map operator to create a stream of only completed todos
  readonly onlyAdmin$ = this.users$.pipe(
    map(data => data.filter(user => user.role.id == 0))
  )

  readonly notAdmin$ = this.users$.pipe(
    map(data => data.filter(user => user.role.id != 0))
  )

  // User temp deleted
  _userDeleted: User;

  // the getter will return the last value emitted in _todos subject
  get users(): User[] {
    return this._users.getValue();
  }


  // assigning a value to this.todos will push it onto the observable 
  // and down to all of its subsribers (ex: this.todos = [])
  set users(val: User[]) {
    this._users.next(val);
  }

  async addUser(userToAdd: User) {

    if(userToAdd) {

      // This is called an optimistic update
      // updating the record locally before actually getting a response from the server
      // this way, the interface seems blazing fast to the enduser
      // and we just assume that the server will return success responses anyway most of the time.
      // if server returns an error, we just revert back the changes in the catch statement 

      const tmpId = uuid();
      const tempUser = userToAdd;
      tempUser._id.$oid = tmpId;

      this.users = [
        ...this.users, 
        tempUser
      ];

      try {
        const userId = await this.usersService
          .create(userToAdd)
          .toPromise();

        console.log(userId);
        // we swap the local tmp record with the record from the server (id must be updated)
        const index = this.users.indexOf(this.users.find(t => t._id.$oid === tmpId));

        userToAdd._id.$oid = userId.$oid;

        this.users[index] = {
          ...userToAdd
        }

        this.users = [...this.users];
      } catch (e) {
        // is server sends back an error, we revert the changes
        console.error(e);
        console.error("Necesitamos eliminar el registro");
        this.removeUser(tmpId, false);
      }
      
    }

  }

  async removeUser(id: string, serverRemove = true) {
    //optimistic update
    this._userDeleted = this.users.find(t => t._id.$oid === id);
    this.users = this.users.filter(todo => todo._id.$oid !== id);

    if(serverRemove) {
      try {
        var response = await this.usersService.remove(id).toPromise();
        console.log(response);
      } catch (e) {
        console.error(e);
        this.users = [...this.users, this._userDeleted];
      }

    }
  }

  readdUser(id: string){
    //const user = this.users.find(t => t._id.$oid === id);
    this.users = [...this.users, this._userDeleted];
    // this.users = this.users.filter(todo => todo._id.$oid == id || todo._id != null);
  }

  async updateUser(id: string, userToUpdate: User, updatePassword: boolean) {
    let user = this.users.find(item => item._id.$oid === id);

    if(user) {
      // optimistic update
      const index = this.users.indexOf(user);

      this.users[index] = {
        ...userToUpdate
      }

      console.log(this.users);

      this.users = [...this.users];

      console.log(this.users);

      try {
        var response = await this.usersService
          .update(id, userToUpdate, updatePassword)
          .toPromise();

        console.log(response);

      } catch (e) {

        console.error(e);
        this.users[index] = {
          ...user
        }
      }
    }
  }


  async fetchAll() {
    this.users = await this.usersService.index().toPromise();
    console.log(this.users);
  }
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}