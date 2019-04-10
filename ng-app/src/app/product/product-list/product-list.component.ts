import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatTableDataSource, MatSort, MatPaginator, Sort } from '@angular/material';
import { merge, Subject } from 'rxjs';
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
  selectedFilter: any;
  selectedFilterListerner = new Subject<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: StandardService, private authService: AuthService) {
    this.service.init('product', this.queryModel);
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuth => this.isAuth = isAuth);
    this.selectedFilterListerner.asObservable().subscribe(filter => {
      this.queryModel.type = filter.type;
      this.queryModel.queryType = filter.queryType;
    });
    this.selectedFilter = this.filterList[0];
    this.selectedFilterListerner.next(this.selectedFilter);
  }

  ngOnInit() {
    this.fetchAll();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.queryModel.currentPage = this.paginator.pageIndex;
      this.fetchAll();
    });
  }

  fetchAll() {
    return this.service.fetchAll(this.queryModel).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<Product>(res.data);
      this.totalItems = res.totalItems;
    });
  }

  onChangeFilter(filter) {
    this.selectedFilterListerner.next(filter);
  }

  delete(item) {
    this.service.delete(item);
  }

  sortData(sort: Sort) {
    this.service.sort(sort);
  }

  applyFilter(queryModel: IQueryModel) {
    this.fetchAll().add(() => this.paginator.firstPage());
  }
}
