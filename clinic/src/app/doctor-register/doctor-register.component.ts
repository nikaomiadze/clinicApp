import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { doctor } from '../models/doctor';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { delay, Observable, of } from 'rxjs';
import { AdminService } from '../admin.service';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrl: './doctor-register.component.css'
})
export class DoctorRegisterComponent {
  registerForm!: FormGroup;
  selectedPicture: File | null = null;
  selectedCv: File | null = null;

 
  onPictureSelected(event: any) {
    this.selectedPicture = event.target.files[0];
  }

  onCvSelected(event: any) {
    this.selectedCv = event.target.files[0];
  }

  constructor(private adminservice: AdminService, private formbuilder: FormBuilder,private router:Router,public categories:CategoriesService) {}
  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      firstname: ['', Validators.required],
      lastname:['',Validators.required],
      email:['',Validators.required],
      person_id: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(11),Validators.minLength(11)],
        [this.personIdAsyncValidator]  
      ],
      password:['',Validators.required],
      category_id: [0],
    });
  }
  personIdAsyncValidator(control: any): Observable<any> {
    return of(control.value === '12345678901' ? { invalidPersonId: true } : null).pipe(delay(1000)); 
  }

  Add_Doctor():void{
    const formData: FormData = new FormData();

    formData.append('firstname', this.registerForm.get('firstname')?.value);
    formData.append('lastname', this.registerForm.get('lastname')?.value);
    formData.append('person_id', this.registerForm.get('person_id')?.value);
    formData.append('Email', this.registerForm.get('email')?.value);
    formData.append('Password', this.registerForm.get('password')?.value);


    formData.append('category_id', this.registerForm.get('category_id')?.value.toString());

    if (this.selectedPicture) {
      formData.append('profile_img', this.selectedPicture, this.selectedPicture.name);
    }
    if (this.selectedCv) {
      formData.append('cv', this.selectedCv, this.selectedCv.name);
    }
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    if (this.registerForm.valid) { 
    this.adminservice.Add_doctor(formData).subscribe({
      next: res => {
        alert(res);
        this.router.navigate(['admin-page']);
  },
 error: err => {
      console.error('Error during registration:', err);
      alert(err.error);
    },
    complete: () => {
      console.log("User registration process completed");
    }});
  } else {
    alert("Please fill out the form correctly");
  }
  }
  requestCategories(){
    this.categories.get_category().subscribe(res=>{
      this.categories.catlist=res;
    })
  }
}
