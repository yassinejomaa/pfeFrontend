import { Component, Input, OnInit } from '@angular/core';
import { Expense } from '../../../shared/model/Expenses';
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

@Component({
  selector: 'app-update-expense',
  standalone: true,
  imports: [Dialog, ButtonModule, InputTextModule,FormsModule, SelectModule,InputNumber,DatePicker,Fluid, ReactiveFormsModule],
  templateUrl: './update-expense.component.html',
  styleUrl: './update-expense.component.css'
})
export class UpdateExpenseComponent implements OnInit {

  visible: boolean = false;
  categories: any[] | undefined;
  value1!: number;
  datetime24h: Date[] | undefined;
  form!: FormGroup;
  @Input() expense!: Expense;

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
  constructor(public formBuilder: FormBuilder, private toastr: ToastrService, private authService: AuthService, private expenseService: ExpenseService) {

  }

  initForm() {
    console.log("Valeur de category avant initialisation :", this.expense.category);
    this.form = this.formBuilder.group({
      id: [this.expense.id, Validators.required],
      UserId: [this.authService.getUserId(), Validators.required],
      Name: [this.expense.name, Validators.required],
      Category: [String(this.expense.category), Validators.required],  // Vérifie cette valeur !
      Date: [this.expense.date, Validators.required],
      Amount: [this.expense.amount, Validators.required],
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
      this.expenseService.updateExpense(this.expense.id,this.form.value).subscribe({
        
        next: (res: any) => {
          console.log(res);
          this.toastr.success('update successfully', 'success');
          window.location.reload();

        },
        error: (err) => {
          if (err.status == 400) {
            this.toastr.error('cannot update', 'update failed');
            console.log(this.form.value);
          } else {
            console.log('error during login');
          }
        }
      });
    }
  }
}
