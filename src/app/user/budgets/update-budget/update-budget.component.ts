import { Component, Input, OnInit } from '@angular/core';
import { Budget } from '../../../shared/model/Budgets';
import { BudgetService } from '../../../shared/services/budget.service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Fluid } from 'primeng/fluid';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { categoryMap } from '../../../shared/model/CategoryType';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-update-budget',
  standalone: true,
  imports: [Dialog, ButtonModule, InputTextModule
      ,FormsModule, SelectModule,InputNumber
      ,DatePicker,Fluid, ReactiveFormsModule,ProgressSpinnerModule,CommonModule],
  templateUrl: './update-budget.component.html',
  styleUrl: './update-budget.component.css'
})
export class UpdateBudgetComponent implements OnInit {
  visible: boolean = false;
    categories: any[] | undefined;
    value1!: number;
    datetime24h: Date[] | undefined;
    form!: FormGroup;
    loading: boolean = false;
  
    @Input() budget!: Budget;
  
    ngOnInit() {
      this.categories = [
        { name: 'Food', code: '0' },
        { name: 'Transport', code: '1' },
        { name: 'Entertainment', code: '2' },
        { name: 'Health', code: '3' },
        { name: 'Electronics', code: '4' },
        { name: 'Fashion', code: '5' },
        { name: 'Housing', code: '6' },
        { name: 'Others', code: '7' },
  
      ];
      this.initForm();
    }
    constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
       private authService: AuthService, private budgetService: BudgetService,
       private messageService: MessageService) {
  
    }
  
    initForm() {
      console.log("Valeur de category avant initialisation :", this.budget.category);
      this.form = this.formBuilder.group({
        id: [this.budget.id, Validators.required],
        UserId: [this.authService.getUserId(), Validators.required],
        limitValue: [this.budget.limitValue, Validators.required],
        alertValue: [this.budget.alertValue, Validators.required],
        Category: [String(this.budget.category), Validators.required],
      });
    
      console.log("Valeur initialisée dans le formulaire :", this.form.value);
    }
    
  
    showDialog() {
      this.visible = true;
    }
    onSubmit() {
      this.form.patchValue({
        Category: Number(this.form.value.Category)
      });
      console.log(this.form.value);
  
      if (this.form.valid) {
        this.budgetService.updateBudget(this.budget.id,this.form.value).subscribe({
          
          next: (res: any) => {
            console.log(res);
            this.messageService.add({ severity: 'success', summary: 'Rejected', detail: 'update successfully' });
            window.location.reload();
  
          },
          error: (err) => {
            if (err.status == 400) {
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'update failed' });
              console.log(this.form.value);
            } else {
              console.log('error during update');
            }
          }
        });
      }
    }
     
}
