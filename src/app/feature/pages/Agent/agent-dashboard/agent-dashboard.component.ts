import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';     
import { AgentSidebarComponent } from '../agent-sidebar/agent-sidebar.component';

@Component({
  selector: 'app-agent-dashboard',
  imports: [RouterOutlet,CommonModule,AgentSidebarComponent],
  templateUrl: './agent-dashboard.component.html',
  styleUrl: './agent-dashboard.component.css'
})
export class AgentDashboardComponent {

   sidebarExpanded = true;
  // Method to handle sidebar toggle from the sidebar component to make it responsive and show components accoding to the sidebar state
  toggleSidebar(expanded: boolean) {
    this.sidebarExpanded = expanded;
}
}