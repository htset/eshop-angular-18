import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './components/public/items/items.component';
import { ItemDetailsComponent } from './components/public/item-details/item-details.component';
import { CartComponent } from './components/public/cart/cart.component';
import { LoginComponent } from './components/public/login/login.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AuthGuard } from './helpers/auth.guard';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { CheckoutComponent } from './components/public/checkout/checkout.component';
import { PaymentComponent } from './components/public/payment/payment.component';
import { SummaryComponent } from './components/public/summary/summary.component';

const routes: Routes = [
  { path: '', component: ItemsComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'items/:id', component: ItemDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'summary', component: SummaryComponent },  
  {
    path: 'admin', component: AdminHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: AdminUsersComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
