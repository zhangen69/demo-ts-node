import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  formData = this.fb.group({
    token: [this.route.snapshot.params.token, Validators.required],
    username: ['', Validators.required],
    newPassword: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.authService.verifyResetPasswordToken(this.route.snapshot.params.token).subscribe((res: any) => {
      this.toastr.info('Please enter your username and new password.');
    }, (res: any) => {
      this.toastr.error(res.error.message);
      this.router.navigate(['/auth/login']);
    });
  }

  onSubmit(formData) {
    this.authService.resetPassword(formData);
  }

}
