import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

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
        this.firstName = userData?.firstName ?? '';
        this.lastName = userData?.lastName ?? '';
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
  constructor(private router: Router,private authService: AuthService) {

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


}
