import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { MainPageComponent } from './consumer/main-page/main-page.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent }, // Page d'accueil
    { path: 'register', component: RegisterComponent }, 
    { path: 'mainPage', component: MainPageComponent },// Page "À propos"
];
