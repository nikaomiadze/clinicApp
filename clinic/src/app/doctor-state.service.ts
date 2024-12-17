import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorStateService {
  // Create a BehaviorSubject to manage the doctor_not_found state
  private doctorNotFoundSource = new BehaviorSubject<boolean>(false);

  // Observable for the doctor_not_found state
  doctorNotFound$ = this.doctorNotFoundSource.asObservable();

  // Method to update the state
  setDoctorNotFound(status: boolean): void {
    this.doctorNotFoundSource.next(status);
  }
}
