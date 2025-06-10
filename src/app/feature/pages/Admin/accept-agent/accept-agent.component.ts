import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../../../core/services/agent.service';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Agent } from '../../../../core/interfaces/agent'; // Assuming you have an Agent interface defined
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-accept-agent',
  standalone: true,
  imports: [TabViewModule, TableModule, ButtonModule, DialogModule ,CommonModule],
  templateUrl: './accept-agent.component.html',
  styleUrl: './accept-agent.component.css'
})
export class AcceptAgentComponent implements OnInit {
  pendingAgents: any[] = [];
  approvedAgents: any[] = [];
  displayDocumentDialog: boolean = false;
  selectedDocumentUrl: string = '';
  selectedAgent: any = null;
  displayAgentDialog: boolean = false;



  constructor(private _AgentService: AgentService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this._AgentService.getPendingAgents().subscribe(data => {
      this.pendingAgents = data;
    });

    this._AgentService.getApprovedAgents().subscribe(data => {
      this.approvedAgents = data;
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

// Method to open the document in a dialog
  openDocument(documentUrl: string): void {
  this.selectedDocumentUrl = documentUrl;
  this.displayDocumentDialog = true;
}

// Method to open the Agent details dialog
showAgentDetails(agent: any) {
  console.log('Selected Agent:', agent);  //test log to check the agent data
  this.selectedAgent = agent;
  this.displayAgentDialog = true;
}


}
