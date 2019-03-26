import { AuthService } from './../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuth = this.authService.getIsAuth();

    if (!isAuth) {
      this.snackBar.open('Access Denied!', 'Dismiss', { duration: 3000 });
      this.router.navigate(['/auth/login']);
    }

    return isAuth;
  }
}
