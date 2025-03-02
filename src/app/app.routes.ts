import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { MainPageComponent } from './consumer/main-page/main-page.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent }, // Page d'accueil
    { path: 'register', component: RegisterComponent }, 
    { path: 'mainPage', component: MainPageComponent },
    { path: 'editProfile', component: EditProfileComponent },
    { path: 'pswd', component: ChangePasswordComponent },
];
