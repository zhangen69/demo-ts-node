import { UserService } from './../../services/user.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { User } from 'src/app/models/user.model';
import { IQueryModel } from 'src/app/interfaces/query-model';
import { merge } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
  isAuth = false;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['username', 'displayName', 'email', 'phoneNumber', 'audit.updatedDate', 'action'];
  totalItems = 0;
  queryModel: IQueryModel = {
    pageSize: 5,
    currentPage: 0,
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService, private authService: AuthService) {
    this.userService.init('user', this.queryModel, this.paginator);
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuth => this.isAuth = isAuth);
    this.userService.getRefreshListerner().subscribe(() => this.fetchAll());
  }

  ngOnInit() {
    this.fetchAll();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.queryModel.currentPage = this.paginator.pageIndex;
      this.fetchAll();
    });
  }

  fetchAll() {
    return this.userService.fetchAll(this.queryModel).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<User>(res.data);
      this.totalItems = res.totalItems;
    });
  }

  onLockOrUnlockUser(item) {
    if (item.isLocked || item.isAccessFailedLocked) {
      this.userService.unlock(item);
    } else {
      this.userService.lock(item);
    }
  }

  onResetPassword(item) {
    this.userService.resetPassword(item);
  }

  sortData(sort: Sort) {
    this.userService.sort(sort);
  }
}
