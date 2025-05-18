import {
  ApplicationRef,
  Component,
  Input,
  input,
  NgZone,
  OnInit,
} from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Cars } from '../../../../core/interfaces/cars';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-card-carousel',
  imports: [Carousel, ButtonModule, CardComponent],
  templateUrl: './card-carousel.component.html',
  styleUrl: './card-carousel.component.css',
  host: { ngSkipHydration: 'true' },
})
export class CardCarouselComponent implements OnInit {
  // carDetails = input<Car[]>()
  // carDetails = input.required<Car[]>();
  // fromWho = input<any>()

  @Input({ required: true }) carDetails!: Cars[];
  @Input() fromWho?: any;
  ngOnInit(): void {
    // console.log("carDetails:", this.carDetails);
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








//solution of Hydration stability:
//If you're using SSR, the Hydration process can cause this issue,
//  you could turn off autoplayInterval by setting [autoplayInterval]="0"
// However if you need the autoplay feature to work,
// the solution would be to add the host: {ngSkipHydration: 'true'},
// in your component.
// OR even better; create a child component that will specifically handle the carousel
// then add the ngSkipHydration flag on it.
