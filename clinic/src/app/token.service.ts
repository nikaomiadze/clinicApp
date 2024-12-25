import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey: string | null = localStorage.getItem('accessToken');
  private roleIdSubject = new BehaviorSubject<string | null>(null);
  roleId$ = this.roleIdSubject.asObservable(); // Observable to subscribe to roleId changes

  constructor() {
    this.decodeAndSetRole();
  }

  private decodeAndSetRole(): void {
    if (this.tokenKey) {
      try {
        const decodedToken: any = jwtDecode(this.tokenKey);
        const roleId = decodedToken?.roleID || null;
        this.roleIdSubject.next(roleId); // Update the BehaviorSubject
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No access token found in localStorage.');
    }
  }

  setToken(token: string): void {
    this.tokenKey = token;
    localStorage.setItem('accessToken', token);
    this.decodeAndSetRole();
  }

  clearToken(): void {
    this.tokenKey = null;
    localStorage.removeItem('accessToken');
    this.roleIdSubject.next(null);
  }
}
