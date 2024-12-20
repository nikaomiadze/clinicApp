import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private roleIdSubject = new BehaviorSubject<string | null>(null); // Allow null
  roleId$ = this.roleIdSubject.asObservable();

  constructor() { }

  setRoleId(roleId: string | null): void {  // Accept string | null
    this.roleIdSubject.next(roleId);
  }

  getRoleId(): string | null {
    return this.roleIdSubject.getValue();
  }
}
