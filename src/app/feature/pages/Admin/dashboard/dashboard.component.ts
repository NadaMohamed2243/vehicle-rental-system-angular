import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
// import { TopBarComponent } from '../../top-bar/top-bar.component';
import { UserHeaderComponent } from '../../user-header/user-header.component';


@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet,CommonModule,SidebarComponent,UserHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
