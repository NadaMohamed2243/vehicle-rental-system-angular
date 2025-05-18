import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { sidebarLinks } from '../../../constants/navLinks';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  links = sidebarLinks;
}
