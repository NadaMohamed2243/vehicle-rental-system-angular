import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientauthService } from '../../../../core/services/clientauth.service';


@Component({
  selector: 'app-agent-sidebar',
  imports: [RippleModule, AvatarModule,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './agent-sidebar.component.html',
  styleUrl: './agent-sidebar.component.css'
})
export class AgentSidebarComponent {
  sidebarVisible = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private logoutAuth:ClientauthService
  ) {}
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    }
    logout() {
      this.logoutAuth.clear();
    this.authService.removeToken();
    this.router.navigate(['/landing']);
  }
}
