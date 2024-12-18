import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userFirstName: string = '';
  userLastName: string = '';
  userPicture: string = '';
  isModalOpen: boolean = false;
  private token:any=localStorage.getItem('accessToken');


  constructor(private userService: UserService, private router: Router,private doctorService:DoctorService) {}

  ngOnInit(): void {
    if(this.token){
      const role_id = parseInt(this.getUserRole_idFromToken(this.token)!, 10);
      if(role_id===1||role_id===3){
        this.userService.currentUserData.subscribe((userData) => {
          if (userData) {
            this.isLoggedIn = true;
            this.userFirstName = userData.firstName;
            this.userLastName = userData.lastName;
            this.userPicture = userData.picture;
          } else {
            this.isLoggedIn = false;
            this.userFirstName = '';
            this.userLastName = '';
          }
        });
        this.userService.loadUserInfo();
      } else if(role_id===2){
        this.doctorService.currentdoctorData.subscribe((doctorData)=>{
          if (doctorData) {
            this.isLoggedIn = true;
            this.userFirstName = doctorData.firstName;
            this.userLastName = doctorData.lastName;
            this.userPicture = doctorData.picture;
          } else {
            this.isLoggedIn = false;
            this.userFirstName = '';
            this.userLastName = '';
          }
        });
        this.doctorService.loadUserInfo();
      }else{
        console.error("invalid user_id")
      }
    }
    
  }
  getImageSource(): string {
    return this.userPicture
      ? `data:image/png;base64,${this.userPicture}`
      : 'img/pngegg.png';
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.userService.clearUserData(); // Clear the user data
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  openLoginModal(): void {
    this.isModalOpen = true;
  }

  closeLoginModal(): void {
    this.isModalOpen = false;
  }

  open_profile(): void {
    const token: string | null = localStorage.getItem('accessToken');
    if (token) {
      const role_id = parseInt(this.getUserRole_idFromToken(token)!, 10);
      if (role_id === 3) {
        this.router.navigate(['/admin-page']);
      } else if (role_id === 1) {
        this.router.navigate(['/user-profile']);
      }else if(role_id===2){
        this.router.navigate(['/doctor-page']);
      }
    } else {
      console.error('Token is not available.');
    }
  }

  getUserRole_idFromToken(token: string): string | null {
    try {
      // Decode the token to extract the user ID
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roleID || null; // Replace "roleID" with the actual field in your token
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }
}
