import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-main-register',
  imports: [CommonModule,RouterLink, TranslateModule],
  templateUrl: './main-register.component.html',
  styleUrl: './main-register.component.css'
})
export class MainRegisterComponent  {

}

