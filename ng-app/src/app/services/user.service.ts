import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/service/user';

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) { }

  register(formData) {
    this.http.post(this.apiUrl + '/register', formData).subscribe((res: any) => {
      this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
      this.router.navigate(['/auth/login']);
    }, (res: any) => {
      console.log(res);
      this.snackBar.open(res.error.message, 'Dismiss', { duration: 3000 });
    });
  }
}
