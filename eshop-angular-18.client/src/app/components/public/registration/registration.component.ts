import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../app/services/user.service';
import { passwordsMustMatchValidator }
  from '../../../../app/validators/passwordsMustMatch';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  submitted = signal<boolean>(false);
  success =signal<boolean>(false);
  errorMessage = signal<string>("");
  returnUrl = signal<string>('/');
  captchaResolved = signal<boolean>(false);

  registrationForm = new FormGroup({
    firstName: new FormControl('',
      [Validators.required, Validators.minLength(1)]),
    lastName: new FormControl('',
      [Validators.required, Validators.minLength(1)]),
    username: new FormControl('',
      [Validators.required, Validators.minLength(4)]),
    password: new FormControl('',
      Validators.required),
    confirmPassword: new FormControl('',
      Validators.required),
    email: new FormControl('',
      [Validators.required, Validators.email]),
    recaptcha: new FormControl('',
      [Validators.required])
  }, { validators: [passwordsMustMatchValidator] });

  constructor(private userService: UserService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.warn(this.registrationForm.value);
    this.submitted.set(true);
    if (!this.registrationForm.valid)
      return;

    this.userService.addUser({
      firstName: this.registrationForm.controls['firstName'].value || '',
      lastName: this.registrationForm.controls['lastName'].value || '',
      username: this.registrationForm.controls['username'].value || '',
      password: this.registrationForm.controls['password'].value || '',
      email: this.registrationForm.controls['email'].value || ''
    })
      .subscribe({
        next: () => {
          this.success.set(true);
          this.registrationForm.disable();
          this.returnUrl.set(this.route.snapshot.queryParams['returnUrl']
            || '/');
        },
        error: error => {
          this.success.set(false);
          this.errorMessage = error.error;
        }
      });
  }

  onCaptchaResolved(result: string | null) {
    this.captchaResolved.set((result) ? true : false);
  }
}
