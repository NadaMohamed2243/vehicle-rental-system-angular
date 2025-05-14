import { Routes } from '@angular/router';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { LoginComponent } from './core/pages/login/login.component';
import { LandingComponent } from './feature/pages/landing/landing.component';
import { HomeComponent } from './feature/pages/home/home.component';
import { RegisterComponent } from './core/pages/register/register.component';
import { ForgetPasswordComponent } from './core/pages/forget-password/forget-password.component';
import { CarsComponent } from './feature/pages/cars/cars.component';
import { ResetPasswordComponent } from './core/pages/reset-password/reset-password.component';
import { PendingResetPasswordComponent } from './core/pages/pending-reset-password/pending-reset-password.component';

export const routes: Routes = [
  {path:"landing", component:LandingComponent},
  {path:"home", component:HomeComponent},
  {path:"cars", component:CarsComponent},
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
  {path:"forgetPassword", component:ForgetPasswordComponent},
  {path:"pendingResetPassword", component:PendingResetPasswordComponent},
  {path:"resetPassword", component:ResetPasswordComponent},
  {path:"**", component:NotFoundComponent}
];
