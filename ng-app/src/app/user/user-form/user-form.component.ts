import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StandardService } from 'src/app/services/standard.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  mode = 'new';
  formData = this.formBuilder.group({
    _id: [null],
    username: ['', Validators.required],
    password: ['', Validators.required],
    displayName: ['', Validators.required],
    email: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    avatarImageUrl: [''],
    signatureImageUrl: [''],
  });
  imagesPreview: any = {};

  constructor(
    private route: ActivatedRoute,
    private service: StandardService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.service.init('user');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.mode = 'edit';
        this.service.fetch(params['id']).subscribe((res: any) => {
          this.formData.patchValue(res.data);
          this.formData.setControl('password', null);
        });
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file.type.indexOf('image/') > -1) {

      this.formData.patchValue({ avatarImage: file });
      this.formData.get('avatarImage').updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagesPreview.avatarImage = reader.result.toString();
      };
      reader.readAsDataURL(file);
    } else {
      this.toastr.error('Invalid MIME type, please select JPEG or PNG type image.');
    }
  }

  onUploadFile() {
    this.service.uploadImage(this.formData.get('avatarImage').value).then((res: any) => {
      this.formData.patchValue({ avatarImageUrl: res.url });
      this.formData.get('avatarImageUrl').updateValueAndValidity();
      this.imagesPreview.avatarImage = null;
      this.onSubmit(this.formData.value);
    });
  }

  onSubmit(formData) {
    if (this.imagesPreview.avatarImage) {
      this.onUploadFile();
    } else {
      if (this.mode === 'edit') {
        this.service.update(formData);
      } else if (this.mode === 'new') {
        this.service.create(formData);
      }
    }
  }
}
