import { Component } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { ClientService } from '../../../core/services/client.service';


@Component({
  selector: 'app-client-profile',
  imports: [LayoutComponent],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.css'
})
export class ClientProfileComponent {

  tabs = [
    { label: 'Info', value: 'info' },
    { label: 'Documents', value: 'documents' },
    { label: 'Current Order', value: 'orders' }
  ] as const;

  activeTab: (typeof this.tabs[number])['value'] = 'info';

  constructor(
      private router: Router,
      private clientService: ClientService
    ) {}

  private userRole: string | null = null;
  profileData: any;
  licenseImageUrl: string = '';


   ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.clientService.getClientProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.licenseImageUrl = this.clientService.getDriverLicenseImageUrl(this.profileData.profile.driver_license);
      },
      error: (err) => {
        console.error('Error fetching client profile', err);
        this.router.navigate(['/login']);
      }
    });

   }


}
