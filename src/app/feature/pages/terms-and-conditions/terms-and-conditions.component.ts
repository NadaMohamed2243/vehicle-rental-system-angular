import { Component } from '@angular/core';
import { NavbarComponent } from "../../../core/layout/navbar/navbar.component";
import { FooterComponent } from "../../../core/layout/footer/footer.component";

@Component({
  selector: 'app-terms-and-conditions',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {

}
