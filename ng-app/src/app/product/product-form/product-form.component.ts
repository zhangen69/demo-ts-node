import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  formData: any = { name: null, price: null };

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    this.http.post(environment.apiUrl + '/service/product', this.formData).subscribe((data: any) => {
      this.snackBar.open(data.message, 'Dismiss', {
        duration: 3000,
      });
      this.router.navigate(['/product/list']);
    });
  }
}
