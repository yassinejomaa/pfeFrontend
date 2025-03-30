import { Component, Input, OnInit } from '@angular/core';
import { Budget } from '../../../shared/model/Budgets';
import { BudgetService } from '../../../shared/services/budget.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { InputNumber } from 'primeng/inputnumber';
// import { DatePicker } from 'primeng/datepicker';
// import { Fluid } from 'primeng/fluid';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { categoryMap } from '../../../shared/model/CategoryType';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { KnobModule } from 'primeng/knob';
import { StepperModule } from 'primeng/stepper';
import { ToggleButtonModule } from 'primeng/togglebutton';



@Component({
  selector: 'app-update-budget',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, FormsModule,
      DropdownModule, InputNumberModule, CalendarModule, ReactiveFormsModule,
      ProgressSpinnerModule, CommonModule, StepperModule,
      ToggleButtonModule, IconFieldModule, InputIconModule, KnobModule, FloatLabelModule],
  templateUrl: './update-budget.component.html',
  styleUrl: './update-budget.component.css'
})
export class UpdateBudgetComponent {
  visible: boolean = false;
  periods: any[] | undefined;
  // categories: any[] | undefined;
  hide: boolean = true;

  value1!: number;
  datetime24h: Date[] | undefined;
  product!: any;
  loading: boolean = false;
  selectedPeriod: number = 0;





  active: number = 0;









  selectedCategories: string | undefined;
  ngOnInit() {
    this.periods = [
      { period: 'weakly', numberOfdate: '7' },
      { period: 'monthly', numberOfdate: '30' }

    ];
    // this.categories = [
    //   { name: 'Food', code: '0' },
    //   { name: 'Transport', code: '1' },
    //   { name: 'Entertainment', code: '2' },
    //   { name: 'Health', code: '3' },
    //   { name: 'Electronics', code: '4' },
    //   { name: 'Fashion', code: '5' },
    //   { name: 'Housing', code: '6' },
    //   { name: 'Others', code: '7' },

    // ];


  }









 
  
  // Total budget
  totalBudget: number = 0;
  startDate: Date = new Date();
  
  // Budget categories and allocations
  categories: {[key: string]: {
    name: string,
    icon: string,
    limitValue: number,
    knobValue: number,
    alertValue: number
  }} = {
    food: { name: 'Food', icon: 'ri-cup-fill', limitValue: 0, knobValue: 0, alertValue: 0 },
    transport: { name: 'Transport', icon: 'ri-roadster-fill', limitValue: 0, knobValue: 0, alertValue: 0 },
    entertainment: { name: 'Entertainment', icon: 'ri-football-fill', limitValue: 0, knobValue: 0, alertValue: 0 },
    health: { name: 'Health', icon: 'ri-hospital-line', limitValue: 0, knobValue: 0, alertValue: 0 },
    electronics: { name: 'Electronics', icon: 'ri-customer-service-fill', limitValue: 0, knobValue: 0, alertValue: 0 },
    fashion: { name: 'Fashion', icon: 'ri-handbag-line', limitValue: 0, knobValue: 0, alertValue: 0 },
    housing: { name: 'Housing', icon: 'ri-home-4-fill', limitValue: 0, knobValue: 0, alertValue: 0 },
    others: { name: 'Others', icon: 'ri-lightbulb-line', limitValue: 0, knobValue: 0, alertValue: 0 }
  };
  
  // Track the remaining budget
  get remainingBudget(): number {
    let used = 0;
    for (const cat in this.categories) {
      used += this.categories[cat].limitValue || 0;
    }
    return this.totalBudget - used;
  }
  
  // Track the remaining percentage
  get remainingPercentage(): number {
    let used = 0;
    for (const cat in this.categories) {
      used += this.categories[cat].knobValue || 0;
    }
    return 100 - used;
  }
  
  showDialog() {
    this.visible = true;
  }
  
  // Update knob percentage when limit value changes
  onLimitValueChange(category: string, value: number) {
    if (!this.totalBudget) return;
    
    const newPercentage = (value / this.totalBudget) * 100;
    this.categories[category].knobValue = parseFloat(newPercentage.toFixed(2));
    
    // Validate that we don't exceed the total budget
    let totalLimit = 0;
    for (const cat in this.categories) {
      totalLimit += this.categories[cat].limitValue || 0;
    }
    
    if (totalLimit > this.totalBudget) {
      // Adjust limit value to not exceed budget
      this.categories[category].limitValue = value - (totalLimit - this.totalBudget);
      this.categories[category].knobValue = (this.categories[category].limitValue / this.totalBudget) * 100;
    }
  }
  
  // Update limit value when knob percentage changes
  onKnobValueChange(category: string, value: number) {
    if (!this.totalBudget) return;
  
    // Calculer le total actuel sans inclure la catégorie en cours de modification
    let usedPercentage = 0;
    for (const cat in this.categories) {
      if (cat !== category) {
        usedPercentage += this.categories[cat].knobValue || 0;
      }
    }
  
    // Calculer le pourcentage maximum autorisé pour cette catégorie
    const maxAllowed = 100 - usedPercentage;
  
    // Si la nouvelle valeur dépasse le max, on la bloque
    if (value > maxAllowed) {
      value = maxAllowed;
    }
  
    // Mise à jour des valeurs
    const newLimit = (value / 100) * this.totalBudget;
    this.categories[category].knobValue = parseFloat(value.toFixed(2));
    this.categories[category].limitValue = parseFloat(newLimit.toFixed(2));
  }
  
  
  
  // Set the total budget
  setTotalBudget(value: any) {
    this.totalBudget = value;
    
    // Recalculate all limit values based on knob percentages
    for (const cat in this.categories) {
      if (this.categories[cat].knobValue > 0) {
        this.categories[cat].limitValue = (this.categories[cat].knobValue / 100) * this.totalBudget;
      }
    }
  }















}

  // visible: boolean = false;
  // categories: any[] | undefined;
  // periods: any[] | undefined;

  // value1!: number;
  // datetime24h: Date[] | undefined;
  // form!: FormGroup;
  // loading: boolean = false;
  // selectedPeriod: number = 0;
  // hide: boolean = true;

  // @Input() budget!: Budget;

  // ngOnInit() {
  //   this.periods = [
  //     { period: 'Daily', numberOfdate: '1' },
  //     { period: 'weakly', numberOfdate: '7' },
  //     { period: 'monthly', numberOfdate: '30' },
  //     { period: 'customize', numberOfdate: 'customDate' }

  //   ];
  //   this.categories = [
  //     { name: 'Food', code: '0' },
  //     { name: 'Transport', code: '1' },
  //     { name: 'Entertainment', code: '2' },
  //     { name: 'Health', code: '3' },
  //     { name: 'Electronics', code: '4' },
  //     { name: 'Fashion', code: '5' },
  //     { name: 'Housing', code: '6' },
  //     { name: 'Others', code: '7' },

  //   ];
  //   this.initForm();
  // }
  // constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
  //   private authService: AuthService, private budgetService: BudgetService,
  //   private messageService: MessageService) {

  // }

  // initForm() {
  //   const endDate = new Date(this.budget.endDate);
  //   const startDate = new Date(this.budget.startDate);
  //   this.form = this.formBuilder.group({
  //     id: [this.budget.id, Validators.required],
  //     UserId: [this.authService.getUserId(), Validators.required],
  //     limitValue: [this.budget.limitValue, Validators.required],
  //     alertValue: [this.budget.alertValue, Validators.required],
  //     Category: [String(this.budget.category), Validators.required],
  //     startDate: [this.budget.startDate, Validators.required],
  //     endDate: [this.budget.endDate, Validators.required],
  //     period: ['', Validators.required]
  //   });

   
    
  //   let nextDay = new Date(startDate);
  //   nextDay.setDate(startDate.getDate() + 1);
    
  //   let nextMonth = new Date(startDate);
  //   nextMonth.setMonth(startDate.getMonth() + 1);
    
  //   let next7Days = new Date(startDate);
  //   next7Days.setDate(startDate.getDate() + 7);
    
  //   if (endDate.getTime() === nextDay.getTime()) {
  //     this.form.patchValue({ period: '1' });
  //   } else if (endDate.getTime() === nextMonth.getTime()) {
  //     console.log("hello");
  //     this.form.patchValue({ period: '30' });
  //   } else if (endDate.getTime() === next7Days.getTime()) {
  //     this.form.patchValue({ period: '7' });
  //   } else {
  //     this.form.patchValue({ period: 'customDate' });
  //     this.hide = false;
  //   }
    
  //   console.log("Valeur initialisée dans le formulaire :", this.form.value);
  // }


  // showDialog() {
  //   this.visible = true;
  // }
  // onSubmit() {
  //   // Récupérer les dates et les convertir en objets Date
  //   const startDate = new Date(this.form.value.startDate);
  //   const endDate = new Date(this.form.value.endDate);

  //   // Ajouter un jour à la startDate
  //   startDate.setDate(startDate.getDate() + 1);
  //   endDate.setDate(endDate.getDate() + 1);

  //   // Formater les dates en UTC (YYYY-MM-DD)
  //   const formattedStartDate = startDate.toISOString().split('T')[0];
  //   const formattedEndDate = endDate.toISOString().split('T')[0];

  //   // Mettre à jour les valeurs formatées dans le formulaire
  //   this.form.patchValue({
  //     startDate: formattedStartDate,
  //     endDate: formattedEndDate,
  //     Category: Number(this.form.value.Category)
  //   });

  //   if (this.form.valid) {
  //     this.budgetService.updateBudget(this.budget.id, this.form.value).subscribe({

  //       next: (res: any) => {
  //         console.log(res);
  //         this.messageService.add({ severity: 'success', summary: 'Rejected', detail: 'update successfully' });
  //         window.location.reload();

  //       },




  //       error: (err) => {
  //         console.error('Error during submit:', err);

  //         if (err.status === 400) {
  //           // Vérifier si le backend a envoyé un message spécifique
  //           if (err.error && err.error.message) {
  //             // Afficher le message spécifique du backend
  //             this.messageService.add({
  //               severity: 'error',
  //               summary: 'Rejected',
  //               detail: err.error.message  // Afficher le message retourné par le backend
  //             });
  //           } else if (err.error && err.error.errors) {
  //             // Si le backend retourne des erreurs de validation pour les champs
  //             const errors: { [key: string]: string[] } = err.error.errors;

  //             // Parcourir chaque clé d'erreur dans `errors`
  //             for (const [field, messages] of Object.entries(errors)) {
  //               // Assurer que messages est un tableau de chaînes
  //               if (Array.isArray(messages)) {
  //                 messages.forEach(message => {
  //                   // Afficher un toast spécifique pour chaque message d'erreur
  //                   this.messageService.add({
  //                     severity: 'error',
  //                     summary: 'Rejected',
  //                     detail: `${field} validation failed: ${message}` // Afficher le message d'erreur du champ
  //                   });
  //                 });
  //               }
  //             }
  //           } else {
  //             console.log('Unknown error details:', err.error);
  //           }
  //         } else {
  //           console.log('Error during submit:', err.message || err);
  //         }
  //       }
  //     });
  //   }
  // }

  // onPeriodChange(event: any) {
  //   console.log("Période sélectionnée :", event.value);
  //   if (event.value === 'customDate') {
  //     this.hide = false;
  //     console.log(this.form.value.endDate)
  //   }
  //   else {
  //     this.hide = true;
  //     this.selectedPeriod = Number(event.value); // Convertir en nombre
  //     this.updateDateEnd();
  //     console.log(this.form.value.endDate)
  //   }
  // }

  // onDateBeginChange(event: any) {
    
  //   this.updateDateEnd(); 
  //   console.log(this.form.value)

  // }
  // updateDateEnd() {
  //   if (!this.form.value.startDate) return;
  
  //   // Créer une copie indépendante de la date de début
  //   const startDate = new Date(this.form.value.startDate);
  //   let endDate = new Date(startDate); // Copie indépendante
  
  //   if (this.selectedPeriod === 30) {
  //     // Ajouter 1 mois
  //     endDate.setMonth(endDate.getMonth() + 1);
  //   } else {
  //     // Ajouter les jours en fonction de la période sélectionnée
  //     endDate.setDate(endDate.getDate() + this.selectedPeriod);
  //   }
  
  //   // Mettre à jour la valeur du champ endDate dans le formulaire
  //   this.form.patchValue({ endDate });
  
  //   console.log(endDate);
  // }
  


