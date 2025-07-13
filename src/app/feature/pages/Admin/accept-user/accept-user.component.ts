import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../../core/services/client.service';

@Component({
  selector: 'app-accept-user',
  standalone: true,
  templateUrl: './accept-user.component.html',
  styleUrls: ['./accept-user.component.css'],
  imports: [CommonModule, TabViewModule, TableModule, ButtonModule, DialogModule]
})
export class AcceptUserComponent implements OnInit {
  licenseDialogVisible = false;
  selectedLicenseImage: string | null = null;

  statusTabs = [
  { label: 'Pending Customers', key: 'pending' },
  { label: 'Approved Customers', key: 'approved' },
  { label: 'Rejected Customers', key: 'rejected' },
  { label: 'Banned Customers', key: 'banned' },
  { label: 'Suspended Customers', key: 'suspended' }
  ];

  clientsMap: Record<string, any[]> = {
  pending: [],
  approved: [],
  rejected: [],
  banned: [],
  suspended: []
  };

  constructor(public _ClientService: ClientService) {}

  ngOnInit(): void {
  this.loadClients();
  }

  loadClients(): void {
  this._ClientService.getAllClients().subscribe((data: any[]) => {
  this.statusTabs.forEach(tab => {
  this.clientsMap[tab.key] = data.filter(client => client.verification_status === tab.key);
  });
  });
  }

  handleAction(action: string, clientId: string): void {
  switch (action) {
  case 'approve':
  this._ClientService.approveClient(clientId).subscribe(() => this.loadClients());
  break;
  case 'reject':
  this._ClientService.rejectClient(clientId).subscribe(() => this.loadClients());
  break;
  case 'ban':
  this._ClientService.banClient(clientId).subscribe(() => this.loadClients());
  break;
  case 'suspend':
  this._ClientService.suspendClient(clientId).subscribe(() => this.loadClients());
  break;
  }
  }

  openLicenseDialog(imagePath: string): void {
  this.selectedLicenseImage = imagePath;
  this.licenseDialogVisible = true;
  }
}