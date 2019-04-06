import { UserService } from './../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  formData = this.formBuilder.group({
    _id: [null, Validators.required],
    username: [null, Validators.required],
    displayName: ['', Validators.required],
    email: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    avatarImageUrl: [''],
    signatureImageUrl: [''],
  });
  imagesPreview: any = {};

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private userService: UserService) { }

  ngOnInit() {
    this.userService.fetchProfile().subscribe((res: any) => {
      this.formData.patchValue(res.data);
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

  onSubmit(formData) {
    this.userService.updateProfile(formData);
  }

}
