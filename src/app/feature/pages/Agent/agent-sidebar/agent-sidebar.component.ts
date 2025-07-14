import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientauthService } from '../../../../core/services/clientauth.service';

import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-agent-sidebar',
  imports: [RippleModule, AvatarModule,CommonModule,RouterLink,RouterLinkActive, SidebarModule, RouterModule],
  templateUrl: './agent-sidebar.component.html',
  styleUrl: './agent-sidebar.component.css'
})
export class AgentSidebarComponent {

  constructor(
  private authService: AuthService,
  private router: Router,
  private logoutAuth: ClientauthService
) {}

  sidebarVisible = true;
  hovered = false;
// used to toggle the sidebar from the dashboard component
  @Output() sidebarToggle = new EventEmitter<boolean>();

toggleSidebar() {
  this.sidebarVisible = !this.sidebarVisible;
  this.sidebarToggle.emit(this.sidebarVisible);
}

  logout() {
  this.logoutAuth.clear();
  this.authService.removeToken();
  this.router.navigate(['/landing']);
}
}
