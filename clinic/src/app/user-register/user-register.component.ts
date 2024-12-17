import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { user } from '../models/user';
import { delay, Observable, of } from 'rxjs';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent implements OnInit {
    user = new user(); 
    registerForm!: FormGroup;
    email_error: boolean = false;
    code_error: boolean = false;

  
    constructor(private userservice: UserService, private formbuilder: FormBuilder,private router:Router) {}
  
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
        verificationcode:['',Validators.required],
      });
      this.registerForm.get('email')?.valueChanges.subscribe(() => {
        // Reset the error flag when the user types in the email field
        this.email_error = false;
      });
    }
  
    personIdAsyncValidator(control: any): Observable<any> {
      return of(control.value === '12345678901' ? { invalidPersonId: true } : null).pipe(delay(1000)); 
    }
    sendcode():void{
      Object.assign(this.user, this.registerForm.value)
      
      this.userservice.SendCode(this.user).subscribe({
        next: (response) => {
          console.log('Response:', response);
          alert("Verification code sent successfully"); 
          this.code_error=false;
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to add user: ' + error.message);
        },
      });     
    }
    
    Add_User():void{
     
      if (this.registerForm.valid) { 
        Object.assign(this.user, this.registerForm.value)
      this.userservice.Add_user(this.user).subscribe({
        next: res => {
          alert(res);
          this.router.navigate(['/register']);
    },
   error: err => {
        console.error('Error during registration:', err);
        alert(err.error);
        if(err.error==="A user with this email is already registered."){
        this.email_error=true;
        this.code_error=false;
      }
        else if(err.error==="Invalid or expired verification code."){
          this.code_error=true;
          this.email_error=false;
        }
      },
      complete: () => {
        console.log("User registration process completed");
        this.registerForm.reset();
      }});
    } else {
      alert("Please fill out the form correctly");
    }
    }
  }


  

