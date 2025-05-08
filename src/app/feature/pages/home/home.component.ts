import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { MostPopularComponent } from "../../components/most-popular/most-popular.component";
import { NearbyCarsComponent } from "../../components/nearby-cars/nearby-cars.component";
import { CarTypesComponent } from "../../components/car-types/car-types.component";
import { CarBrandsComponent } from "../../components/car-brands/car-brands.component";


@Component({
  selector: 'app-home',
  imports: [MostPopularComponent, NearbyCarsComponent , CarBrandsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
}
