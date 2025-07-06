import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ClientService } from '../../../../core/services/client.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-accept-user',
  standalone: true,
  imports: [TabViewModule, TableModule, ButtonModule,CommonModule, DialogModule],
  templateUrl: './accept-user.component.html',
  styleUrl: './accept-user.component.css'
})
export class AcceptUserComponent implements OnInit {
  pendingClients: any[] = [];
  approvedClients: any[] = [];
  rejectedClients: any[] = [];
  bannedClients: any[] = [];
  suspendedClients: any[] = [];
  licenseDialogVisible: boolean = false;
  selectedLicenseImage: string | null = null;



  constructor(public _ClientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this._ClientService.getAllClients().subscribe(data => {
      this.pendingClients = data.filter((client: any) => client.verification_status === 'pending');
      this.approvedClients = data.filter((client: any) => client.verification_status === 'approved');
      this.rejectedClients = data.filter((client: any) => client.verification_status === 'rejected');
      this.bannedClients = data.filter((client: any) => client.verification_status === 'banned');
      this.suspendedClients = data.filter((client: any) => client.verification_status === 'suspended');
    });
  }

  approveClient(id: string) {
    this._ClientService.approveClient(id).subscribe(() => {
      this.loadClients();
    });
  }

  rejectClient(id: string) {
    this._ClientService.rejectClient(id).subscribe(() => {
      this.loadClients();
    });
  }

  banClient(id: string) {
    this._ClientService.banClient(id).subscribe(() => {
      this.loadClients();
    });
  }

  
  suspendClient(id: string) {
    this._ClientService.suspendClient(id).subscribe(() => {
      this.loadClients();
    });
  }


  // Function to open the license dialog with the selected image
  openLicenseDialog(imagePath: string) {
  this.selectedLicenseImage = imagePath;
  this.licenseDialogVisible = true;
  }
}
