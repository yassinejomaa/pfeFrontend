import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './user/register/register.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './user/login/login.component';
import { NotificationService } from './shared/services/notification.service';
import { AuthService } from './shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RegisterComponent,
    FontAwesomeModule,
    LoginComponent,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'pfefrontend';

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get current user ID from token
    const userId = this.authService.getUserId();
    
    if (userId) {
      // Convert number to string if needed (SignalR groups typically use strings)
      const userIdString = userId.toString();
      
      // Start SignalR connection
      this.notificationService.startConnection(userIdString);
      
      // Listen for notifications
      this.notificationService.addNotificationListener();
    }
  }
}