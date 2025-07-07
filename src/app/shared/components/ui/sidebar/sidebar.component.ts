import { ClientauthService } from './../../../../core/services/clientauth.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive,Router } from '@angular/router';
import { links } from '../../../constants/navLinks';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  links = links;
  _auth=inject(ClientauthService);
  _router=inject(Router);
  logout(){
    this._auth.clear();
    this._router.navigate(['/landing']);
  }
}
