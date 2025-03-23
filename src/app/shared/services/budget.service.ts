import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Budget } from '../model/Budgets';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient) { }
    addBudget(formData: any) {
      return this.http.post(environment.apiBaseUrl + '/api/Budgets', formData)
    }
    getBudgetsList() {
      return this.http.get<Budget[]>(`${environment.apiBaseUrl}/api/Budgets`);
    }
    getBudgetsOfUser(userId:any) {
      return this.http.get<Budget[]>(`${environment.apiBaseUrl}/api/Budgets/getUserBudgetsById/${userId}`);
    }
  
    updateBudget(id: number, formData: any) {
      return this.http.put(`${environment.apiBaseUrl}/api/Budgets/${id}`, formData);
  }
  
  deleteBudget(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/api/Budgets/${id}`);
  }
}
