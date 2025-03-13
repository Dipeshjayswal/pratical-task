import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


export interface Request {
  path: string,
  data?: any,
  isAuth?: boolean;
 }

@Injectable({
  providedIn: 'root'
})


export class ApiService {

  private readonly apiUrl: string = 'https://dummyjson.com/';

  constructor(public http: HttpClient) { }

  isAuthenticated(): boolean {
    const userData = localStorage.getItem('userData');
    return !!userData;
  }

  post (request: any) {
    return this.http.post(this.apiUrl + request.path, request.data, {
      headers: this.getHeader()
    });
  }

  getHeader () {
    let header: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return header;
  }


}
