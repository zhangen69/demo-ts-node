import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  formData = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
  });
  mode = 'new';

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  onSubmit(formData) {
    this.authService.forgotPassword(formData).subscribe((res: any) => {
      this.mode = 'sent';
    }, (res: any) => {
      this.toastr.error(res.error.message);
    });
  }

}
