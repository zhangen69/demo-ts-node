import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formData = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    displayName: ['', Validators.required],
    email: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(formData: any) {
    this.authService.register(formData);
  }

}
