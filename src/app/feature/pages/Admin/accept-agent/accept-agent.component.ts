import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../../../core/services/agent.service';
import { Agent } from '../../../../core/interfaces/agent';
import { UserHeaderComponent } from '../../user-header/user-header.component';

@Component({
  selector: 'app-accept-agent',
  standalone: true,
  templateUrl: './accept-agent.component.html',
  styleUrl: './accept-agent.component.css',
  imports: [CommonModule, TabViewModule, TableModule, ButtonModule, DialogModule, FormsModule, UserHeaderComponent]
})
export class AcceptAgentComponent implements OnInit {
  searchTerm: string = '';
  activeTabIndex = 0;
  selectedTabKey = 'pending';

  displayAgentDialog: boolean = false;
  displayDocumentDialog: boolean = false;

  selectedAgent: Agent | null = null;
  selectedDocumentUrl: string = '';

  statusTabs = [
    { label: 'Pending', key: 'pending' },
    { label: 'Approved', key: 'approved' },
    { label: 'Rejected', key: 'rejected' },
    { label: 'Banned', key: 'banned' },
    { label: 'Suspended', key: 'suspended' }
  ];

  agentsMap: Record<string, Agent[]> = {
    pending: [],
    approved: [],
    rejected: [],
    banned: [],
    suspended: []
  };

  constructor(public _AgentService: AgentService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  onTabChange(event: any) {
    this.selectedTabKey = this.statusTabs[event.index].key;
  }

  loadAgents(): void {
    this._AgentService.getAllAgents().subscribe((agents: Agent[]) => {
      this.statusTabs.forEach(tab => {
        this.agentsMap[tab.key] = agents.filter(agent => agent.verification_status === tab.key);
      });
    });
  }

  getFilteredAgents(): Agent[] {
    const term = this.searchTerm.toLowerCase();
    return this.agentsMap[this.selectedTabKey]?.filter(agent =>
      agent.company_name?.toLowerCase().includes(term) ||
      agent.phone_number?.toLowerCase().includes(term) ||
      agent.location?.toLowerCase().includes(term)
    ) || [];
  }

  approveAgent(id: string): void {
    this._AgentService.approveAgent(id).subscribe(() => this.loadAgents());
  }

  rejectAgent(id: string): void {
    this._AgentService.rejectAgent(id).subscribe(() => this.loadAgents());
  }

  banAgent(id: string): void {
    this._AgentService.banAgent(id).subscribe(() => this.loadAgents());
  }

  suspendAgent(id: string): void {
    this._AgentService.suspendAgent(id).subscribe(() => this.loadAgents());
  }

  openDocument(documentPath: string): void {
    this.selectedDocumentUrl = this._AgentService.getDocumentUrl(documentPath);
    this.displayDocumentDialog = true;
  }

  showAgentDetails(agent: Agent): void {
    this.selectedAgent = agent;
    this.displayAgentDialog = true;
  }
}
