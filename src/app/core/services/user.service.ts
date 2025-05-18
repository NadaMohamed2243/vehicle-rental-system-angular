import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    location: {
      city: 'mansoura'
    }
  };


  getUser(): User {
    return this.currentUser;
  }

  constructor() { }
}
