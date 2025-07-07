import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive,Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-admin-sidebar',
  imports: [ RippleModule, AvatarModule,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarVisible = false;
  constructor(
  private authService: AuthService,
  private router: Router
) {}
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  logout() {
  this.authService.removeToken();
  this.router.navigate(['/login']); // أو ['admin/login'] حسب حالتك
}

}
