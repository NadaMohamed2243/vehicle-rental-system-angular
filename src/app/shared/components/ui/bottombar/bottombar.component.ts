import { Component } from '@angular/core';
import { bottombarLinks } from '../../../constants/navLinks';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottombar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottombar.component.html',
  styleUrl: './bottombar.component.css',
})
export class BottombarComponent {
  links = bottombarLinks;
}
