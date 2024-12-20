import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { user } from './models/user';
import { BehaviorSubject, catchError, Observable,throwError } from 'rxjs';
import { login } from './models/login';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService{
  private userData = new BehaviorSubject<{id: number; firstName: string; lastName: string; picture: string } | null>(null);
  currentUserData = this.userData.asObservable(); // Observable for other components
  private tokenkey:any=localStorage.getItem('accessToken');
  
  constructor(private http:HttpClient) { 
    this.loadUserInfo(); // Fetch user data on service initialization

  }
  
  SendCode(User:user):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json' 
    };
    return this.http.post<any>("https://localhost:7082/send_verification_code" ,{ email: User.email },httpOptions)
    .pipe(
      catchError(this.handleError) // Handle errors here
    );
  }
  private handleError(error: HttpErrorResponse) {
    // In case of server error
    if (error.status === 400) {
      alert('There was an error with the request.');
    } else {
      alert(`Error: ${error.message}`);
    }
    return throwError(error);  
  }
  Add_user(User:user):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
       responseType: 'text' as 'json'
    };
   
    return this.http.post<any>("https://localhost:7082/add_user" ,User,httpOptions);
  }
  Login_user(Login:login):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders()
  };
    return this.http.post<any>("https://localhost:7082/login_user", Login,httpOptions);
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
          this.getUserById(userId).subscribe({
            next: (userDetails) => {
              const userInfo = {
                id: userDetails.id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                picture: userDetails.picture,
              };

              this.userData.next(userInfo); // Emit new user data
            },
            error: (err) => console.error('Failed to fetch user details:', err),
          });
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      } else {
        console.error('Invalid token format');
        this.userData.next(null); // Token is invalid, clear user data
      }
    } else {
      console.warn('No token found. User is not logged in.');
      this.userData.next(null); // No token, clear user data
    }
  }

  getUserById(userId: string):Observable<any> {
    return this.http.get<any>(`https://localhost:7082/user/${userId}`);
  }

  setUserData(data: {id:number; firstName: string; lastName: string;  picture: string;}): void {
    this.userData.next(data);
  }
  // Clear user data on logout
  clearUserData(): void {
    this.userData.next(null);
  }
}
