import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { login } from '../models/login';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { DoctorService } from '../doctor.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  user_logined=false;
  login = new login();
  loginForm!:FormGroup;
  incorectdata: boolean = false;

  constructor(private userservice: UserService, private formbuilder: FormBuilder,private router:Router,private doctorservice:DoctorService) {}
//login window
  @Output() close = new EventEmitter<void>();
  closeModal() {
    this.close.emit();
  }
  
//login function
 ngOnInit(): void {
    this.loginForm=this.formbuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    }) 
   }
   Login_user(): void {
    // Assign form values to the login object
    Object.assign(this.login, this.loginForm.value);
  
    // Call the login service
    this.userservice.Login_user(this.login).subscribe({
      next: (res) => {
        // Save the access token in local storage
        console.log(res.accessToken);
        localStorage.setItem("accessToken", res.accessToken);
    
        // Extract user ID and role ID from token
        const user_id = this.getUserIdFromToken(res.accessToken);
        const role_id = parseInt(this.getUserRole_idFromToken(res.accessToken)!, 10);

        if (user_id && role_id) {
          if (role_id === 1) {
            // Call getUserById for role_id 1 (users)
            this.userservice.getUserById(user_id).subscribe({
              next: (userDetails) => {
                console.log("User Details:", userDetails);
                this.userservice.setUserData({
                  id:userDetails.id,
                  firstName: userDetails.firstName,
                  lastName: userDetails.lastName,
                  picture: userDetails.picture,
                });
                this.close.emit();
                this.router.navigate(['/']);
              },
              error: (err) => console.error("Error fetching user details:", err),
            });
          } else if (role_id === 2) {
            // Call getDoctorById for role_id 2 (doctors)
            this.doctorservice.getDoctorById(user_id).subscribe({
              next: (doctorDetails) => {
                console.log("Doctor Details:", doctorDetails);
                this.userservice.setUserData({
                  id:doctorDetails.id,
                  firstName: doctorDetails.firstName,
                  lastName: doctorDetails.lastName,
                  picture: doctorDetails.picture,
                });
                this.close.emit();
                this.router.navigate(['/']);
              },
              error: (err: any) => console.error("Error fetching doctor details:", err),
            });
          }else if(role_id===3){
            this.userservice.getUserById(user_id).subscribe({
              next: (userDetails) => {
                console.log("User Details:", userDetails);
                this.userservice.setUserData({
                  id:userDetails.id,
                  firstName: userDetails.firstName,
                  lastName: userDetails.lastName,
                  picture: userDetails.picture,
                });
                this.close.emit();
                this.router.navigate(['/admin-page']);
              },
              error: (err) => console.error("Error fetching user details:", err),
            });
          } else {
            console.error("Invalid role ID:", role_id);
          }
        }
      },
      error: (err) => (this.incorectdata = true),
    });
    
  }
  
  getUserIdFromToken(token: string): string | null {
    try {
      // Decode the token to extract the user ID
      const decodedToken: any = jwtDecode(token);
      return decodedToken.UserID || null; // Replace "UserID" with the actual field in your token
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  }
  getUserRole_idFromToken(token: string): string | null{
    try {
      // Decode the token to extract the user ID
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roleID || null; // Replace "UserID" with the actual field in your token
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  }
}
