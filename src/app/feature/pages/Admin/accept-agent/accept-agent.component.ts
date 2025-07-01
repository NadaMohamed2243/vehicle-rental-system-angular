import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../../../core/services/agent.service';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Agent } from '../../../../core/interfaces/agent';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accept-agent',
  standalone: true,
  imports: [TabViewModule, TableModule, ButtonModule, DialogModule, CommonModule],
  templateUrl: './accept-agent.component.html',
  styleUrl: './accept-agent.component.css'
})
export class AcceptAgentComponent implements OnInit {
  pendingAgents: Agent[] = [];
  approvedAgents: Agent[] = [];
  rejectedAgents: Agent[] = [];
  bannedAgents: Agent[] = [];
  suspendedAgents: Agent[] = [];

  selectedAgent: Agent | null = null;
  selectedDocumentUrl: string = '';
  displayAgentDialog: boolean = false;
  displayDocumentDialog: boolean = false;


  constructor(public _AgentService: AgentService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
   this._AgentService.getAllAgents().subscribe((agents: Agent[]) => {
    this.pendingAgents = agents.filter(a => a.verification_status === 'pending');
    this.approvedAgents = agents.filter(a => a.verification_status === 'approved');
    this.rejectedAgents = agents.filter(a => a.verification_status === 'rejected');
    this.bannedAgents = agents.filter(a => a.verification_status === 'banned');
    this.suspendedAgents = agents.filter(a => a.verification_status === 'suspended');
  });
  }

  approveAgent(id: string): void {
    this._AgentService.approveAgent(id).subscribe(() => {
      this.loadAgents();
    });
  }

  rejectAgent(id: string): void {
    this._AgentService.rejectAgent(id).subscribe(() => {
      this.loadAgents();
    });
  }

  banAgent(id: string): void {
  this._AgentService.banAgent(id).subscribe(() => {
    this.loadAgents(); 
   });
  }

  suspendAgent(id: string): void {
    this._AgentService.suspendAgent(id).subscribe(() => {
      this.loadAgents();
    }); 
  }



 openDocument(documentUrl: string): void {
  this.selectedDocumentUrl = this._AgentService.getDocumentUrl(documentUrl);
  this.displayDocumentDialog = true;
  }

  showAgentDetails(agent: Agent): void {
    this.selectedAgent = agent;
    this.displayAgentDialog = true;
  }

  
}
