import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../templates/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class StandardService {
  domain: string;
  apiUrl: string;

  constructor(private http: HttpClient, private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) {}

  init(domain) {
    this.domain = domain;
    this.apiUrl = `${environment.apiUrl}/service/${this.domain}`;
  }

  create(formData) {
    this.http.post(this.apiUrl, formData).subscribe((data: any) => {
      this.snackBar.open(data.message, 'Dismiss', { duration: 3000 });
      this.router.navigate([`/${this.domain}/list`]);
    });
  }

  update(formData) {
    this.http.put(this.apiUrl, formData).subscribe((data: any) => {
      this.snackBar.open(data.message, 'Dismiss', { duration: 3000 });
      this.router.navigate([`/${this.domain}/list`]);
    });
  }

  fetch(id, formData = null) {
    const fetchData = this.http.get(this.apiUrl + '/' + id);

    if (formData !== null) {
      fetchData.subscribe((res: any) => formData = res.data);
      return;
    }

    return fetchData;
  }

  fetchAll(queryModel = {}) {
    return this.http.get(this.apiUrl + '?queryModel=' + JSON.stringify(queryModel));
  }

  delete(item) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: item });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(this.apiUrl + '/' + result._id).subscribe((res: any) => {
          this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
          window.location.reload();
        });
      }
    });
  }
}
