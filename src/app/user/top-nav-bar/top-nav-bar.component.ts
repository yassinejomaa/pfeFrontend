import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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
  isDropdownOpen = false;
  isShow: boolean = false;
  isShowMessage: boolean = false;


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Basculer entre ouvert/fermé
  }
  constructor(private router:Router){

  }
  onLogout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl("/login");
  }

  toggleShow(event: Event) {
    event.stopPropagation(); // Empêche la propagation pour éviter de masquer immédiatement
    this.isShow = !this.isShow;
    this.isShowMessage=false;
    this.isDropdownOpen;
  }
  toggleShowMessage(event: Event) {
    event.stopPropagation(); // Empêche la propagation pour éviter de masquer immédiatement
    this.isShowMessage = !this.isShowMessage;
    this.isShow =false;
  }
  @HostListener('document:click')
  closeDropdown() {
    this.isShow = false;
    this.isShowMessage=false;
  }
  

}
