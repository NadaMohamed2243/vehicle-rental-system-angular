import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css'],
  standalone: true,
  imports: [AvatarModule, AvatarGroupModule , CommonModule]
})
export class UserHeaderComponent implements OnInit {
   constructor(private router: Router) {}

  user = {
    name: '',
    role: '',
    avatarUrl: ''
  };

  defaultAvatar = 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';
  pageTitle = '';

  ngOnInit(): void {
    // Simulate get from localStorage or auth service
    // const name = localStorage.getItem('name');
    // const role = localStorage.getItem('role');
    const avatar = localStorage.getItem('avatar');

    this.user = {
      name: 'Admin1',
      role: 'admin',
      avatarUrl: avatar || ''
    };

     // Watch Route Changes
  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  //   ).subscribe(() => {
  //     const currentUrl = this.router.url;

  //     if (currentUrl.includes('dashboard')) {
  //       this.pageTitle = 'Dashboard';
  //     } else if (currentUrl.includes('cars')) {
  //       this.pageTitle = 'Cars Management';
  //     } else if (currentUrl.includes('profile')) {
  //       this.pageTitle = 'Profile';
  //     } else {
  //       this.pageTitle = 'Vehicle Rental System';
  //     }
  //   });
  }


  
}
