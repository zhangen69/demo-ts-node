import { ConfirmationDialogComponent } from './../templates/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';
import { StandardService } from './standard.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService extends StandardService {

  constructor(public http: HttpClient, public dialog: MatDialog, public router: Router, public toastr: ToastrService) {
    super(http, dialog, router, toastr);
  }

  lock(user): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { item: user, message: `Do you want to lock '${user.username}'` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post(this.apiUrl + '/lock', result).subscribe(
          (res: any) => {
            this.toastr.success(res.message);
            this.setRefreshListerner();
          },
          (res: any) => this.toastr.error(res.error.message)
        );
      }
    });
  }

  unlock(user): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { item: user, message: `Do you want to unlock '${user.username}'` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post(this.apiUrl + '/unlock', result).subscribe(
          (res: any) => {
            this.toastr.success(res.message);
            this.setRefreshListerner();
          },
          (res: any) => this.toastr.error(res.error.message)
        );
      }
    });
  }
}
