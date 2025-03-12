import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavbarComponent } from '../../user/side-navbar/side-navbar.component';
import { TopNavBarComponent } from '../../user/top-nav-bar/top-nav-bar.component';
import { FooterComponent } from '../../user/footer/footer.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [SideNavbarComponent,TopNavBarComponent,FooterComponent,CommonModule],
  templateUrl: './main-page.component.html',
  styleUrls:['./main-page.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class MainPageComponent {
  changeMenu: boolean = false;

  recevoirMessage(message: boolean) {
    this.changeMenu = message; // Stocke la valeur reçue
  }
}