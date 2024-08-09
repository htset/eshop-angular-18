import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../app/services/user.service';
import { passwordsMustMatchValidator } from '../../../../app/validators/passwordsMustMatch';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  submitted = signal<boolean>(false);
  success = signal<boolean>(false);
  errorMessage = signal<string>("");
  emailCode = signal<string>("");

  newPasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: [passwordsMustMatchValidator] });

  constructor(
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => this.emailCode.set(params['code']));
  }

  onSubmit() {
    this.submitted.set(true);
    if (!this.newPasswordForm.valid)
      return;

    this.userService.changePassword(
      this.newPasswordForm.controls['password'].value || '',
      this.emailCode()
    )
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
