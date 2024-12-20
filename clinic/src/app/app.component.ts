import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TokenService } from './token.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'clinic';
  isLoginRoute = false;
  private token:any=localStorage.getItem('accessToken');

  constructor(private router: Router,private tokenService:TokenService) {}
  ngOnInit(): void {
    // Simulate getting the role_id from a login or token storage
    const roleId = this.getUserRole_idFromToken(this.token);

    // Store the role_id in the TokenService
    this.tokenService.setRoleId(roleId);
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
