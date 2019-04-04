import { AuthService } from './../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuth = this.authService.getIsAuth();

    if (!isAuth) {
      this.toastr.error('Access Denied!');
      this.router.navigate(['/auth/login']);
    }

    return isAuth;
  }
}
