import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getAddressByUserId(userId: number) {
    return this.http.get<Address[]>(`${environment.apiUrl}/address`);
  }

  saveAddress(address: Address) {
    return this.http.post<Address>(`${environment.apiUrl}/address`, address);
  }

  deleteAddress(addressId?: number) {
    return this.http.delete<number>(`${environment.apiUrl}/address/${addressId}`);
  }

  addUser(user: User) {
    return this.http
      .post<User>(`${environment.apiUrl}/users`, user, this.httpOptions);
  }

  confirmRegistration(code: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/users/confirm_registration`,
        { code: code }, this.httpOptions);
  }

  resetPassword(email: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/users/reset_password`,
        { email: email }, this.httpOptions);
  }

  changePassword(newPassword: string, emailCode: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/users/change_password`,
        { password: newPassword, registrationCode: emailCode },
        this.httpOptions
      );
  }

}


