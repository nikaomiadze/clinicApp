import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { doctor } from './models/doctor';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http:HttpClient) { }
  private doctors:doctor[]=[];
  get_doctor():Observable<doctor[]>{
    return this.http.get<doctor[]>('https://localhost:7082/get_doctor').pipe( catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) { console.error('An error occurred:', error); return throwError('Something went wrong; please try again later.'); }
  get doctorlist():doctor[]{
   return this.doctors;
  }
  set doctorlist(list:doctor[]){
    this.doctors=list;
  }
  getDoctor_by_cat_id(id: number):Observable<doctor[]> {
    return this.http.get<doctor[]>(`https://localhost:7082/doctor_filter_by_category/${id}`);
  }
  getDoctor_by_username(username:string):Observable<doctor[]>{
    return this.http.get<doctor[]>(`https://localhost:7082/doctor_filter_by_username/${username}`);
  }
  getDoctor_by_category_name(category_name:string):Observable<doctor[]>{
    return this.http.get<doctor[]>(`https://localhost:7082/doctor_filter_by_category_name/${category_name}`);
  }
  getDoctorById(userId: string):Observable<any> {
    return this.http.get<any>(`https://localhost:7082/doctor/by_id/${userId}`);
  }
  deleteDoctor_by_id(doctorId: any): Observable<any> {
    return this.http.delete<any>(`https://localhost:7082/doctor/delete/by_id/${doctorId}`,{ responseType: 'text' as 'json'});
  }
}
