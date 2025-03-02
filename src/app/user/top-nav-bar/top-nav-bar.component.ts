import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css','../../../../public/css/teamplate/style.css','../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class TopNavBarComponent {
  isDropdownOpen = false; // État du menu

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Basculer entre ouvert/fermé
  }
  constructor(private router:Router){

  }
  onLogout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl("/login");
  }
}
