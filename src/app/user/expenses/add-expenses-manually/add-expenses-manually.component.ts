import { Component, OnInit } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { categoryMap } from '../../../shared/model/CategoryType';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule, DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CategoryService } from '../../../shared/services/category.service';




@Component({
  selector: 'app-add-expenses-manually',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule,FormsModule,
     DropdownModule,InputNumberModule,CalendarModule,
     ReactiveFormsModule,
     ProgressSpinnerModule,CommonModule
     ],
  templateUrl: './add-expenses-manually.component.html',
  styleUrl: './add-expenses-manually.component.css',
  providers: [ConfirmationService, MessageService,DatePipe]
})
export class AddExpensesManuallyComponent  {

  visible: boolean = false;
  categories: any[] | undefined;
  value1!: number;
  datetime24h: Date[] | undefined;
  form: FormGroup;
  product!:any;
  loading: boolean = false;

  selectedCategories: string | undefined;
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
    
}
constructor(public formBuilder: FormBuilder, private toastr: ToastrService
  ,private authService:AuthService,private expenseService:ExpenseService,private messageService: MessageService,private categoryService:CategoryService, private datePipe: DatePipe
) {
    this.form = this.formBuilder.group({
      UserId: [this.authService.getUserId(), Validators.required],
      Name: ['', Validators.required],
      CategoryId: ['', Validators.required],
      Date: ['', Validators.required],
      Amount: ['', Validators.required],
      
    })
  }

    showDialog() {
        this.visible = true;
    }
    onSubmit() {
      
  
      if (this.form.valid) {
        const formData = { ...this.form.value };
        

    formData.Date = this.datePipe.transform(formData.Date, 'yyyy-MM-dd');
    console.log(formData)
        this.expenseService.addExpenseManually(formData).subscribe({
          next: (res: any) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense added successfully' });
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            
          },
          error: (err) => {
            if (err.status == 400) {
              this.toastr.error('cannot add', 'add failed');
            } else {
              console.log('error during submit');
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
