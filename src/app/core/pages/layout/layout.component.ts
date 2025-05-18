import { Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/ui/sidebar/sidebar.component';
import { BottombarComponent } from '../../../shared/components/ui/bottombar/bottombar.component';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, BottombarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
