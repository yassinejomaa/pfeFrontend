import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {





    constructor(private http: HttpClient) { }
      
    getData(userId:any) {
      return this.http.get<any>(`${environment.apiBaseUrl}/api/Dashboard/${userId}`);
    }

  
}
