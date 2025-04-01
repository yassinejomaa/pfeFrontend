import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  constructor(private toastr: ToastrService) { }

  public startConnection = (userId: string) => {
    // Get the JWT token from wherever you store it
    const token = localStorage.getItem('token'); // or however you store your token
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/notificationHub`, {
        accessTokenFactory: () => {
          // Ensure we never return null
          return token || ''; // Return empty string if token is null
        }
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
    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.toastr.warning(message, 'Budget Alert', {
        timeOut: 10000,
        positionClass: 'toast-top-right'
      });
    });
  }
}