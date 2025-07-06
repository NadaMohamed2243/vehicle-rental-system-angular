import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { links } from '../../../constants/navLinks';
import { ClientauthService } from '../../../../core/services/clientauth.service';
import { Router } from 'express';


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  links = links;
  private _router=inject(Router);
  private _auth=inject(ClientauthService);

  logout() {
  this._auth.clear();
  this._router.navigate(['/landing']);
  }
}
