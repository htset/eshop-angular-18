import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemsComponent } from './components/public/items/items.component';
import { ItemDetailsComponent } from './components/public/item-details/item-details.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './components/shared/filter/filter.component';
import { CartComponent } from './components/public/cart/cart.component';
import { LoginComponent } from './components/public/login/login.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { DeliveryAddressComponent } from './components/shared/delivery-address/delivery-address.component';
import { CheckoutComponent } from './components/public/checkout/checkout.component';
import { PaymentComponent } from './components/public/payment/payment.component';
import { SummaryComponent } from './components/public/summary/summary.component';
import { GlobalErrorHandler } from './helpers/global-error-handler';
import { ErrorInterceptor } from './helpers/error-interceptor';
import { ErrorDialogComponent } from './components/shared/error-dialog/error-dialog.component';
import { LoadingDialogComponent } from './components/shared/loading-dialog/loading-dialog.component';
import { AnalyticsDirective } from './directives/analytics.directive';
import { RegistrationComponent } from './components/public/registration/registration.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { RegistrationConfirmComponent } from './components/public/registration-confirm/registration-confirm.component';
import { ForgotPasswordComponent } from './components/public/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './components/public/new-password/new-password.component';
import { AdminItemsComponent } from './components/admin/admin-items/admin-items.component';
import { AdminItemFormComponent } from './components/admin/admin-item-form/admin-item-form.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminOrderDetailsComponent } from './components/admin/admin-order-details/admin-order-details.component';


@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemDetailsComponent,
    FilterComponent,
    CartComponent,
    LoginComponent,
    AdminHomeComponent,
    AdminUsersComponent,
    DeliveryAddressComponent,
    CheckoutComponent,
    PaymentComponent,
    SummaryComponent,
    ErrorDialogComponent,
    LoadingDialogComponent,
    AnalyticsDirective,
    RegistrationComponent,
    RegistrationConfirmComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    AdminItemsComponent,
    AdminItemFormComponent,
    AdminOrdersComponent,
    AdminOrderDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
