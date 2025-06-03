import { isPlatformBrowser } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Inject,
  PLATFORM_ID,
  OnInit,
  ViewChild,
  Input,
} from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-car-slider',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './car-slider.component.html',
  styleUrl: './car-slider.component.css',
})
export class CarSliderComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  @Input() carImages: string[] | undefined = [];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const swiperEl: any = document.querySelector('swiper-container');
      const swiperParams = {
        slidesPerView: 'auto',
        injectStyles: [
          `
          .swiper-button-next,
          .swiper-button-prev {
            color: #000;
          }
        `,
        ],
        spaceBetween: 0, // No gap between slides
        freeMode: true, // Enables free scrolling
        grabCursor: true, // Shows grab cursor
        mousewheel: true, // Allows mousewheel scrolling
        resistance: false, // Disables edge resistance
        scrollbar: {
          // Optional scrollbar
          draggable: true,
        },
      };
      Object.assign(swiperEl, swiperParams);
      swiperEl.initialize();

      setTimeout(() => {
        Object.assign(swiperEl.nativeElement, {
          slidesPerView: 1,
          spaceBetween: 10,
          pagination: { clickable: true },
        });
        swiperEl.nativeElement.initialize();
      }, 1000);
    }
  }
}
