import { isPlatformBrowser } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Inject,
  PLATFORM_ID,
  OnInit,
  ViewChild,
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
  carImages: string[] = [
    'images/8d682647-469f-4362-91d0-9298c5353e1a.webp',
    'images/2025KiaSportage-exterior-03.jpg',
    'images/f7af76f2-2025-kia-sportage-whichcar-australia-02.jpg',
  ];

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
