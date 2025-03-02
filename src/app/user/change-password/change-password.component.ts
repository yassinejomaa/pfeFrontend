import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class ChangePasswordComponent {
  @Input() activeTab: string = '';
}
