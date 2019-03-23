import { ConfirmationDialogComponent } from './../../templates/confirmation-dialog/confirmation-dialog.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatSnackBar,
  MatDialog
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { merge } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' }
];

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: MatTableDataSource<Product>;
  displayedColumns: string[] = ['name', 'price', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchAll().subscribe((res: any) => {
      this.products = new MatTableDataSource<Product>(res.data);
      this.products.sort = this.sort;
      this.resultsLength = res.data.length;
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        switchMap(() => {
          return this.fetchAll();
        }),
        map((res: any) => {
          return res.data;
        })
      )
      .subscribe(
        (data: Product[]) =>
          (this.products = new MatTableDataSource<Product>(data))
      );
  }

  fetchAll() {
    const queryModel = {
      pageSize: 5,
      currentPage: 0
    };

    return this.http.get(
      environment.apiUrl +
        '/service/product?queryModel=' +
        JSON.stringify(queryModel)
    );
  }

  delete(item) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http
          .delete(environment.apiUrl + '/service/product/' + result._id)
          .subscribe((res: any) => {
            this.snackBar.open(res.message, 'Dismiss', {
              duration: 3000
            });
            window.location.reload();
          });
      }
    });
  }
}
