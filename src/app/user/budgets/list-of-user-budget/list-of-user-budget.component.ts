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
  
  recevoirMessage(message: boolean) {
    this.changeMenu = message; // Stocke la valeur reçue
  }
 



 
  budgetPeriods!: BudgetPeriods[];

  expandedRows = {};

  constructor(private budgetPeriodService: BudgetPeriodService, private messageService: MessageService,
     private confirmationService: ConfirmationService,  private toastr: ToastrService,private authService:AuthService) {}

  ngOnInit() {
      this.budgetPeriodService.getBudgetPeriodsOfUser(this.authService.getUserId()).subscribe(budgetPeriods => {
        this.budgetPeriods=budgetPeriods;





        
       
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
