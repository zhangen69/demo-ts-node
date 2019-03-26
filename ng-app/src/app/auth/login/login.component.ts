import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formData: any = { username: null, password: null };

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.formData);
  }

}
