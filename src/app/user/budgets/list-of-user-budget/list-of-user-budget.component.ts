import { Component, OnInit, ViewChild } from '@angular/core';







import { SideNavbarComponent } from '../../side-navbar/side-navbar.component';
import { TopNavBarComponent } from '../../top-nav-bar/top-nav-bar.component';
import { FooterComponent } from '../../footer/footer.component';

import { ToastModule } from 'primeng/toast';

import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { Table, TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';

import { categoryMap } from '../../../shared/model/CategoryType';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../../shared/services/auth.service';

import { FormsModule } from '@angular/forms';
import { Budget } from '../../../shared/model/Budgets';
import { BudgetService } from '../../../shared/services/budget.service';
import { AddBudgetComponent } from '../add-budget/add-budget.component';
import { UpdateBudgetComponent } from '../update-budget/update-budget.component';
import { BudgetPeriods } from '../../../shared/model/BudgetPeriods';
import { BudgetPeriodService } from '../../../shared/services/budget-period.service';

import { RippleModule } from 'primeng/ripple';
import { periodMap } from '../../../shared/model/PeriodType';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';



















@Component({
  selector: 'app-list-of-user-budget',
  standalone: true,
  imports: [SideNavbarComponent, TopNavBarComponent,
    FooterComponent, CommonModule, ButtonModule, TableModule, TagModule, IconFieldModule,
    InputTextModule, InputIconModule, MultiSelectModule,
    ToastModule, ButtonModule, ConfirmDialogModule, FormsModule, AddBudgetComponent, UpdateBudgetComponent,RippleModule],
  templateUrl:'./list-of-user-budget.component.html',
  styleUrls: ['./list-of-user-budget.component.css',
    '../../../../../public/css/teamplate/style.css',
    '../../../../../public/css/teamplate/typography.css',
    '../../../../../public/css/teamplate/responsive.css'],
  providers: [ConfirmationService, MessageService,DateFormatPipe]


})
export class ListOfUserBudgetComponent implements OnInit {
  changeMenu: boolean = false;
  // @ViewChild('dt1') dt1!: Table;

  // filterTable(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.dt1.filterGlobal(inputElement.value, 'contains');
  // }
  recevoirMessage(message: boolean) {
    this.changeMenu = message; // Stocke la valeur reçue
  }
  getCategoryName(category: number | string): string {
      
    if (typeof category === "number" && categoryMap.hasOwnProperty(category)) {
      return categoryMap[category];
    }
  
    console.warn("Category introuvable:", category); // Alerte si la valeur n'existe pas
    return "Unknown"; 

  }



  // budgets!: Budget[];
  // userid: any;


  // loading: boolean = true;

  // activityValues: number[] = [0, 100];

  // constructor(private budgetService: BudgetService, private confirmationService: ConfirmationService,
  //   private messageService: MessageService, private toastr: ToastrService, private authService: AuthService) { }


  // statuses!: any[];



  // searchValue: string | undefined;



  // ngOnInit() {
  //   this.userid = this.authService.getUserId();
  //   this.budgetService.getBudgetsOfUser(this.userid).subscribe(budgets => {
  //     console.log(budgets)
  //     this.budgets = budgets.map(budget => ({
  //       ...budget,
  //       categoryName: this.getCategoryName(budget.category),

  //     }));

  //     console.log(this.budgets);
  //     this.loading = false;
  //   });



  // }




  // getCategoryName(category: number | string): string {

  //   if (typeof category === "number" && categoryMap.hasOwnProperty(category)) {
  //     return categoryMap[category];
  //   }

  //   console.warn("Category introuvable:", category); // Alerte si la valeur n'existe pas
  //   return "Unknown";

  // }









  // clear(table: Table) {
  //   table.clear();  // Cette ligne vide le tableau
  //   this.searchValue = '';  // Si tu veux réinitialiser la recherche
  // }



  // delete(event: Event, id: any) {
  //   console.log("hello");
  //   event.stopPropagation();
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this Expense?',
  //     header: 'Delete Expense',
  //     icon: 'pi pi-info-circle',
  //     rejectLabel: 'Cancel',
  //     rejectButtonProps: {
  //       label: 'Cancel',
  //       severity: 'secondary',
  //       outlined: true,
  //     },
  //     acceptButtonProps: {
  //       label: 'Delete',
  //       severity: 'danger',
  //     },
  //     accept: () => {
  //       this.budgetService.deleteBudget(id).subscribe({
  //         next: () => {
  //           this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Expense deleted' });

  //           // Mettre à jour la liste des dépenses au lieu de recharger la page
  //           this.budgets = this.budgets.filter(budget => budget.id !== id);
  //         },
  //         error: (err) => {
  //           if (err.status === 400) {
  //             this.toastr.error('Cannot delete', 'Delete failed');
  //           } else if (err.status === 404) {
  //             this.toastr.error('Expense not found', 'Delete failed');
  //           } else {
  //             console.error('Error during deletion:', err);
  //             this.toastr.error('An unexpected error occurred', 'Delete failed');
  //           }
  //         }
  //       });
  //     },
  //     reject: () => {
  //       this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
  //     },
  //   });
  // }
  budgetPeriods!: BudgetPeriods[];

  expandedRows = {};

  constructor(private budgetPeriodService: BudgetPeriodService, private messageService: MessageService,
     private confirmationService: ConfirmationService,  private toastr: ToastrService) {}

  ngOnInit() {
      this.budgetPeriodService.getBudgetPeriodsList().subscribe(budgetPeriods => {
        this.budgetPeriods=budgetPeriods;





        
        this.budgetPeriods.forEach(period => {
          period.budgets.forEach(budget => {
            budget.categoryName = this.getCategoryName(budget.category);
          });
        });
      });    
    
  }

  expandAll() {
    this.expandedRows = this.budgetPeriods.reduce<{ [key: number]: boolean }>((acc, p) => {
      acc[p.id] = true;
      return acc;
    }, {});
  }

  collapseAll() {
      this.expandedRows = {};
  }

  onRowExpand(event: TableRowExpandEvent) {
      this.messageService.add({ severity: 'info', summary: 'budget Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
      this.messageService.add({ severity: 'success', summary: 'budget Collapsed', detail: event.data.name, life: 3000 });
  }
  getPeriodName(period: number | string): string {
      
    if (typeof period === "number" && periodMap.hasOwnProperty(period)) {
      return periodMap[period];
    }
  
    console.warn("Category introuvable:", period); // Alerte si la valeur n'existe pas
    return "Unknown"; 

  }

  deleteBudgetPeriod(event: Event, id: any) {
    console.log("Deleting budget period");
    event.stopPropagation();
    this.confirmationService.confirm({
        message: 'Do you want to delete this budget period and all its associated budgets?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: "p-button-danger p-button-text",
        rejectButtonStyleClass: "p-button-text",
        acceptIcon: "none",
        rejectIcon: "none",
        accept: () => {
            this.budgetPeriodService.deleteBudgetPeriod(id).subscribe({
                next: () => {
                    this.messageService.add({ 
                        severity: 'info', 
                        summary: 'Confirmed', 
                        detail: 'Budget period deleted successfully' 
                    });
                    // Filter out the deleted budget period
                    this.budgetPeriods = this.budgetPeriods.filter(period => period.id !== id);
                },
                error: (err: { status: number; }) => {
                    if (err.status === 400) {
                        this.toastr.error('Cannot delete budget period', 'Delete failed');
                    } else if (err.status === 404) {
                        this.toastr.error('Budget period not found', 'Delete failed');
                    } else {
                        console.error('Error during deletion:', err);
                        this.toastr.error('An unexpected error occurred', 'Delete failed');
                    }
                }
            });
        },
        reject: () => {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Rejected', 
                detail: 'Deletion cancelled' 
            });
        },
    });
}












}
