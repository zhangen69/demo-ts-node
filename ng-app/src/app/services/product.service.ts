import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../templates/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) { }

  create(formData) {
    this.http.post(environment.apiUrl + '/service/product', formData).subscribe((data: any) => {
      this.snackBar.open(data.message, 'Dismiss', {
        duration: 3000,
      });
      this.router.navigate(['/product/list']);
    });
  }

  update(formData) {
    this.http.put(environment.apiUrl + '/service/product', formData).subscribe((data: any) => {
      this.snackBar.open(data.message, 'Dismiss', {
        duration: 3000,
      });
      this.router.navigate(['/product/list']);
    });
  }

  fetch(id, formData = null) {
    const fetchData = this.http.get(environment.apiUrl + '/service/product/' + id);

    if (formData !== null) {
      fetchData.subscribe((res: any) => formData = res.data);
      return;
    }

    return fetchData;
  }

  fetchAll(queryModel) {
    return this.http.get(environment.apiUrl + '/service/product?queryModel=' + JSON.stringify(queryModel));
  }

  delete(item) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { item } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(environment.apiUrl + '/service/product/' + result._id).subscribe((res: any) => {
          this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
          window.location.reload();
        });
      }
    });
  }
}
