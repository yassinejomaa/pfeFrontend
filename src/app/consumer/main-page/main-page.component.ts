import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [SideNavbarComponent, TopNavBarComponent, FooterComponent, CommonModule, AgCharts,TableModule],
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
  categories!:any;
  public options: AgChartOptions;
  @ViewChild('dt') dt!: Table;

  selectedCategory = 'Food';
startDate = '2025-04-01';
endDate = '2025-04-10';

    expenses!: Expense[];
    budgets!:any;

    

    isSorted: boolean = false;

  constructor(private dashboardService: DashboardService, private authService: AuthService,private categorieService:CategoryService) {
    this.options = {
      data: [],
      title: {
        text: "Expense Composition",
      },
      series: [
        {
          type: "donut", // Type de graphique en donut
          calloutLabelKey: "asset", // Utilisation de la clé pour les labels des segments
          angleKey: "amount", // Utilisation de la clé pour les angles des segments
          innerRadiusRatio: 0.9, // Crée l'effet donut
          innerLabels: [
            {
              text: "Total Investment", // Label interne
              fontWeight: "bold",
            },
            {
              text: "this.dashboardData.totalExpenses", // Valeur à afficher au centre
              spacing: 4,
              fontSize: 48,
              color: "green",
            },
          ],
          innerCircle: {
            fill: "white", // Couleur de l'intérieur du donut
          },
        },
      ],
    };
  }

  recevoirMessage(message: boolean) {
    this.changeMenu = message; // Stocke la valeur reçue
  }

  ngOnInit(): void {
    // Attendre la réponse du service avant de mettre à jour les options
    this.categorieService.getCategoriesList().subscribe({
      next:(res:any)=>{
        this.categories=res;
      }
    })
    this.dashboardService.getData(this.authService.getUserId()).subscribe({
      next: (res: any) => {
        console.log(res);
        this.dashboardData = res; // Stocke la réponse dans dashboardData
        this.expenses=res.recentExpenses;
        this.budgets=res.budgetPeriod.budgets;
        console.log(this.budgets)
        
        console.log(this.dashboardData.expensesByCategory);

        // Mettre à jour les options du graphique après avoir reçu les données
        if (this.dashboardData && this.dashboardData.expensesByCategory) {
          console.log("Données avant transformation:", this.dashboardData.expensesByCategory);
          this.options.data = this.getDataFromResponse(this.dashboardData.expensesByCategory);
          console.log("Données après transformation:", this.options.data);

          // Si les données sont valides, forcer la mise à jour du graphique
          if (this.options.data.length > 0) {
            this.options = { ...this.options }; // Force la mise à jour du graphique
          }
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des données", err);
        // Gérer les erreurs ici si nécessaire
      }
    });
  }

  // Fonction pour formater les données reçues dans un format compatible avec le graphique
  getDataFromResponse(data: any): any[] {
    // Assurez-vous que les données ont la structure attendue et que amount est bien un nombre
    return data.map((item: any) => ({
      asset: item.categoryName,  // Assurez-vous que 'categoryName' est bien une chaîne de caractères
      amount: parseFloat(item.totalAmount) || 0,  // Conversion en nombre, avec un fallback à 0 si c'est invalide
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
    const filteredData = this.dashboardData.recentExpenses.filter((item:any) => {
      const itemDate = new Date(item.date);
      return (
        item.categoryName === this.selectedCategory &&
        itemDate >= new Date(this.startDate) &&
        itemDate <= new Date(this.endDate)
      );
    });
  
    this.options = {
      title: { text: `${this.selectedCategory} Expenses` },
      data: filteredData.map((item:any) => ({
        date: item.date,
        amount: item.amount,
      })),
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
}
