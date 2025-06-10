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

import { DashboardComponent } from './feature/pages/Admin/dashboard/dashboard.component';
import { AddCarComponent } from './feature/pages/Admin/add-car/add-car.component';
import { AcceptUserComponent } from './feature/pages/Admin/accept-user/accept-user.component';
import { CarCardsComponent } from './feature/pages/Admin/car-cards/car-cards.component';
import { OverviewComponent } from './feature/pages/Admin/overview/overview.component';
import { AcceptAgentComponent } from './feature/pages/Admin/accept-agent/accept-agent.component';


import { AgentDashboardComponent } from './feature/pages/Agent/agent-dashboard/agent-dashboard.component';
import { AgentCarCardsComponent } from './feature/pages/Agent/agent-car-cards/agent-car-cards.component';
import { AgentAddCarComponent } from './feature/pages/Agent/agent-add-car/agent-add-car.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cars', component: CarsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'pendingResetPassword', component: PendingResetPasswordComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },


  // Admin routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'car-cards', component: CarCardsComponent },
      { path: 'add-car', component: AddCarComponent },
      { path: 'accept-user', component: AcceptUserComponent },
      { path: 'accept-agent', component: AcceptAgentComponent },
      { path: 'overview', component: OverviewComponent },
    ],
  },

  // Agent routes
  {
    path: 'agent-dashboard',
    component: AgentDashboardComponent,
    children: [
      // { path: '', redirectTo: 'agent-overview', pathMatch: 'full' },
      { path: 'agent-car-cards', component:  AgentCarCardsComponent },
      { path: 'agent-add-car', component: AgentAddCarComponent },
      // { path: 'agent-overview', component: OverviewComponent },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
