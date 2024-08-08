import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public storeService: StoreService,
    private http: HttpClient
  ) { }

  login(username: string, password: string) {
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`,
      { username, password })
      .pipe(
        map(user => {
          sessionStorage.setItem('user', JSON.stringify(user));
          this.storeService.user = user;
          return user;
        })
      );
  }

  logout(refreshToken: string) {
    this.http.post<any>(`${environment.apiUrl}/users/revoke`,
      { refreshToken })
      .subscribe();

    sessionStorage.removeItem('user');
    this.storeService.user = null;
  }

  refreshToken(token: string, refreshToken: string) {
    return this.http.post<User>(`${environment.apiUrl}/users/refresh`,
      { token, refreshToken })
      .pipe(
        map(user => {
          sessionStorage.setItem('user', JSON.stringify(user));
          this.storeService.user = user;
          return user;
        })
      );
  }
}
