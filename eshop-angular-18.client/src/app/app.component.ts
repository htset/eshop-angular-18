import { Component } from '@angular/core';
import { StoreService } from './services/store.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user: User | null = null;

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    public storeService: StoreService
  ) {
    this.storeService.user$.subscribe(x => this.user = x);
  }

  logout(e: Event) {
    e.preventDefault();
    const currentUser = this.storeService.user;
    this.authenticationService.logout(currentUser?.refreshToken || '');
    this.router.navigate(['/login']);
  }
}
