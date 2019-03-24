import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatTableDataSource, MatSort, MatPaginator, Sort } from '@angular/material';
import { merge } from 'rxjs';
import { StandardService } from 'src/app/services/standard.service';
import { IQueryModel } from 'src/app/interfaces/query-model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: MatTableDataSource<Product>;
  displayedColumns: string[] = ['name', 'price', 'audit.updatedDate', 'action'];
  totalItems = 0;
  queryModel: IQueryModel = {
    pageSize: 5,
    currentPage: 0,
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: StandardService) {
    this.service.init('product', this.queryModel);
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
      this.products = new MatTableDataSource<Product>(res.data);
      this.products.sort = this.sort;
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
