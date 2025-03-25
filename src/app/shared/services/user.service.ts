import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  resetPassword(formData: any) {
      return this.http.post(environment.apiBaseUrl + '/api/IdentityUser/resetpassword', formData)
    }
    forgotPassword(formData: any) {
      return this.http.post(environment.apiBaseUrl + '/api/IdentityUser/forgotpassword', formData)
    }
    update(formData: any) {
      return this.http.put(environment.apiBaseUrl + '/api/IdentityUser/update', formData, {
        headers: { 'Content-Type': 'application/json' },
  
      });
    }
    
}
