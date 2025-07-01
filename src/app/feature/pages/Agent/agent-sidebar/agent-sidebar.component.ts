import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-agent-sidebar',
  imports: [RippleModule, AvatarModule,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './agent-sidebar.component.html',
  styleUrl: './agent-sidebar.component.css'
})
export class AgentSidebarComponent {
  sidebarVisible = false;

    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    }
}
