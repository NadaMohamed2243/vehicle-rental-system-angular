import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './shared/components/ui/card/card.component';
import { HeroComponent } from "./shared/components/ui/hero/hero.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VehicleRentalSystem';
}
