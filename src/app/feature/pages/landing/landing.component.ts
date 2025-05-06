import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { HeroComponent } from '../../../shared/components/ui/hero/hero.component';
import { BrandIconsComponent } from './components/brand-icons/brand-icons.component';

@Component({
  selector: 'app-landing',
  imports: [NavbarComponent,HeroComponent,BrandIconsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
