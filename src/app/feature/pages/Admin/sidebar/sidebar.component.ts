import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';  
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-admin-sidebar',
  imports: [ RippleModule, AvatarModule,CommonModule,RouterLink,RouterLinkActive , DrawerModule, ButtonModule, SidebarModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarVisible = true;
  hovered = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }



}
