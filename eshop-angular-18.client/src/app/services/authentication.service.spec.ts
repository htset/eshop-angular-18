import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StoreService } from './store.service';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let storeService: StoreService;
  let httpTestingController: HttpTestingController;
  let expectedUser: User = { username: "usr", password: "passwd" };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    authService = TestBed.inject(AuthenticationService);
    storeService = TestBed.inject(StoreService);
    httpTestingController = TestBed.inject(HttpTestingController);

    sessionStorage.removeItem('user');
    storeService.user = null;
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it("should login user with correct credentials", () => {
    authService.login("usr", "passwd")
      .subscribe((user) => {
        expect(user).toEqual(expectedUser);
        expect(sessionStorage.getItem('user'))
          .toEqual(JSON.stringify(expectedUser));
        expect(storeService.user).toEqual(expectedUser);
      });

    const req = httpTestingController
      .expectOne(`${environment.apiUrl}/users/authenticate`);
    expect(req.request.method).toEqual('POST');

    req.flush(expectedUser);
  });

  it("should return error when logging in with incorrect credentials", () => {
    let expectedBadRequest = { message: "Log in failed" };
    authService.login("usr", "wrong_passwd")
      .subscribe({
        error: (e) => {
          expect(e.status).toEqual(400);
          expect(sessionStorage.getItem('user')).toBeNull();
          expect(storeService.user).toBeNull();
        }
      });

    const req = httpTestingController
      .expectOne(`${environment.apiUrl}/users/authenticate`);
    expect(req.request.method).toEqual('POST');

    req.flush(expectedBadRequest, { status: 400, statusText: 'bad request' });
  });
});
