import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatTableDataSource, MatSort, MatPaginator, Sort } from '@angular/material';
import { merge, Subscription } from 'rxjs';
import { StandardService } from 'src/app/services/standard.service';
import { IQueryModel } from 'src/app/interfaces/query-model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  isAuth = false;
  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['name', 'price', 'audit.updatedDate', 'action'];
  totalItems = 0;
  queryModel: IQueryModel = {
    pageSize: 5,
    currentPage: 0,
  };
  private authListenerSubs: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: StandardService, private authService: AuthService) {
    this.service.init('product', this.queryModel);
    this.isAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
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
      this.dataSource = new MatTableDataSource<Product>(res.data);
      this.dataSource.sort = this.sort;
      this.totalItems = res.totalItems;
      this.paginator.firstPage();
    });
  }

  delete(item) {
    this.service.delete(item);
  }

  sortData(sort: Sort) {
    this.service.sort(sort, this.fetchAll);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.queryModel.searchText = filterValue.trim().toLowerCase();
    this.queryModel.type = 'name';

    this.fetchAll();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
}
