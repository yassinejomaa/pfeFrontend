import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../constants';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  createUser(formData: any) {
    return this.http.post(environment.apiBaseUrl +'/IdentityUser/signup', formData)
  }
  signin(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/IdentityUser/signin', formData)
  }
  

  isLoggedIn() {
    return this.getToken() != null ? true : false;
  }
  deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  getToken(){
    return localStorage.getItem(TOKEN_KEY) ;
  }

}
