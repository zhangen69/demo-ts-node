import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { User } from 'src/app/models/user.model';
import { IQueryModel } from 'src/app/interfaces/query-model';
import { merge } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { StandardService } from 'src/app/services/standard.service';

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

  constructor(private service: StandardService, private authService: AuthService) {
    this.service.init('user', this.queryModel);
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuth = isAuth;
    });
  }

  ngOnInit() {
    this.fetchAll();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.fetchAll();
    });
  }

  fetchAll() {
    this.service.fetchAll(this.queryModel, this.paginator.pageIndex).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<User>(res.data);
      this.dataSource.sort = this.sort;
      this.totalItems = res.totalItems;
    });
  }

  delete(item) {
    this.service.delete(item);
  }

  sortData(sort: Sort) {
    this.service.sort(sort, this.fetchAll);
  }
}
