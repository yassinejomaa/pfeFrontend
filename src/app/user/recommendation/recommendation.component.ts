import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavbarComponent } from '../side-navbar/side-navbar.component';
import { TopNavBarComponent } from '../top-nav-bar/top-nav-bar.component';
import { PickListModule } from 'primeng/picklist';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Expense } from '../../shared/model/Expenses';
import { ExpenseService } from '../../shared/services/expense.service';
import { AuthService } from '../../shared/services/auth.service';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [
    CommonModule,
    SideNavbarComponent, 
    TopNavBarComponent, 
    PickListModule,
    DragDropModule,
    ProgressBarModule
  ],
  templateUrl: './recommendation.component.html',
  styleUrls: [
    './recommendation.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css'
  ]
})
export class RecommendationComponent implements OnInit {
  changeMenu: boolean = false;
  sourceExpenses: Expense[] = [];
  targetExpenses: Expense[] = [];
  recommendations: string = '';
  isLoading: boolean = false;
  loadingProgress: number = 0;
  loading: boolean = false; // Indicateur de chargement pour la barre de progression

  categoryImages = [
    { src: "images/electronics.png", num: 5 },
    { src: "images/entertainement.png", num: 3 },
    { src: "images/fashion.png", num: 6},
    { src: "images/food.png", num: 1 },
    { src: "images/health.png", num: 4 },
    { src: "images/housing.png", num: 7 },
    { src: "images/others.png", num: 8 },
    { src: "images/transportation.png", num: 2 }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.expenseService.getExpensesOfUser(this.authService.getUserId()).subscribe(expenses => {
      console.log(expenses);
      this.sourceExpenses = expenses;
      this.targetExpenses = [];
      this.cdr.markForCheck();
    });
  }

  transformExpenses(expenses: Expense[]): string[] {
    return expenses.map(expense => `${expense.name}: ${expense.amount} TND`);
  }

  // Fonction pour envoyer les dépenses à l'API et récupérer les recommandations
  getRecommendations() {
    this.loading = true; // Début du chargement
    const expenses = this.transformExpenses(this.targetExpenses);

    // Appel API pour obtenir des recommandations
    this.expenseService.recommendation(expenses).subscribe({
      next: (response) => {
        this.recommendations = response;  // Mise à jour des recommandations
        this.loading = false; 
        console.log(this.recommendations) // Arrêt de la barre de progression dès que la réponse est reçue
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des recommandations :", error);
        this.loading = false;  // Arrêt de la barre de progression en cas d'erreur
      }
    });
  }
  getCategoryImage(categoryId: number): string {
    const category = this.categoryImages.find(item => item.num === categoryId);
    return category ? category.src : 'images/default.png'; // Si non trouvé, retourne une image par défaut
  }

  recevoirMessage(message: boolean) {
    this.changeMenu = message;
  }
}

