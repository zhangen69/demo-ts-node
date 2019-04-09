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
    pageSize: 10,
    currentPage: 0,
  };
  filterList = [
    { type: 'name', display: 'Name', queryType: 'string' },
    { type: 'price', display: 'Price', queryType: 'number' },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: StandardService, private authService: AuthService) {
    this.service.init('product', this.queryModel);
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuth = isAuth;
    });
    this.queryModel.selectedFilter = this.filterList[0];
  }

  ngOnInit() {
    this.fetchAll();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => this.fetchAll());
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
    this.service.sort(sort);
  }

  applyFilter(queryModel: IQueryModel) {
    console.log(queryModel);

    queryModel.type = queryModel.selectedFilter.type;
    queryModel.queryType = queryModel.selectedFilter.queryType;

    this.fetchAll();
  }
}
