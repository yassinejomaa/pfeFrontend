import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../constants';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';


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
  getUserId(): number | null {
    const token = this.getToken()// Récupère le token du stockage local
    if (!token) return null; // Vérifie si le token existe
    
    try {
      const decodedToken: any = jwtDecode(token); // Décode le token
      return decodedToken.UserID; // Retourne l'userId du token
    } catch (error) {
      console.error("Erreur lors du décodage du token", error);
      return null;
    }
  }

}
