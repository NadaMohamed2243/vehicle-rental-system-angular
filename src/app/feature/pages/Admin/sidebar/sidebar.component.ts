import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';  
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-admin-sidebar',
  imports: [ RippleModule, AvatarModule,CommonModule,RouterLink,RouterLinkActive , DrawerModule, ButtonModule, SidebarModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarVisible = true;
  hovered = false;
// used to toggle the sidebar from the dashboard component
  @Output() sidebarToggle = new EventEmitter<boolean>();

toggleSidebar() {
  this.sidebarVisible = !this.sidebarVisible;
  this.sidebarToggle.emit(this.sidebarVisible);
}

  


}
