import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-navbar.component.html',
  styleUrls:['./side-navbar.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class SideNavbarComponent {
  changeMenu=false;
  menuChange(event: Event) {
    event.stopPropagation(); // Empêche la propagation pour éviter de masquer immédiatement
    this.changeMenu = !this.changeMenu;
  
  }
}
