import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavbarComponent } from '../../user/side-navbar/side-navbar.component';
import { TopNavBarComponent } from '../../user/top-nav-bar/top-nav-bar.component';
import { FooterComponent } from '../../user/footer/footer.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [SideNavbarComponent,TopNavBarComponent,FooterComponent],
  templateUrl: './main-page.component.html',
  styleUrls:['./main-page.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class MainPageComponent {
  constructor(private router:Router){

  }
  onLogout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl("/login");
  }
}
