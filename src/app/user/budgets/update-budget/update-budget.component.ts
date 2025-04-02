import { Component, Input, OnInit } from '@angular/core';
import { Budget } from '../../../shared/model/Budgets';
import { BudgetService } from '../../../shared/services/budget.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

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
import { BudgetPeriods } from '../../../shared/model/BudgetPeriods';
import { BudgetPeriodService } from '../../../shared/services/budget-period.service';



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
export class UpdateBudgetComponent implements OnInit {
  visible: boolean = false;
  periods: any[] | undefined;
  @Input() budgetPeriod!: BudgetPeriods;
  hide: boolean = true;

  value1!: number;
  datetime24h: Date[] | undefined;
  product!: any;
  loading: boolean = false;
  selectedPeriod: number = 0;

  startDate: Date = new Date();
  endDate: Date = new Date();


  active: number = 0;









  selectedCategories: string | undefined;

  constructor(private authService:AuthService,private budgetPeriodService:BudgetPeriodService,private datePipe:DateFormatPipe,private messageService: MessageService){

    this.startDate = new Date(); // date actuelle
    this.endDate = this.calculateEndDate(this.startDate);



  }
  ngOnInit() {
    this.periods = [
      { period: 'weakly', numberOfdate: '7' },
      { period: 'monthly', numberOfdate: '30' }

    ];
    this.totalBudget = this.budgetPeriod.income;
    this.startDate = new Date(this.budgetPeriod.startDate);
  
    // Initialiser les catégories avec les budgets existants
    if (this.budgetPeriod.budgets && this.budgetPeriod.budgets.length > 0) {
      this.budgetPeriod.budgets.forEach(budget => {
        const categoryKey = this.getCategoryKey(budget.category);
        if (categoryKey && this.categories[categoryKey]) {
          this.categories[categoryKey].limitValue = budget.limitValue;
          this.categories[categoryKey].alertValue = budget.alertValue;
          
          // Calculer le pourcentage si le budget total est défini
          if (this.totalBudget > 0) {
            this.categories[categoryKey].knobValue = (budget.limitValue / this.totalBudget) * 100;
          }
        }
      });
    }

    console.log(this.budgetPeriod)
    
   
  }
  









 
  
  // Total budget
  totalBudget: any = 0;
  
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





  private getCategoryKey(categoryCode: number): string | null {
    switch(categoryCode) {
      case 0: return 'food';
      case 1: return 'transport';
      case 2: return 'entertainment';
      case 3: return 'health';
      case 4: return 'electronics';
      case 5: return 'fashion';
      case 6: return 'housing';
      case 7: return 'others';
      default: return null;
    }}


    private getCategoryId(categoryName: string): number {
      // Utiliser categoryMap importé pour récupérer l'ID de la catégorie
      const category = Object.keys(categoryMap).find(key => categoryMap[parseInt(key)].toLowerCase() === categoryName.toLowerCase());
      return category ? parseInt(category) : -1; // Retourne l'ID de la catégorie ou -1 si non trouvé
    }
  
    
    updateBudget() {
      const formattedStartDate = this.datePipe.transform(this.startDate)!;
      const formattedEndDate = this.datePipe.transform(this.endDate)!;
    
      // Créer un mapping des budgets existants par catégorie
      const existingBudgetsMap = new Map<number, Budget>();
      if (this.budgetPeriod.budgets) {
        this.budgetPeriod.budgets.forEach(budget => {
          existingBudgetsMap.set(budget.category, budget);
        });
      }
    
      // Générer tous les budgets selon le format attendu par l'API
      const budgets = Object.keys(this.categories).map(key => {
        const categoryId = this.getCategoryId(key);
        const existingBudget = existingBudgetsMap.get(categoryId);
    
        return {
          id: existingBudget ? existingBudget.id : 0,
          category: categoryId,
          limitValue: this.categories[key].limitValue || 0,
          alertValue: this.categories[key].alertValue || 0,
          budgetPeriodId: this.budgetPeriod.id // Notez le changement de casse ici
        };
      });
      
    
      const formData = {
        id: this.budgetPeriod.id,
        period: 0, // Utilisez la période existante
        income: this.totalBudget,
        savings: this.remainingBudget || 0,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        userId: this.authService.getUserId(),
        budgets: budgets
      };
    
      console.log('Data to send to API:', formData);
    
      this.budgetPeriodService.updateBudgetPeriod(this.budgetPeriod.id, formData).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Budget updated successfully'
          });
          this.visible = false;
          // Option: emit event or reload data
        },
        error: (err) => {
          console.error('Error updating budget:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update budget'
          });
        }
      });
    }
  
    calculateEndDate(startDate: Date): Date {
      const period = 0; // Par exemple, utiliser la période ici pour décider si on ajoute 7 jours ou 1 mois
      let endDate: Date;
  
      if (period === 0) {
        // Si période 0, ajouter 7 jours à la startDate
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else {
        // Si période 1, ajouter 1 mois à la startDate
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
      }
  
      return endDate;
    }

    formatKnobValue(value: number): string {
      return value.toFixed(2) + '%';
    }






}

