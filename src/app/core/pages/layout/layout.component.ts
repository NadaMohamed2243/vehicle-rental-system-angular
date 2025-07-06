import { Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/ui/sidebar/sidebar.component';
import { BottombarComponent } from '../../../shared/components/ui/bottombar/bottombar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, BottombarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

  constructor(private router: Router) {}

  get hideSidebar(): boolean {
    return this.router.url.includes('/search');
  }

}
