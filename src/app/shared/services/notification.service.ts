import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  public notificationReceived = new Subject<any>();

  constructor(private toastr: ToastrService,private authService:AuthService,private http: HttpClient) { }

  public startConnection = (userId: string) => {
    
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/notificationHub`, {
        accessTokenFactory: () => this.authService.getToken() || ''
      })
      .build();
  
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.joinGroup(userId);
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public joinGroup = (userId: string) => {
    this.hubConnection.invoke('JoinGroup', userId)
      .catch(err => console.error(err));
  }

  public addNotificationListener = () => {
    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      // Émettre la notification via le Subject
      this.notificationReceived.next(notification);
      
      // Afficher aussi une toast
      this.toastr.warning(notification.message, 'New Notification', {
        timeOut: 10000,
        positionClass: 'toast-top-right'
      });
    });
  }


  deleteNotification(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/api/Notifications/${id}`);
  }
}