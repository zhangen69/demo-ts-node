import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { ConfirmationDialogComponent } from '../templates/confirmation-dialog/confirmation-dialog.component';
import { IQueryModel } from '../interfaces/query-model';
import { UploadType } from '../enums/upload-type.enum';

@Injectable({
  providedIn: 'root'
})
export class StandardService {
  domain: string;
  apiUrl: string;
  queryModel: IQueryModel;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  init(domain, queryModel = null) {
    this.domain = domain;
    this.apiUrl = `${environment.apiUrl}/service/${this.domain}`;
    this.queryModel = queryModel;
  }

  create(formData) {
    this.http.post(this.apiUrl, formData).subscribe(
      (data: any) => {
        this.snackBar.open(data.message, 'Dismiss', { duration: 3000 });
        this.router.navigate([`/${this.domain}/list`]);
      },
      (res: any) => {
        this.snackBar.open(res.error.message, 'Dismiss', { duration: 3000 });
      }
    );
  }

  update(formData) {
    this.http.put(this.apiUrl, formData).subscribe(
      (res: any) => {
        this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
        this.router.navigate([`/${this.domain}/list`]);
      },
      (res: any) => {
        this.snackBar.open(res.error.message, 'Dismiss', { duration: 3000 });
      }
    );
  }

  fetch(id, formData = null) {
    const fetchData = this.http.get(this.apiUrl + '/' + id);

    if (formData !== null) {
      fetchData.subscribe(
        (res: any) => (formData = res.data),
        (res: any) =>
          this.snackBar.open(res.error.message, 'Dismiss', { duration: 3000 })
      );
      return;
    }

    return fetchData;
  }

  fetchAll(queryModel = {}, currentPage) {
    this.queryModel.currentPage = currentPage;
    return this.http.get(
      this.apiUrl + '?queryModel=' + JSON.stringify(queryModel)
    );
  }

  delete(item) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(this.apiUrl + '/' + result._id).subscribe(
          (res: any) => {
            this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
            window.location.reload();
          },
          (res: any) => {
            this.snackBar.open(res.error.message, 'Dismiss', {
              duration: 3000
            });
          }
        );
      }
    });
  }

  uploadImage(file: File, type: UploadType = UploadType.Multer) {
    const formData = new FormData();
    formData.append('image', file);

    let uploadUrl = '/multer';

    if (type === UploadType.Cloudinary) {
      uploadUrl = '/cloudinary';
    }

    return this.http
      .post(environment.apiUrl + uploadUrl + '/upload', formData)
      .toPromise()
      .then((res: any) => {
        this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
        return res;
      })
      .catch((res: any) => {
        this.snackBar.open(res.error.message, 'Dismiss', { duration: 3000 });
        return res.error;
      });
  }

  sort(sort: Sort, callback) {
    this.queryModel.sort = sort.active;
    this.queryModel.sortDirection = sort.direction.toUpperCase();

    callback();
  }
}
