import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { categoryMap } from '../../shared/model/CategoryType';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule,ToastModule],
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css', '../../../../public/css/teamplate/style.css', 
            '../../../../public/css/teamplate/typography.css',
            '../../../../public/css/teamplate/responsive.css'],
  providers: [ConfirmationService, MessageService]
})
export class TopNavBarComponent implements OnInit, OnDestroy {
  isDropdownOpen = false;
  isShow: boolean = false;
  isShowMessage: boolean = false;
  firstName?: string;
  lastName?: string;
  notifications: any[] = [];
  unreadCount = 0;
  loading = false;
  currentPage = 1;
  notificationsPerPage = 4;
  totalPages = 1;
  isChangingPage = false;
  direction: 'forward' | 'backward' = 'forward';
  private animationTimeout: any;
  
  categoryImages = [
    { src: "images/electronics.png", num: 4 },
    { src: "images/entertainement.png", num: 2 },
    { src: "images/fashion.png", num: 5 },
    { src: "images/food.png", num: 0 },
    { src: "images/health.png", num: 3 },
    { src: "images/housing.png", num: 6 },
    { src: "images/others.png", num: 7 },
    { src: "images/transportation.png", num: 1 }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    
    
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadNotifications();
    
    this.notificationService.notificationReceived.subscribe(notification => {
      this.handleNewNotification(notification);
    });
  }

  ngOnDestroy() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  private loadUserData() {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        this.firstName = userData?.firstName ?? '';
        this.lastName = userData?.lastName ?? '';
      } catch (error) {
        console.error("JSON parsing error:", error);
      }
    }
  }

  private handleNewNotification(notification: any) {
    if (!this.notifications.some(n => n.id === notification.id)) {
      this.notifications.unshift(notification);
      this.totalPages = Math.ceil(this.notifications.length / this.notificationsPerPage);
      this.currentPage = 1; // Reset to first page
      if (!notification.isRead) {
        this.unreadCount++;
      }
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onLogout() {
    this.authService.deleteToken();
    localStorage.removeItem('userData');
    this.router.navigateByUrl("/login");
  }

  @Input() bodyClass: any = {};

  toggleShow(event: Event) {
    event.stopPropagation();
    this.isShow = !this.isShow;
    this.isShowMessage = false;
  }

  toggleShowMessage(event: Event) {
    event.stopPropagation();
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
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/notifications`).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.isRead).length;
        this.totalPages = Math.ceil(this.notifications.length / this.notificationsPerPage);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getPaginatedNotifications(): any[] {
    const startIndex = (this.currentPage - 1) * this.notificationsPerPage;
    const endIndex = startIndex + this.notificationsPerPage;
    return this.notifications.slice(startIndex, endIndex);
  }

  changePage(page: number, event: Event): void {
    event.stopPropagation();
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      // Set animation direction
      this.direction = page > this.currentPage ? 'forward' : 'backward';
      
      this.isChangingPage = true;
      
      // Clear any existing timeout
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
      }
      
      // Wait for animation to complete before changing data
      this.animationTimeout = setTimeout(() => {
        this.currentPage = page;
        this.isChangingPage = false;
      }, 300); // Match this with your CSS animation duration
    }
  }

  markAsRead(id: number) {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification || notification.isRead) return;

    this.http.put(`${environment.apiBaseUrl}/api/notifications/${id}/mark-as-read`, {}).subscribe({
      next: () => {
        notification.isRead = true;
        this.unreadCount--;
      },
      error: (err) => console.error('Error marking as read:', err)
    });
  }

  getCategoryImage(categoryNum: number): string {
    const found = this.categoryImages.find(img => img.num === categoryNum);
    return found ? found.src : 'assets/images/default-category.png';
  }

  getCategoryName(category: number | string): string {
    if (typeof category === "number" && categoryMap.hasOwnProperty(category)) {
      return categoryMap[category];
    }
    return "Unknown";
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'BudgetAlert': return 'assets/images/budget-alert.png';
      default: return 'assets/images/default-notification.png';
    }
  }





  deleteNotification(event: Event, id: any) {
  
          this.notificationService.deleteNotification(id).subscribe({
              next: () => {
                  this.messageService.add({ severity: 'error', summary: 'Confirmed', detail: 'Notification deleted' });
                  this.notifications = this.notifications.filter(notifications => notifications.id !== id);
              },
              error: (err) => {
                  if (err.status === 400) {
                    this.messageService.add({ severity: 'error', summary: 'Cannot delete', detail: 'Delete failed' });
                  } else if (err.status === 404) {
                      this.messageService.add({ severity: 'error', summary: 'Notification not found', detail: 'Delete failed' });

                  } else {
                      console.error('Error during deletion:', err);
                      this.messageService.add({ severity: 'error', summary: 'An unexpected error occurred', detail: 'Delete failed' });

                  }
              }
          });
      
      
    
}





}