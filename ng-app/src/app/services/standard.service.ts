import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog, Sort, MatPaginator } from '@angular/material';
import { ConfirmationDialogComponent } from '../templates/confirmation-dialog/confirmation-dialog.component';
import { IQueryModel } from '../interfaces/query-model';
import { UploadType } from '../enums/upload-type.enum';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StandardService {
  domain: string;
  apiUrl: string;
  queryModel: IQueryModel;
  paginator: MatPaginator;
  refreshListerner = new Subject();

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    public toastr: ToastrService
  ) {}

  init(domain, queryModel?, paginator?) {
    this.domain = domain;
    this.apiUrl = `${environment.apiUrl}/service/${this.domain}`;
    this.queryModel = queryModel;
    this.paginator = paginator;
  }

  getRefreshListerner() {
    return this.refreshListerner.asObservable();
  }

  setRefreshListerner() {
    this.refreshListerner.next();
  }

  create(formData) {
    this.http.post(this.apiUrl, formData).subscribe(
      (res: any) => {
        this.toastr.success(res.message);
        this.router.navigate([`/${this.domain}/list`]);
      },
      (res: any) => this.toastr.error(res.error.message)
    );
  }

  update(formData) {
    this.http.put(this.apiUrl, formData).subscribe(
      (res: any) => {
        this.toastr.success(res.message);
        this.router.navigate([`/${this.domain}/list`]);
      },
      (res: any) => this.toastr.error(res.error.message)
    );
  }

  fetch(id, formData = null) {
    const fetchData = this.http.get(this.apiUrl + '/' + id);

    if (formData !== null) {
      fetchData.subscribe(
        (res: any) => (formData = res.data),
        (res: any) => this.toastr.error(res.error.message)
      );
      return;
    }

    return fetchData;
  }

  fetchAll(queryModel: IQueryModel) {
    if (!queryModel) {
      queryModel = {
        pageSize: 10,
        currentPage: 0,
      };
    }

    return this.http.get(
      this.apiUrl + '?queryModel=' + JSON.stringify(queryModel)
    );
  }

  delete(item) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(this.apiUrl + '/' + result._id).subscribe(
          (res: any) => {
            this.toastr.success(res.message);
            window.location.reload();
          },
          (res: any) => this.toastr.error(res.error.message)
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
        this.toastr.success(res.message);
        return res;
      })
      .catch((res: any) => {
        this.toastr.success(res.error.message);
        return res.error;
      });
  }

  sort(sort: Sort) {
    this.queryModel.sort = sort.active;
    this.queryModel.sortDirection = sort.direction.toUpperCase();
  }
}
