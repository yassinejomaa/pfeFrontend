import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { MainPageComponent } from './consumer/main-page/main-page.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { EnterMailComponent } from './user/forgotPassword/enter-mail/enter-mail.component';
import { ResetPasswordComponent } from './user/forgotPassword/reset-password/reset-password.component';
import { authGuard } from './shared/auth.guard';
import { ListOfExpensesComponent } from './user/expenses/list-of-expenses/list-of-expenses.component';
import { ListOfUserBudgetComponent } from './user/budgets/list-of-user-budget/list-of-user-budget.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent }, 
    { path: 'mainPage', component: MainPageComponent ,canActivate:[authGuard]},
    { path: 'editProfile', component: EditProfileComponent ,canActivate:[authGuard]},
    { path: 'pswd', component: ChangePasswordComponent ,canActivate:[authGuard]},
    { path: 'recoverPassword', component: EnterMailComponent },
    { path: 'resetPassword', component: ResetPasswordComponent },
    { path: 'listExpenses', component: ListOfExpensesComponent ,canActivate:[authGuard]},
    { path: 'listBudgets', component: ListOfUserBudgetComponent ,canActivate:[authGuard]},
    
];
