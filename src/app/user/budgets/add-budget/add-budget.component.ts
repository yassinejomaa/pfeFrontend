import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { BudgetService } from '../../../shared/services/budget.service';
import { MessageService } from 'primeng/api';

import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ExpenseService } from '../../../shared/services/expense.service';
import { categoryMap } from '../../../shared/model/CategoryType';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';




import { StepperModule } from 'primeng/stepper';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


@Component({
  selector: 'app-add-budget',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule,FormsModule,
    DropdownModule,InputNumberModule,CalendarModule, ReactiveFormsModule,
       ProgressSpinnerModule,CommonModule,StepperModule,
       ToggleButtonModule,IconFieldModule,InputIconModule],
  templateUrl: './add-budget.component.html',
  styleUrl: './add-budget.component.css'
})
export class AddBudgetComponent implements OnInit{
 visible: boolean = false;
  periods: any[] | undefined;
  categories: any[] | undefined;
  hide:boolean=true;


  value1!: number;
  datetime24h: Date[] | undefined;
  form: FormGroup;
  product!:any;
  loading: boolean = false;
  selectedPeriod: number = 0;





  active: number= 0;

  name: string | undefined ;

    email: string | undefined ;

    password: string | undefined ;

  option1: boolean | undefined = false;

  option2: boolean | undefined = false;

  option3: boolean | undefined = false;

  option4: boolean | undefined = false;

  option5: boolean | undefined = false;

  option6: boolean | undefined = false;

  option7: boolean | undefined = false;

  option8: boolean | undefined = false;

  option9: boolean | undefined = false;

  option10: boolean | undefined = false;







  selectedCategories: string | undefined;
  ngOnInit() {
    this.periods = [
      { period: 'weakly', numberOfdate: '7' },
      { period: 'monthly', numberOfdate: '30' }

    ];
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
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
      
    })
  }

    showDialog() {
        this.visible = true;
    }
    onSubmit() {
      // Récupérer les dates et les convertir en objets Date
      const startDate = new Date(this.form.value.startDate);
      const endDate = new Date(this.form.value.endDate);
    
      // Ajouter un jour à la startDate
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);
    
      // Formater les dates en UTC (YYYY-MM-DD)
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
    
      // Mettre à jour les valeurs formatées dans le formulaire
      this.form.patchValue({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        Category: Number(this.form.value.Category)
      });
    
      // Afficher les valeurs formatées dans la console pour vérification
      console.log('Form Values:', this.form.value);
    
      // Vérifier la validité du formulaire avant d'envoyer les données
      if (this.form.valid) {
        this.budgetService.addBudget(this.form.value).subscribe({
          next: (res: any) => {
            console.log(res);
            window.location.reload(); // Recharger la page après l'ajout du budget
          },
          error: (err) => {
            console.error('Error during submit:', err);
          
            if (err.status === 400) {
              // Vérifier si le backend a envoyé un message spécifique
              if (err.error && err.error.message) {
                // Afficher le message spécifique du backend
                this.messageService.add({ 
                  severity: 'error', 
                  summary: 'Rejected', 
                  detail: err.error.message  // Afficher le message retourné par le backend
                });
              } else if (err.error && err.error.errors) {
                // Si le backend retourne des erreurs de validation pour les champs
                const errors: { [key: string]: string[] } = err.error.errors;
          
                // Parcourir chaque clé d'erreur dans `errors`
                for (const [field, messages] of Object.entries(errors)) {
                  // Assurer que messages est un tableau de chaînes
                  if (Array.isArray(messages)) {
                    messages.forEach(message => {
                      // Afficher un toast spécifique pour chaque message d'erreur
                      this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Rejected', 
                        detail: `${field} validation failed: ${message}` // Afficher le message d'erreur du champ
                      });
                    });
                  }
                }
              } else {
                console.log('Unknown error details:', err.error);
              }
            } else {
              console.log('Error during submit:', err.message || err);
            }
          }
          
          
          
          
          
          
        });
      }
    }
    
  
    onPeriodChange(event: any) {
      console.log("Période sélectionnée :", event.value);
      if(event.value==='customDate'){
        this.hide=false;
        console.log(this.form.value.endDate)
      }
      else{
        this.hide=true;
        this.selectedPeriod = Number(event.value); // Convertir en nombre
        this.updateDateEnd();
        console.log(this.form.value.endDate)        
      }
  }

  onDateBeginChange(event: any) {
    this.updateDateEnd(); // Mettre à jour la date de fin
    
}
updateDateEnd() {
  // Cloner la date de début
  this.form.value.endDate = new Date(this.form.value.startDate);

  if (this.selectedPeriod === 30) {
    // Si la période est "monthly", ajouter 1 mois
    this.form.value.endDate.setMonth(this.form.value.endDate.getMonth() + 1);
  } else {
    // Sinon, ajouter les jours en fonction de la période sélectionnée
    this.form.value.endDate.setDate(this.form.value.endDate.getDate() + this.selectedPeriod);
  }

  // Afficher la date de fin mise à jour dans la console
  console.log(this.form.value.endDate);
}

   
}
