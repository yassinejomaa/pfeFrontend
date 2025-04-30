import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


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
    uploadFile(data: FormData): Observable<any> {
      return this.http.post<any>('https://api.cloudinary.com/v1_1/dimj6qkuf/image/upload', data);
    }
    uploadImage(vals: any): Observable<any> {
      let data = vals;
      return this.http.post("https://api.cloudinary.com/v1_1/dimj6qkuf/image/upload", data)
    }
    
    
}
