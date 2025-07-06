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

}
