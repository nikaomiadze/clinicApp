import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { booking } from './models/booking';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http:HttpClient) { }
  Add_booking(Booking:booking):Observable<any>{
      let httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
         responseType: 'text' as 'json'
      };
     
      return this.http.post<any>("https://localhost:7082/add-booking",Booking,httpOptions);
    }
}
