import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Category } from '../model/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
      
      getCategoriesList() {
        return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/Categories`);
      }
      
}
