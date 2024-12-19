import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { doctor } from './models/doctor';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }
  Add_doctor(Doctor:FormData):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({ 'enctype': 'multipart/form-data' }),
       responseType: 'text' as 'json'
    };
   
    return this.http.post<any>("https://localhost:7082/add_doctor" ,Doctor,httpOptions)
    .pipe(
      catchError((error) => {
          console.error('Error occurred while saving the employee:', error);
          return throwError(() => new Error('Failed to save employee. Please try again later.'));
      })
  );
  }
  Update_doctor(doctor_id:string,newData:FormData):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({ 'enctype': 'multipart/form-data' }),
       responseType: 'text' as 'json'
    };
    return this.http.post<any>(`https://localhost:7082/update_doctor/${doctor_id}`,newData,httpOptions)
    .pipe(
      catchError((error) => {
          console.error('Error occurred while updating the employee:', error);
          return throwError(() => new Error('Failed to update employee. Please try again later.'));
      })
  );
  }
}
