import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { BudgetService } from '../../../shared/services/budget.service';
import { MessageService } from 'primeng/api';

import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { SelectModule } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Fluid } from 'primeng/fluid';
import { ExpenseService } from '../../../shared/services/expense.service';
import { categoryMap } from '../../../shared/model/CategoryType';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-budget',
  standalone: true,
  imports: [Dialog, ButtonModule, InputTextModule,FormsModule,
       SelectModule,InputNumber,DatePicker,Fluid, ReactiveFormsModule,
       ProgressSpinnerModule,CommonModule],
  templateUrl: './add-budget.component.html',
  styleUrl: './add-budget.component.css'
})
export class AddBudgetComponent implements OnInit{
 visible: boolean = false;
  categories: any[] | undefined;
  value1!: number;
  datetime24h: Date[] | undefined;
  form: FormGroup;
  product!:any;
  loading: boolean = false;

  selectedCategories: string | undefined;
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
}
constructor(public formBuilder: FormBuilder, private toastr: ToastrService
  ,private authService:AuthService,private budgetService:BudgetService,private messageService: MessageService) {
    this.form = this.formBuilder.group({
      UserId: [this.authService.getUserId(), Validators.required],
      Category: ['', Validators.required],
      limitValue: ['', Validators.required],
      alertValue: ['', Validators.required],
      
    })
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
        this.budgetService.addBudget(this.form.value).subscribe({
          next: (res: any) => {
            console.log(res);
            window.location.reload();
            
          },
          error: (err) => {
            if (err.status == 400) {
              this.toastr.error('cannot add', 'add failed');
            } else {
              console.log('error during login');
            }
          }
        });
      }
     console.log(this.form.value)
    }

   
}
