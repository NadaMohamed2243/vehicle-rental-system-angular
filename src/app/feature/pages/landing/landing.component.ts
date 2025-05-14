import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { HeroComponent } from '../../../shared/components/ui/hero/hero.component';
import { BrandIconsComponent } from './components/brand-icons/brand-icons.component';
import { HowItWorksComponent } from "./components/how-it-works/how-it-works.component";
import { WhyChooseRentlyComponent } from './components/why-choose-rently/why-choose-rently.component';

@Component({
  selector: 'app-landing',
  imports: [NavbarComponent, HeroComponent, BrandIconsComponent, HowItWorksComponent , WhyChooseRentlyComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
