import { Component, OnInit } from '@angular/core';
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
  selector: 'app-add-expenses-manually',
  standalone: true,
  imports: [Dialog, ButtonModule, InputTextModule,FormsModule, SelectModule,InputNumber,DatePicker,Fluid, ReactiveFormsModule],
  templateUrl: './add-expenses-manually.component.html',
  styleUrl: './add-expenses-manually.component.css'
})
export class AddExpensesManuallyComponent implements OnInit {

  visible: boolean = false;
  categories: any[] | undefined;
  value1!: number;
  datetime24h: Date[] | undefined;
  form: FormGroup;

  selectedCategories: string | undefined;
  ngOnInit() {
    this.categories = [
        { name: 'Food', code: '0' },
        { name: 'Rent', code: '1' },
        { name: 'Transportation', code: '2' },
        { name: 'Health', code: '3' },
        { name: 'Entertainment', code: '4' },
        { name: 'Other', code: '5' },
        
    ];
}
constructor(public formBuilder: FormBuilder, private toastr: ToastrService,private authService:AuthService,private expenseService:ExpenseService) {
    this.form = this.formBuilder.group({
      UserId: [this.authService.getUserId(), Validators.required],
      Name: ['', Validators.required],
      Category: ['', Validators.required],
      Date: ['', Validators.required],
      Amount: ['', Validators.required],
      
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
        this.expenseService.addExpenseManually(this.form.value).subscribe({
          next: (res: any) => {
            console.log(res);
            //window.location.reload();
            
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
