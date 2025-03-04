import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css', '../../../../public/css/teamplate/style.css', '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class TopNavBarComponent implements OnInit {
  isDropdownOpen = false;
  isShow: boolean = false;
  isShowMessage: boolean = false;
  firstName?: String;
  lastName?: string;

  ngOnInit() {
    const userDataString = localStorage.getItem("userData");
  
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        this.firstName = userData?.first_Name ?? ''; 
        this.lastName = userData?.last_Name ?? '';
        console.log(this.firstName);
      } catch (error) {
        console.error("Erreur lors de la conversion JSON :", error);
      }
    } else {
      console.log("Aucune donnée trouvée dans localStorage.");
    }
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Basculer entre ouvert/fermé
  }
  constructor(private router: Router) {

  }
  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.router.navigateByUrl("/login");
  }

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


}
