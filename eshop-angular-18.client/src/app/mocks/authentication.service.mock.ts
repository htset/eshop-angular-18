import { BehaviorSubject, of } from 'rxjs';
import { User } from '../models/user';

let testUser: User =
{
  id: 1,
  username: 'test',
  password: '',
  firstName: 'Test',
  lastName: 'user',
  token: '',
  role: 'admin',
  email: 'test@test.com'
};

export class AuthenticationServiceStub {

  public get currentUserValue(): User {
    let currentUserSubject: BehaviorSubject<User>
      = new BehaviorSubject<User>(testUser);
    return currentUserSubject.value;
  }
}
