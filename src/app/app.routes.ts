import { AgentRegisterComponent } from './core/pages/agent-register/agent-register.component';
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
import { AcceptUserComponent } from './feature/pages/Admin/accept-user/accept-user.component';
import { CarCardsComponent } from './feature/pages/Admin/car-cards/car-cards.component';
import { OverviewComponent } from './feature/pages/Admin/overview/overview.component';
import { AcceptAgentComponent } from './feature/pages/Admin/accept-agent/accept-agent.component';
import { BookingComponent } from './feature/pages/Admin/booking/booking.component';

import { AgentDashboardComponent } from './feature/pages/Agent/agent-dashboard/agent-dashboard.component';
import { AgentCarCardsComponent } from './feature/pages/Agent/agent-car-cards/agent-car-cards.component';
import { AgentAddCarComponent } from './feature/pages/Agent/agent-add-car/agent-add-car.component';

import { MainRegisterComponent } from './core/pages/main-register/main-register.component';
import { RoleGuard } from './role.guard';
import { AuthGuard } from './auth.guard';
import { UnauthorizedComponent } from './core/pages/unauthorized/unauthorized.component';
import { CompleteProfileComponent } from './core/pages/complete-profile/complete-profile.component';
import { ClientProfileComponent } from './feature/pages/client-profile/client-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'home', component: HomeComponent ,canActivate: [AuthGuard]}, //must logged in
  { path: 'cars', component: CarsComponent ,canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'clientRegister', component: RegisterComponent },
  { path: 'agentRegister', component: AgentRegisterComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'pendingResetPassword', component: PendingResetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  {path:'register',component:MainRegisterComponent},
  { path: 'complete-profile', component: CompleteProfileComponent },
  { path: 'profile', component: ClientProfileComponent },


  // Admin routes
  {
    path: 'dashboard',
    component: DashboardComponent,
      canActivate: [RoleGuard], //must login and is admin
      data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'booking', component: BookingComponent },
      { path: 'accept-user', component: AcceptUserComponent },
      { path: 'accept-agent', component: AcceptAgentComponent },
      { path: 'car-cards', component: CarCardsComponent },
     
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
      { path: 'agent-add-car/:id',component: AgentAddCarComponent }

      // { path: 'agent-overview', component: OverviewComponent },
    ],
  },
  {path:'unauthorized',component:UnauthorizedComponent},
  { path: '**', component: NotFoundComponent },
];
