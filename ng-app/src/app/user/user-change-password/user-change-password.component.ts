import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent implements OnInit {
  formData = this.formBuilder.group({
    password: [null, Validators.required],
    newPassword: [null, Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private userService: UserService, private authService: AuthService, private router: Router) {
    this.userService.init('user');
  }

  ngOnInit() {
  }

  onSubmit(formData) {
    this.userService.changePassword(formData);
  }

}
