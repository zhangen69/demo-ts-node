import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  mode = 'create';
  formData: any = { name: null, price: null };

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.http.get(environment.apiUrl + '/service/product/' + params['id']).subscribe((res: any) => {
          this.formData = res.data;
          this.mode = 'edit';
        });
      }
    });
  }

  onSubmit() {
    if (this.mode === 'edit') {
      this.http.put(environment.apiUrl + '/service/product', this.formData).subscribe((data: any) => {
        this.snackBar.open(data.message, 'Dismiss', {
          duration: 3000,
        });
        this.router.navigate(['/product/list']);
      });
    } else {
      this.http.post(environment.apiUrl + '/service/product', this.formData).subscribe((data: any) => {
        this.snackBar.open(data.message, 'Dismiss', {
          duration: 3000,
        });
        this.router.navigate(['/product/list']);
      });
    }
  }
}
