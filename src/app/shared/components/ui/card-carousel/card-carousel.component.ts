import { ApplicationRef, Component, inject, Input, input, NgZone, OnInit } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CarsService } from '../../../../core/services/cars.service';
import { Car } from '../../../../core/interfaces/car';
import { CardComponent } from "../card/card.component";
import { first } from 'rxjs';

@Component({
  selector: 'app-card-carousel',
  imports: [Carousel, ButtonModule, CardComponent],
  templateUrl: './card-carousel.component.html',
  styleUrl: './card-carousel.component.css',
})
export class CardCarouselComponent implements OnInit{
  // carDetails = input<Car[]>()
  // carDetails = input.required<Car[]>();
  // fromWho = input<any>()

  @Input({ required: true }) carDetails!: Car[];
  @Input() fromWho?: any;
  ngOnInit(): void {
    console.log("carDetails:", this.carDetails);
  }



  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
