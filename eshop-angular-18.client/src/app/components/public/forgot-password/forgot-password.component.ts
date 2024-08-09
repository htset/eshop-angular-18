import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  submitted = signal<boolean>(false);
  success = signal<boolean>(false);
  errorMessage = signal<string>("");

  constructor(private userService: UserService) { }

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit(): void {
  }

  onSubmit() {
    console.warn(this.forgotForm.value);
    this.submitted.set(true);

    if (!this.forgotForm.valid)
      return;

    this.userService
      .resetPassword(this.forgotForm.controls['email'].value
    || '')
      .subscribe({
        next: () => {
          this.success.set(true);

        },
        error: error => {
          this.success.set(false);
          this.errorMessage = error.error;
        }
      });
  }
}
