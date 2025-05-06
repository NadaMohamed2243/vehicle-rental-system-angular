import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-icons',
  imports: [CommonModule],
  templateUrl: './brand-icons.component.html',
  styleUrls: ['./brand-icons.component.css']
})
export class BrandIconsComponent {
  icons: string[] = [];

  constructor() {
    this.icons = Array.from({ length: 11 }, (_, i) => `/icons/icon${i + 1}.png`);
  }

  trackByFn(index: number, icon: string): string {
    return icon;
  }
}
