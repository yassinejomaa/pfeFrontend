import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  public notificationReceived = new Subject<any>();

  constructor(private toastr: ToastrService) { }

  public startConnection = (userId: string) => {
    const token = localStorage.getItem('token');
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/notificationHub`, {
        accessTokenFactory: () => token || ''
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
}