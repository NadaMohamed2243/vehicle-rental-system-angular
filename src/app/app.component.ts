import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './shared/components/ui/card/card.component';
import { HeroComponent } from "./shared/components/ui/hero/hero.component";
import { NavbarComponent } from "./core/layout/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { BrandIconsComponent } from "./feature/pages/landing/components/brand-icons/brand-icons.component";
import { FooterComponent } from "./core/layout/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeroComponent, NavbarComponent, BrandIconsComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'VehicleRentalSystem';
}
