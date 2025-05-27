import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Expense } from '../model/Expenses';
import { Observable, Observer } from 'rxjs';


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
  getExpensesOfUser(userId:any) {
    return this.http.get<Expense[]>(`${environment.apiBaseUrl}/api/Expenses/getUserExpensesById/${userId}`);
  }

  updateExpense(id: number, formData: any) {
    return this.http.put(`${environment.apiBaseUrl}/api/Expenses/${id}`, formData);
}

deleteExpense(id: number) {
  return this.http.delete(`${environment.apiBaseUrl}/api/Expenses/${id}`);
}
importCsv(formData :any){
  return this.http.post(environment.apiBaseUrl + '/api/Expenses/import-csv', formData)

}
predictCategoy(product :any){
  return this.http.post(environment.flaskApi + '/predict', product)

}

// recommendation(expenses: string[]): Observable<any> {
//   const payload = {
//     expenses: expenses
//   };

//   // Spécifier explicitement responseType: 'text'
//   return this.http.post(environment.flaskApi + '/generate_advice', payload, {
//     responseType: 'text'
//   });
// }
recommendation(expenses: string[], language: string = 'english', tone: string = 'formal'): Observable<string> {
    const payload = {
      expenses: expenses,
      language: language,
      tone: tone
    };

    // Return the observable with text response type
    return this.http.post(environment.flaskApi + '/generate_advice_stream_simple', payload, {
      responseType: 'text'
    });
  }
 








   

  // Nouvelle méthode pour streaming
  

  // Alternative avec fetch API pour plus de contrôle
  

 recommendationStreamFetch(expenses: string[], language: string = 'english', tone: string = 'formal'): Observable<string> {
  return new Observable<string>((observer: Observer<string>) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', environment.flaskApi + '/generate_advice_stream_simple');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'text';

    let accumulatedContent = '';

    xhr.onprogress = () => {
      const currentContent = xhr.responseText;
      
      if (currentContent && currentContent !== accumulatedContent) {
        // Nettoyer les balises inutiles
        const cleanedContent = currentContent.replace(/```html/g, '').replace(/```/g, '');
        
        // Mettre à jour le contenu accumulé
        accumulatedContent = cleanedContent;
        
        // Envoyer tout le contenu nettoyé
        observer.next(cleanedContent.trim());
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const finalContent = xhr.responseText.replace(/```html/g, '').replace(/```/g, '');
        observer.next(finalContent.trim());
        observer.complete();
      } else {
        observer.error(`HTTP Error: ${xhr.status}`);
      }
    };

    xhr.onerror = () => {
      observer.error('Network error occurred');
    };

    xhr.ontimeout = () => {
      observer.error('Request timeout');
    };

    // Envoyer la requête
    const requestBody = {
      expenses: expenses,
      language: language,
      tone: tone
    };

    xhr.send(JSON.stringify(requestBody));
  });
}


  transformExpenses(expenses: any[]): string[] {
    return expenses.map(expense => 
      `${expense.name}: ${expense.amount} TND (${expense.categoryName})`
    );
  }
  recommendationStream(expenses: string[], language: string = 'english', tone: string = 'formal'): Observable<string> {
  return new Observable<string>(observer => {
    const params = new URLSearchParams({
      expenses: JSON.stringify(expenses),
      language,
      tone
    });

    const eventSource = new EventSource(`${environment.flaskApi}/generate_advice_stream?${params}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.content) {
          observer.next(data.content);
        }
        if (data.done) {
          eventSource.close();
          observer.complete();
        }
      } catch {
        observer.next(event.data); // texte brut
      }
    };

    eventSource.onerror = (err) => {
      observer.error(err);
      eventSource.close();
    };

    return () => eventSource.close();
  });
}
  
}
