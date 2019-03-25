import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FileUploader, FileUploaderOptions, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  mode = 'create';
  formData: any = { name: null, price: null };
  imagePreview: string;
  pickedImage: any;

  public uploader: FileUploader;

  constructor(private route: ActivatedRoute, private service: ProductService, private snackBar: MatSnackBar, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.mode = 'update';
        this.service.fetch(params['id']).subscribe((res: any) => {
          this.formData = res.data;
        });
      }
    });
    const options: FileUploaderOptions = {
      url: `${environment.apiUrl}/upload`,
      // url: `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloud_name}/upload`,
      autoUpload: true,
      headers: [{ name: 'X-Requested-With', value: 'XMLHttpRequest' }, { name: 'Content-Type', value: 'application/json'}],
    };
    this.uploader = new FileUploader(options);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file.type.indexOf('image/') > -1) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result.toString();
      };
      reader.readAsDataURL(file);
    } else {
      this.snackBar.open('Invalid MIME type, please select JPEG or PNG type image.', 'Dismiss', { duration: 3000 });
    }
  }

  onSubmit() {
    // const url = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloud_name}/image/upload`;
    // const fd = new FormData();
    // fd.append('upload_preset', environment.cloudinary.upload_preset);
    // fd.append('file', this.pickedImage);
    // this.http.post(url, fd).subscribe((res: any) => {
    //   console.log(res);
    // });

    console.log(this.uploader);

    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('FileItem');
      console.log(item);
      console.log('Response');
      console.log(response);
      console.log('Status');
      console.log(status);
      console.log('Headers');
      console.log(headers);
    };


    this.uploader.uploadItem(this.uploader.queue[this.uploader.queue.length - 1]);
    // if (this.mode === 'update') {
    //   this.service.update(this.formData);
    // } else if (this.mode === 'create') {
    //   this.service.create(this.formData);
    // }
  }
}
