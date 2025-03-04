import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  baseUrl = 'https://localhost:7171/IdentityUser';
  createUser(formData:any){
    return this.http.post(this.baseUrl+'/signup',formData)
  }
  signin(formData:any){
    return this.http.post(this.baseUrl+'/signin',formData)
  }
  resetPassword(formData:any){
    return this.http.post(this.baseUrl+'/resetpassword',formData)
  }
  update(formData: any) {
    return this.http.put(this.baseUrl + '/update', formData, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text' 
    });
}

 
}
