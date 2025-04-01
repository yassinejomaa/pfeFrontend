import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { categoryMap } from '../../shared/model/CategoryType';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css', '../../../../public/css/teamplate/style.css', '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css'],
      providers: [ConfirmationService, MessageService,DateFormatPipe]
    
})
export class TopNavBarComponent implements OnInit {
  isDropdownOpen = false;
  isShow: boolean = false;
  isShowMessage: boolean = false;
  firstName?: String;
  lastName?: string;
  notifications: any[] = [];
  unreadCount = 0;
  loading = false;
  
  categoryImages = [
    { src: "images/electronics.png", num: 4 },
    { src: "images/entertainement.png", num: 2 },
    { src: "images/fashion.png", num: 5 },
    { src: "/images/food.png", num: 0 },
    { src: "images/health.png", num: 3 },
    { src: "images/housing.png", num: 6 },
    { src: "images/others.png", num: 7 },
    { src: "images/transportation.png", num: 1 }
  ];

  // ... reste du code existant

  getCategoryImage(categoryNum: number): string {
    const found = this.categoryImages.find(img => img.num === categoryNum);
    console.log(found);
    console.log(categoryNum);
    return found ? found.src : 'assets/images/default-category.png';
  }

  ngOnInit() {
    const userDataString = localStorage.getItem("userData");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        this.firstName = userData?.firstName ?? '';
        this.lastName = userData?.lastName ?? '';
        console.log(this.firstName);
      } catch (error) {
        console.error("Erreur lors de la conversion JSON :", error);
      }
    } else {
      console.log("Aucune donnée trouvée dans localStorage.");
    }
    this.loadNotifications();
    
    // Écouter les nouvelles notifications SignalR
    this.notificationService.notificationReceived.subscribe(notification => {
      this.notifications.unshift(notification);
      this.unreadCount++;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Basculer entre ouvert/fermé
  }
  constructor(private router: Router,private authService: AuthService,private notificationService: NotificationService,private http: HttpClient) {

  }
  onLogout() {
    this.authService.deleteToken()
    localStorage.removeItem('userData');
    this.router.navigateByUrl("/login");
  }
  @Input() bodyClass: any = {};
  toggleShow(event: Event) {
    event.stopPropagation(); // Empêche la propagation pour éviter de masquer immédiatement
    this.isShow = !this.isShow;
    this.isShowMessage = false;
    this.isDropdownOpen;
  }
  toggleShowMessage(event: Event) {
    event.stopPropagation(); // Empêche la propagation pour éviter de masquer immédiatement
    this.isShowMessage = !this.isShowMessage;
    this.isShow = false;
  }
  @HostListener('document:click')
  closeDropdown() {
    this.isShow = false;
    this.isShowMessage = false;
  }

  loadNotifications() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/notifications?unreadOnly=true`).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.isRead).length;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  markAsRead(id: number) {
    this.http.put(`${environment.apiBaseUrl}/api/notifications/${id}/mark-as-read`, {}).subscribe(() => {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.isRead = true;
        this.unreadCount--;
      }
    });
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'BudgetAlert': return 'assets/images/budget-alert.png';
      default: return 'assets/images/default-notification.png';
    }
  }
getCategoryName(category: number | string): string {
      
    if (typeof category === "number" && categoryMap.hasOwnProperty(category)) {
      return categoryMap[category];
    }
  
    console.warn("Category introuvable:", category); // Alerte si la valeur n'existe pas
    return "Unknown"; 

  }

}
