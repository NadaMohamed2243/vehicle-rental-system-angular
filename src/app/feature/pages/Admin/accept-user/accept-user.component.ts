import { Component,OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { Client } from '../../../../core/interfaces/client'; // Assuming you have a data file with client information
import { ClientService } from '../../../../core/services/client.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-accept-user',
  imports: [TabViewModule,TableModule,ButtonModule],
  templateUrl: './accept-user.component.html',
  styleUrl: './accept-user.component.css'
})
export class AcceptUserComponent implements OnInit {
  pendingClients: any[] = [];
  approvedClients: any[] = [];

  constructor(private _ClientService:ClientService){}

  ngOnInit() {
    this.loadClients();
  };

  loadClients() {
    this._ClientService.getPendingClients().subscribe(data => {
    this.pendingClients = data;
  });

  this._ClientService.getApprovedClients().subscribe(data => {
    this.approvedClients = data;
  });
  }

  approveClient(id: number) {
  this._ClientService.approveClient(id).subscribe(() => {
    this.loadClients();
  });
}

rejectClient(id: number) {
  this._ClientService.rejectClient(id).subscribe(() => {
    this.loadClients(); 
  });
}


}



