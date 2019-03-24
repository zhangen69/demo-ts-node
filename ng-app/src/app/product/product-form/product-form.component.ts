import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  mode = 'create';
  formData: any = { name: null, price: null };

  constructor(private route: ActivatedRoute, private service: ProductService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.mode = 'update';
        this.service.fetch(params['id']).subscribe((res: any) => {
          this.formData = res.data;
        });
      }
    });
  }

  onSubmit() {
    if (this.mode === 'update') {
      this.service.update(this.formData);
    } else if (this.mode === 'create') {
      this.service.create(this.formData);
    }
  }
}
