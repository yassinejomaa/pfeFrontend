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
  
}
