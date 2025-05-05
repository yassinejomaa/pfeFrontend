import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SideNavbarComponent } from '../../user/side-navbar/side-navbar.component';
import { TopNavBarComponent } from '../../user/top-nav-bar/top-nav-bar.component';
import { FooterComponent } from '../../user/footer/footer.component';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../shared/services/dashboard.service';
import { AuthService } from '../../shared/services/auth.service';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { TableModule } from 'primeng/table';
import { Expense } from '../../shared/model/Expenses';
import { Table } from 'primeng/table';
import { CategoryService } from '../../shared/services/category.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';  // Import du DatePipe
import { ExpenseService } from '../../shared/services/expense.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    SideNavbarComponent,
    TopNavBarComponent,
    FooterComponent,
    CommonModule,
    AgCharts,
    TableModule,
    FormsModule,
    RouterModule,
  ],
  providers: [DatePipe],  // Ajout du provider DatePipe
  templateUrl: './main-page.component.html',
  styleUrls: [
    './main-page.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css'
  ]
})
export class MainPageComponent implements OnInit {
  changeMenu: boolean = false;
  dashboardData!: any;
  categories!: any;
  currentPage: number = 1;
  itemsPerPage: number = 4; // Adjust as needed
  paginatedBudgets: any[] = [];
  totalExpensePerDate:any[]=[];
  prdected_expense:any;
  
  @ViewChild('dt') dt!: Table;

  selectedCategory = 'Food';
  startDate: string;
  endDate: string;
  allExpenses!:Expense[];
  recentExpenses!: Expense[];
  budgets!: any;
  isSorted: boolean = false;
  TotalExpenseIndateRange=0;
  TotalExpenseByAllCategoryInPeriod=0;
  percentageSpent: number = 0;
  isHide:boolean=false;

  public donutChartOptions: AgChartOptions;
  public lineChartOptions: AgChartOptions;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private categorieService: CategoryService,
    private datePipe: DatePipe ,
  ) {

    const currentDate = new Date();
    this.startDate = currentDate.toISOString().split('T')[0]; // Exemple: '2025-04-01'
    
    // Calculer la date de fin (1 mois après la date actuelle)
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 1); // Ajoute 1 mois à la date actuelle
    this.endDate = endDate.toISOString().split('T')[0]; 
    // Configuration initiale des graphiques
    this.donutChartOptions = {
      data: [],
      title: {
        text: "Expense Composition",
      },
      series: [
        {
          type: "donut",
          calloutLabelKey: "asset",
          angleKey: "amount",
          innerRadiusRatio: 0.9,
          innerLabels: [
            {
              text: "Total Investment",
              fontWeight: "bold",
            },
            {
              text: "this.dashboardData.totalExpenses",
              spacing: 4,
              fontSize: 48,
              color: "green",
            },
          ],
          innerCircle: {
            fill: "white",
          },
        },
      ],
    };

    this.lineChartOptions = {
      data: [],
      title: { text: "Expense Over Time" },
      series: [
        {
          type: "line",
          xKey: "date",
          xName: "Date",
          yKey: "amount",
          yName: "Amount Spent",
          interpolation: { type: "smooth" },
        },
      ],
    };
  }

  recevoirMessage(message: boolean) {
    this.changeMenu = message;
  }

  ngOnInit(): void {

    this.categorieService.getCategoriesList().subscribe({
      next: (res: any) => {
        this.categories = res.map((cat: any) => cat.name);
        this.categories = ['All', ...this.categories];
        this.selectedCategory = 'All';
      }
    });
    this.isHide = true;
    

    

    this.dashboardService.getData(this.authService.getUserId()).subscribe({
      next: (res: any) => {
        console.log(res.budgetPeriod.predictedExpense);
        this.prdected_expense=res.budgetPeriod.predictedExpense;
        this.dashboardData = res;
        this.totalExpensePerDate=res.expensesByDate;
        console.log("expense per date",this.totalExpensePerDate)
        console.log(this.dashboardData)
        this.recentExpenses = res.recentExpenses;
        this.budgets = res.budgetPeriod.budgets;
        this.allExpenses=res.dailyExpensesSum;
        this.updateChart(); // Mettre à jour le graphique avec les données récupérées
        this.paginateBudgets();

        if (this.dashboardData && this.dashboardData.expensesByCategory) {
          this.donutChartOptions.data = this.getDataFromResponse(this.dashboardData.expensesByCategory);
          this.donutChartOptions = { ...this.donutChartOptions };
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des données", err);
      }
    });
  }

  getDataFromResponse(data: any): any[] {
    return data.map((item: any) => ({
      asset: item.categoryName,
      amount: parseFloat(item.totalAmount) || 0,
    }));
  }

  getCategoryIconClass(category: string): string {
    switch (category.toLowerCase()) {
      case 'food':
        return 'ri-restaurant-line';
      case 'transport':
        return 'ri-bus-line';
      case 'entertainment':
        return 'ri-movie-line';
      case 'health':
        return 'ri-heart-pulse-line';
      case 'electronics':
        return 'ri-macbook-line';
      case 'fashion':
        return 'ri-t-shirt-line';
      case 'housing':
        return 'ri-home-2-line';
      case 'others':
        return 'ri-more-line';
      default:
        return 'ri-wallet-3-line';
    }
  }

  getIconColor(category: string): string {
    switch (category.toLowerCase()) {
      case 'food':
        return 'tomato';
      case 'transport':
        return 'royalblue';
      case 'entertainment':
        return 'purple';
      case 'health':
        return 'crimson';
      case 'electronics':
        return 'darkorange';
      case 'fashion':
        return 'hotpink';
      case 'housing':
        return 'seagreen';
      case 'others':
        return 'gray';
      default:
        return 'black';
    }
  }

  updateChart() {
    this.TotalExpenseIndateRange = 0;
    this.TotalExpenseByAllCategoryInPeriod = 0;

    
    if (this.selectedCategory == 'All') {
      this.isHide=true;
      const filteredDataForAllPeriods = this.totalExpensePerDate.filter((item: any) => {
        const itemDate = new Date(item.date);
        const isInPeriod = itemDate >= new Date(this.startDate) && itemDate <= new Date(this.endDate);
    
        return isInPeriod;
      });
    
      const formattedData = filteredDataForAllPeriods.map((item: any) => ({
        date: this.datePipe.transform(item.date, 'yyyy-MM-dd'),
        amount: item.totalExpensesForDate,
        valueForEachCategory: item.categories // Assure-toi que 'categories' existe et est bien un tableau
      }));


      
     
      formattedData.map((item: any) => {
        this.TotalExpenseIndateRange += item.amount;
      });
      
      

    
      this.lineChartOptions = {
        title: { text: `All Expenses` },
        data: formattedData,
        series: [
          {
            type: 'line',
            xKey: 'date',
            xName: 'Date',
            yKey: 'amount',
            yName: 'Amount Spent',
            interpolation: { type: 'smooth' },
            stroke: '#1e3d73',
            strokeWidth: 3,
            marker: {
              enabled: true,
              fill: '#1e3d73',
              stroke: '#ffffff',
              size: 10
            },
            tooltip: {
              renderer: ({ datum }) => {
                let tooltipTitle = "";
                
                if (datum.valueForEachCategory && Array.isArray(datum.valueForEachCategory)) {
                  // Commencer directement avec les catégories sans titre préliminaire
                  datum.valueForEachCategory.forEach((item: any, index: number) => {
                    // Ajouter un retour à la ligne uniquement entre les items (pas avant le premier)
                    if (index > 0) tooltipTitle += "\n";
                    tooltipTitle += `${item.categoryName}: ${item.totalAmount}`;
                  });
                } else {
                  tooltipTitle = "No category details available";
                }
                
                return {
                  title: tooltipTitle,
                  content: '' // Content vide
                };
              }
            }
          }
        ]
      };
      return;
    }
    
    
    this.isHide=false;
    
    
  

  
    // Filtrer les données par catégorie et période
    const filteredData = this.allExpenses.filter((item: any) => {
      const itemDate = new Date(item.date);
      // Vérifie si l'élément est dans la période sélectionnée
      const isInPeriod = itemDate >= new Date(this.startDate) && itemDate <= new Date(this.endDate);
  
      // Si l'élément est dans la période, ajoute à TotalExpenseIndateRange pour la catégorie sélectionnée
      if (isInPeriod) {
        if (item.categoryName === this.selectedCategory) {
          this.TotalExpenseIndateRange += item.amount; // Pour la catégorie sélectionnée
        }
  
        // Ajoute à TotalExpenseByAllCategoryInPeriod pour toutes les catégories
        this.TotalExpenseByAllCategoryInPeriod += item.amount;
      }
  
      // Retourne vrai uniquement pour les éléments dans la période et la catégorie sélectionnée
      return (
        item.categoryName === this.selectedCategory &&
        isInPeriod
      );
    });
  
    // Calcul du pourcentage
    this.percentageSpent = 0;
    if (this.TotalExpenseByAllCategoryInPeriod > 0) {
      this.percentageSpent = (this.TotalExpenseIndateRange / this.TotalExpenseByAllCategoryInPeriod) * 100;
    }
  
    // Affichage du pourcentage dans la console (ou à l'écran)
    console.log("Total Expense for selected category:", this.TotalExpenseIndateRange);
    console.log("Total Expense for all categories:", this.TotalExpenseByAllCategoryInPeriod);
    console.log("Percentage spent on selected category:", this.percentageSpent);
  
    // Formater les dates pour l'affichage dans le graphique
    const formattedData = filteredData.map((item: any) => ({
      date: this.datePipe.transform(item.date, 'yyyy-MM-dd'), // Formatage de la date
      amount: item.amount,
    }));
  
    // Configuration du graphique
    

    this.lineChartOptions = {
      title: { text: `${this.selectedCategory} Expenses` },
      data: formattedData,
      series: [
        {
          type: "line",
          xKey: "date",
          xName: "Date",
          yKey: "amount",
          yName: "Amount Spent",
          interpolation: { type: "smooth" }, 
          stroke: '#1e3d73', 
          strokeWidth: 3,
          marker: {
            enabled: true,
            fill: '#1e3d73',
            stroke: '#ffffff', 
            size: 10,
          }
        },
      ],
    };

    // Afficher dans la console les données filtrées
    console.log("filteredData", formattedData);
    console.log("Percentage spent on selected category:", this.percentageSpent);
  }
  paginateBudgets() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBudgets = this.budgets.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.paginateBudgets();
  }

  get totalPages(): number {
    return Math.ceil(this.budgets.length / this.itemsPerPage);
  }
  
}
