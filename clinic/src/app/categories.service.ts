import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { category } from './models/category';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
constructor(private http:HttpClient){}
private cat: category[]=[];
  get_category():Observable<category[]>{
    return this.http.get<category[]>('https://localhost:7082/get_category').pipe( catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) { console.error('An error occurred:', error); return throwError('Something went wrong; please try again later.'); }
  get catlist():category[]{
   return this.cat;
  }
  set catlist(list:category[]){
    this.cat=list;

  }
}
