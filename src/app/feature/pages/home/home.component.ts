import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { Car } from '../../../core/interfaces/car';
import { CarsService } from '../../../core/services/cars.service';
import { ButtonModule } from 'primeng/button';
import { CardCarouselComponent } from "../../../shared/components/ui/card-carousel/card-carousel.component";
import { FeaturedCarsComponent } from "../../components/featured-cars/featured-cars.component";
import { MostPopularComponent } from "../../components/most-popular/most-popular.component";
import { NearbyCarsComponent } from "../../components/nearby-cars/nearby-cars.component";


@Component({
  selector: 'app-home',
  imports: [FeaturedCarsComponent, MostPopularComponent, NearbyCarsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
}
