import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './side-navbar.component.html',
  styleUrls:['./side-navbar.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class SideNavbarComponent {
  changeMenu = false;
  
  @Output() clicked = new EventEmitter<boolean>(); // Déclare l'événement
  constructor(private router: Router) {}

  menuChange(event: Event) {
    event.stopPropagation();
    this.changeMenu = !this.changeMenu;
    console.log(this.changeMenu)
    this.sendEvent(); // Envoie la valeur mise à jour au parent
  }

  sendEvent() {
    this.clicked.emit(this.changeMenu); // Envoie la valeur correcte au parent
  }
  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
