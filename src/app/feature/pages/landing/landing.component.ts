import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { HeroComponent } from '../../../shared/components/ui/hero/hero.component';
import { BrandIconsComponent } from './components/brand-icons/brand-icons.component';
import { FeaturedCarsComponent } from "../../components/featured-cars/featured-cars.component";
import { CarTypesComponent } from "../../components/car-types/car-types.component";
import { PromoCardsComponent } from "../../components/promo-cards/promo-cards.component";

@Component({
  selector: 'app-landing',
  imports: [NavbarComponent, HeroComponent, BrandIconsComponent, FeaturedCarsComponent, CarTypesComponent, PromoCardsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
