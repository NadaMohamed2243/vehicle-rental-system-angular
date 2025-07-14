import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-promo-cards',
  imports: [RouterLink, RouterLinkActive,TranslateModule],
  templateUrl: './promo-cards.component.html',
  styleUrl: './promo-cards.component.css',
})
export class PromoCardsComponent {}
