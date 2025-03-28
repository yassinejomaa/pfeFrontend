import { Component, OnInit, ViewChild } from '@angular/core';
import { AddExpensesManuallyComponent } from '../add-expenses-manually/add-expenses-manually.component';
import { SideNavbarComponent } from '../../side-navbar/side-navbar.component';
import { TopNavBarComponent } from '../../top-nav-bar/top-nav-bar.component';
import { FooterComponent } from '../../footer/footer.component';

import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { Expense } from '../../../shared/model/Expenses';
import { ExpenseService } from '../../../shared/services/expense.service';
import { categoryMap} from '../../../shared/model/CategoryType';
import { UpdateExpenseComponent } from '../update-expense/update-expense.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ImportCsvComponent } from '../import-csv/import-csv.component';
import { AuthService } from '../../../shared/services/auth.service';

import { FormsModule } from '@angular/forms'; // Importation de FormsModule




@Component({
  selector: 'app-list-of-expenses',
  standalone: true,
  imports: [SideNavbarComponent, TopNavBarComponent,
    FooterComponent, CommonModule, ButtonModule, TableModule, TagModule, IconFieldModule,
    InputTextModule, InputIconModule, MultiSelectModule, UpdateExpenseComponent,
    ToastModule, ButtonModule, ConfirmPopupModule, ImportCsvComponent, FormsModule, DropdownModule, AddExpensesManuallyComponent],
  templateUrl: './list-of-expenses.component.html',
  styleUrls: ['./list-of-expenses.component.css',
    '../../../../../public/css/teamplate/style.css',
    '../../../../../public/css/teamplate/typography.css',
    '../../../../../public/css/teamplate/responsive.css'
],
providers: [ConfirmationService, MessageService]
})
export class ListOfExpensesComponent implements OnInit {
  changeMenu: boolean = false;
  @ViewChild('dt1') dt1!: Table;

  filterTable(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.dt1.filterGlobal(inputElement.value, 'contains');
  }
  recevoirMessage(message: boolean) {
    this.changeMenu = message; // Stocke la valeur reçue
  }




  expenses!: Expense[];
  userid:any; 


  loading: boolean = true;

  activityValues: number[] = [0, 100];

  constructor(private expenseService: ExpenseService,private confirmationService: ConfirmationService,
     private messageService: MessageService,private toastr: ToastrService,private authService:AuthService) {}


  statuses!: any[];



  searchValue: string | undefined;


 
      ngOnInit() {
        this.userid =this.authService.getUserId();
        this.expenseService.getExpensesOfUser(this.userid).subscribe(expenses => {
          this.expenses = expenses.map(expense => ({
            ...expense,
            categoryName: this.getCategoryName(expense.category),
           
          }));
          this.expenses.forEach((expense) => (expense.date = new Date(<Date>expense.date)));

          console.log(this.expenses); 
          this.loading = false;
        });
        

        
      }
      

      
  
      getCategoryName(category: number | string): string {
      
        if (typeof category === "number" && categoryMap.hasOwnProperty(category)) {
          return categoryMap[category];
        }
      
        console.warn("Category introuvable:", category); // Alerte si la valeur n'existe pas
        return "Unknown"; 

      }
      
      
      
  
  
  
  
  

      clear(table: Table) {
        table.clear();  // Cette ligne vide le tableau
        this.searchValue = '';  // Si tu veux réinitialiser la recherche
    }
    


     delete(event: Event, id: any) {
    console.log("hello");
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
        accept: () => {
            this.expenseService.deleteExpense(id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Expense deleted' });

                    // Mettre à jour la liste des dépenses au lieu de recharger la page
                    this.expenses = this.expenses.filter(expense => expense.id !== id);
                },
                error: (err) => {
                    if (err.status === 400) {
                        this.toastr.error('Cannot delete', 'Delete failed');
                    } else if (err.status === 404) {
                        this.toastr.error('Expense not found', 'Delete failed');
                    } else {
                        console.error('Error during deletion:', err);
                        this.toastr.error('An unexpected error occurred', 'Delete failed');
                    }
                }
            });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        },
    });
}
}




  
  











