import { Component } from '@angular/core';
import { SideNavbarComponent } from '../side-navbar/side-navbar.component';
import { TopNavBarComponent } from '../top-nav-bar/top-nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { PersonalInformationComponent } from '../personal-information/personal-information.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [SideNavbarComponent,TopNavBarComponent,FooterComponent,ChangePasswordComponent,PersonalInformationComponent,CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class EditProfileComponent {
  activeTab: string = 'personal-information'; // Onglet par défaut

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

}
