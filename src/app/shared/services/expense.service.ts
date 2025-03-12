import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Expense } from '../model/Expenses';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) { }
  addExpenseManually(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/api/Expenses', formData)
  }
  getExpensesList() {
    return this.http.get<Expense[]>(`${environment.apiBaseUrl}/api/Expenses`);
  }

  updateExpense(id: number, formData: any) {
    return this.http.put(`${environment.apiBaseUrl}/api/Expenses/${id}`, formData);
}

deleteExpense(id: number) {
  return this.http.delete(`${environment.apiBaseUrl}/api/Expenses/${id}`);
}


  
}
