import { Component, Input, OnInit } from '@angular/core';
import { Expense } from '../../../shared/model/Expenses';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import {InputNumberModule } from 'primeng/inputnumber';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { categoryMap } from '../../../shared/model/CategoryType';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../shared/services/category.service';



@Component({
  selector: 'app-update-expense',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule
    ,FormsModule, ReactiveFormsModule,ProgressSpinnerModule,CommonModule,DropdownModule,CalendarModule,InputNumberModule],
  templateUrl: './update-expense.component.html',
  styleUrl: './update-expense.component.css'
})
export class UpdateExpenseComponent implements OnInit {

  visible: boolean = false;
  categories: any[] | undefined;
  value1!: number;
  datetime24h: Date[] | undefined;
  form!: FormGroup;
  loading: boolean = false;

  @Input() expense!: Expense;

  ngOnInit() {
    this.categoryService.getCategoriesList().subscribe({
      next: (res: any) => {
        this.categories=res;
        console.log(this.categories)
        
      },
      error: (err) => {
        console.log("can not get");
      }
    });
    this.initForm();
  }
  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
     private authService: AuthService, private expenseService: ExpenseService,private categoryService:CategoryService,
     private messageService: MessageService) {

  }

  initForm() {
    console.log("Valeur de category avant initialisation :", this.expense.category);
    this.form = this.formBuilder.group({
      id: [this.expense.id, Validators.required],
      UserId: [this.authService.getUserId(), Validators.required],
      Name: [this.expense.name, Validators.required],
      CategoryId: [this.expense.categoryId, Validators.required],  // Vérifie cette valeur !
      Date: [this.expense.date, Validators.required],
      Amount: [this.expense.amount, Validators.required],
    });
  
    console.log("Valeur initialisée dans le formulaire :", this.form.value);
  }
  

  showDialog() {
    this.visible = true;
  }
  onSubmit() {
    
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
  predictCategory() {
    if (this.form.value.Name) {
      this.loading = true; // ➜ Afficher le spinner avant l'appel API
      const product = { product: this.form.value.Name };
      
      this.expenseService.predictCategoy(product).subscribe({
        next: (res: any) => {
          console.log("🔥 Catégorie prédite :", res.predicted_category);
  
          const categoryCode = Number(Object.keys(categoryMap).find(
            key => categoryMap[Number(key)] === res.predicted_category
          ));
          
          console.log(categoryCode);

          if (categoryCode !== undefined) {

            this.form.patchValue({ CategoryId: categoryCode });
            console.log(this.form.value)
          } else {
            console.warn("❌ Catégorie non trouvée dans le mapping");
          }
        },
        error: (err) => {
          console.error("Erreur API :", err);
          this.toastr.error('Erreur lors de la prédiction', 'Erreur');
        },
        complete: () => {
          this.loading = false; // ➜ Cacher le spinner après la réponse API
        }
      });
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Enter Product Name' });

    }
  }
      
    
    
  
}
