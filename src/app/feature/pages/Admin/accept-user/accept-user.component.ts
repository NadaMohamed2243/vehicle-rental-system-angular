import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../../core/services/client.service';
import { FormsModule } from '@angular/forms';
import { UserHeaderComponent } from '../../user-header/user-header.component';

@Component({
  selector: 'app-accept-user',
  standalone: true,
  templateUrl: './accept-user.component.html',
  styleUrls: ['./accept-user.component.css'],
  imports: [CommonModule, TabViewModule, TableModule, ButtonModule, DialogModule , FormsModule,UserHeaderComponent]
})
export class AcceptUserComponent implements OnInit {
  licenseDialogVisible = false;
  selectedLicenseImage: string | null = null;
  searchTerm: string = '' ;
  activeTabIndex = 0;
  selectedTabKey = 'pending';

  statusTabs = [
  { label: 'Pending', key: 'pending' },
  { label: 'Approved', key: 'approved' },
  { label: 'Rejected', key: 'rejected' },
  { label: 'Banned', key: 'banned' },
  { label: 'Suspended', key: 'suspended' }
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
    onTabChange(event: any) {
    this.selectedTabKey = this.statusTabs[event.index].key;
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

  getFilteredClients() {
    const term = this.searchTerm.toLowerCase();
    return this.clientsMap[this.selectedTabKey]?.filter(client =>
      (client.first_name + ' ' + client.last_name).toLowerCase().includes(term) ||
      client.phone_number?.toLowerCase().includes(term) ||
      client.location?.toLowerCase().includes(term)
    ) || [];
  }
}