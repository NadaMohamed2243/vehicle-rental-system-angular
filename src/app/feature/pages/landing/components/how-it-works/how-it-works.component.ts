import { Component } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  imports: [],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
  steps = [
    {
      number: '01',
      title: 'SELECT DATE',
      description: 'Lorem ipsum dolor sit amet, consectetur'
    },
    {
      number: '02',
      title: 'BOOK A CAR',
      description: 'Lorem ipsum dolor sit amet, consectetur'
    },
    {
      number: '03',
      title: 'PAYMENTS',
      description: 'Lorem ipsum dolor sit amet, consectetur'
    },
    {
      number: '04',
      title: 'ENJOY THE CAR',
      description: 'Lorem ipsum dolor sit amet, consectetur'
    }
  ];
}
