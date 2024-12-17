import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    const token = localStorage.getItem('accessToken'); // Assuming token is stored in localStorage

    if (token) {
        const role_id = parseInt(this.getUserRole_idFromToken(token)!, 10);

      if (role_id === 3) {
        return true; // Allow access if `role_id` is 3 (admin)
      }
    }

    // Redirect to a 'not authorized' or login page
    this.router.navigate(['/']);
    return false;
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
