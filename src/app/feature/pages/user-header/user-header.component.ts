import { Component, OnInit } from '@angular/core';
import { ClientauthService } from '../../../core/services/clientauth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-user-header',
  imports: [AvatarModule , CommonModule, RouterLink, RouterLinkActive, RippleModule],
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {
  user = {
    name: 'Guest',
    role: 'guest',
    avatarUrl: ''
  };

defaultAvatar = 'https://primefaces.org/cdn/primeng/images/avatar/amyelsner.png';

  constructor(private authService: ClientauthService) {}

  ngOnInit(): void {
  const token = this.authService.getToken();

  if (token) {
    const decoded = this.decodeToken(token);
    const role = decoded?.role || 'user';

    if (role === 'admin') {
      this.user.name = 'Admin1';
      this.user.role = 'admin';
    } else if (role === 'agent') {
      this.user.name = 'Provider';
      this.user.role = 'provider';
    } else {
      this.user.name = decoded?.name || 'User';
      this.user.role = role;
    }

    //  this.user.avatarUrl = decoded?.avatar
    //   ? `http://localhost:5000/${decoded.avatar.replace(/\\/g, '/')}`
    //   : this.defaultAvatar;
  }
}

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }
}
