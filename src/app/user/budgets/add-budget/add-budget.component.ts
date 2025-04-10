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

import { KnobModule } from 'primeng/knob';

import { ToastModule } from 'primeng/toast';


import { StepperModule } from 'primeng/stepper';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { FloatLabelModule } from 'primeng/floatlabel';
import { BudgetPeriodService } from '../../../shared/services/budget-period.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-add-budget',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, FormsModule,
    DropdownModule, InputNumberModule, CalendarModule, ReactiveFormsModule,
    ProgressSpinnerModule, CommonModule, StepperModule,
    ToggleButtonModule, IconFieldModule, InputIconModule, KnobModule, FloatLabelModule,ToastModule],
  templateUrl: './add-budget.component.html',
  styleUrl: './add-budget.component.css',
  providers: [MessageService]
})
export class AddBudgetComponent implements OnInit {
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

 // Dans le constructeur
constructor(private authService: AuthService, private budgetPeriodService: BudgetPeriodService, 
  private datePipe: DateFormatPipe, private messageService: MessageService) {
this.startDate = new Date();
this.endDate = this.calculateEndDate(this.startDate, this.selectedPeriod);
}

// Ajouter cette méthode pour mettre à jour la date de fin lorsque la date de début change
onStartDateChange() {
this.endDate = this.calculateEndDate(this.startDate, this.selectedPeriod);
}

// Ajouter cette méthode pour mettre à jour la date de fin lorsque la période change
onPeriodChange() {
this.endDate = this.calculateEndDate(this.startDate, this.selectedPeriod);
}








 
  
  // Total budget
  totalBudget: number = 0;
  startDate: Date = new Date();
  endDate: Date = new Date();
  
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





  private getCategoryId(categoryName: string): number {
    // Utiliser categoryMap importé pour récupérer l'ID de la catégorie
    const category = Object.keys(categoryMap).find(key => categoryMap[parseInt(key)].toLowerCase() === categoryName.toLowerCase());
    return category ? parseInt(category) : -1; // Retourne l'ID de la catégorie ou -1 si non trouvé
  }

  submitBudget() {
    const formattedStartDate = this.datePipe.transform(this.startDate)!;
    const formattedEndDate = this.datePipe.transform(this.endDate)!;

    console.log('Budget submitted');
    const budgets = Object.keys(this.categories).map(key => {
      const categoryId = this.getCategoryId(key); // Correction ici
      return {
        // ID à envoyer, ici 0 si c'est un nouveau budget
        categoryId: categoryId, // ID de la catégorie
        categoryName:this.categories[key].name,
        limitValue: this.categories[key].limitValue, // Limite de valeur sous forme de Float64Array
        alertValue: this.categories[key].alertValue, // Valeur d'alerte sous forme de Float64Array
        UserId: this.authService.getUserId(), // ID de l'utilisateur
         // ID de la période de budget
      };
    });

    // Créer l'objet formData avec toutes les données nécessaires
    const formData = {
      id: 0,
      period: 0, // Période du budget
      income: this.totalBudget, // Total du budget
      savings: this.remainingBudget, // Épargne
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      userId: this.authService.getUserId(), // ID de l'utilisateur
      budgets: budgets // Tableau des budgets formatés
    };
console.log(formData)

    
    this.budgetPeriodService.addBudgetPeriod(formData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Budget added successfully' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
        
      },
      error: (err) => {
        if (err.status == 400) {
        } else {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'error' });
          console.log(formData)
        }
      }
    });

    


    // Envoyer les données via HTTP POST avec .subscribe()
    
  }

  calculateEndDate(startDate: Date, period: number): Date {
    const endDate = new Date(startDate);
    
    // if (period === 0) { // Période hebdomadaire
    //   endDate.setDate(endDate.getDate() + 7);
    // } else if (period === 1) { // Période mensuelle
      endDate.setMonth(endDate.getMonth() + 1);
    // }
    
    return endDate;
  }


  formatKnobValue(value: number): string {
    return value.toFixed(2) + '%';
  }









}
