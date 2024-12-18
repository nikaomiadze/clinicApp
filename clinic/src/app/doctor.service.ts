import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { doctor } from './models/doctor';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http:HttpClient) { }
  private doctors:doctor[]=[];
  private doctorData = new BehaviorSubject<{ firstName: string; lastName: string; picture: string } | null>(null);
  currentdoctorData = this.doctorData.asObservable();
  private tokenkey:any=localStorage.getItem('accessToken');

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
  loadUserInfo(): void {
  
      if (this.tokenkey) {
        // Validate token format: Should have 3 parts separated by '.'
        const tokenParts = this.tokenkey.split('.');
        if (tokenParts.length === 3) {
          try {
            const decodedToken: any = jwtDecode(this.tokenkey); // Decode token
            const userId = decodedToken.UserID; // Extract user ID
  
            // Fetch user details from backend
            this.getDoctorById(userId).subscribe({
              next: (userDetails) => {
                const userInfo = {
                  firstName: userDetails.firstName,
                  lastName: userDetails.lastName,
                  picture: userDetails.picture,
                };
  
                this.doctorData.next(userInfo); // Emit new user data
              },
              error: (err) => console.error('Failed to fetch user details:', err),
            });
          } catch (err) {
            console.error('Error decoding token:', err);
          }
        } else {
          console.error('Invalid token format');
          this.doctorData.next(null); // Token is invalid, clear user data
        }
      } else {
        console.warn('No token found. User is not logged in.');
        this.doctorData.next(null); // No token, clear user data
      }
    }
    
  setUserData(data: { firstName: string; lastName: string;  picture: string;}): void {
    this.doctorData.next(data);
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
