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
    const message = `Do you want to lock '${user.username}'`;
    const url = this.apiUrl + '/lock';
    this.dialogHandler(user, message, url);
  }

  unlock(user): void {
    const message = `Do you want to unlock '${user.username}'`;
    const url = this.apiUrl + '/unlock';
    this.dialogHandler(user, message, url);
  }

  resetPassword(user): void {
    const message = `Do you want to reset password for account '${user.username}'`;
    const url = this.apiUrl + '/forgotPassword';
    this.dialogHandler(user, message, url);
  }

  changePassword(model) {
    return this.http.post(this.apiUrl + '/changePassword', model).subscribe((res: any) => {
      this.toastr.success(res.message);
      this.router.navigate(['/']);
    }, (res: any) => {
      this.toastr.error(res.error.message);
    });
  }

  fetchProfile() {
    return this.http.get(this.apiUrl + '/fetchProfile');
  }

  updateProfile(model) {
    this.http.put(this.apiUrl + '/updateProfile', model).subscribe((res: any) => {
      this.toastr.success(res.message);
      this.router.navigate(['/']);
    });
  }

  private nextCallback(res: any) {
    this.toastr.success(res.message);
    this.setRefreshListerner();
  }

  private httpRequestHandler (req) {
    if (!req) {
      console.error('Request not found');
      this.toastr.error('Request not found');
      return;
    }

    req.subscribe(
      (res: any) => this.nextCallback(res),
      (res: any) => this.toastr.error(res.error.message)
    );
  }

  private dialogHandler (item, message, url) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { item, message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const req = this.http.post(url, result);
        this.httpRequestHandler(req);
      }
    });
  }
}
