import { ToastrService } from 'ngx-toastr';
import { StandardService } from 'src/app/services/standard.service';
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
  imagePreview: string;
  pickedImage: any = null;

  constructor(
    private route: ActivatedRoute,
    private service: StandardService,
    private toastr: ToastrService
  ) {
    this.service.init('product');
  }

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

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file.type.indexOf('image/') > -1) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result.toString();
      };
      reader.readAsDataURL(file);
      this.pickedImage = file;
    } else {
      this.toastr.error('Invalid MIME type, please select JPEG or PNG type image.');
    }
  }

  onUploadFile() {
    this.service.uploadImage(this.pickedImage).then((res: any) => {
      this.formData.photoUrl = res.url;
      this.pickedImage = null;
      this.onSubmit();
    });
  }

  onSubmit() {
    if (this.pickedImage !== null) {
      this.onUploadFile();
    } else {
      if (this.mode === 'update') {
        this.service.update(this.formData);
      } else if (this.mode === 'create') {
        this.service.create(this.formData);
      }
    }
  }
}
