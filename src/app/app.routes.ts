import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { MainPageComponent } from './consumer/main-page/main-page.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { EnterMailComponent } from './user/forgotPassword/enter-mail/enter-mail.component';
import { ResetPasswordComponent } from './user/forgotPassword/reset-password/reset-password.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [

    { path: 'login', component: LoginComponent }, // Page d'accueil
    { path: 'register', component: RegisterComponent }, 
    { path: 'mainPage', component: MainPageComponent ,canActivate:[authGuard]},
    { path: 'editProfile', component: EditProfileComponent ,canActivate:[authGuard]},
    { path: 'pswd', component: ChangePasswordComponent ,canActivate:[authGuard]},
    { path: 'recoverPassword', component: EnterMailComponent },
    { path: 'resetPassword', component: ResetPasswordComponent },
];
