import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Budget } from '../model/Budgets';
import { BudgetPeriods } from '../model/BudgetPeriods';

@Injectable({
  providedIn: 'root'
})
export class BudgetPeriodService {


  constructor(private http: HttpClient) { }
    addBudgetPeriod(formData: any) {
      return this.http.post(environment.apiBaseUrl + '/api/BudgetPeriods', formData)
    }
    getBudgetPeriodsList() {
      return this.http.get<BudgetPeriods[]>(`${environment.apiBaseUrl}/api/BudgetPeriods`);
    }
    getBudgetPeriodsOfUser(userId:any) {
      return this.http.get<BudgetPeriods[]>(`${environment.apiBaseUrl}/api/BudgetPeriods/getUserBudgetPeriodsById/${userId}`);
    }
  
    updateBudgetPeriod(id: number, formData: any) {
      return this.http.put(`${environment.apiBaseUrl}/api/BudgetPeriods/${id}`, formData);
  }
  
    deleteBudgetPeriod(id: number) {
      return this.http.delete(`${environment.apiBaseUrl}/api/BudgetPeriods/${id}`);
    }
}
