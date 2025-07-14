import { ClientauthService } from './../../../../core/services/clientauth.service';
import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { links } from '../../../constants/navLinks';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule,TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  links = links;
  isExpanded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private languageService: LanguageService) {}

    currentLang$: any;

  ngOnInit() {
        this.currentLang$ = this.languageService.currentLang$;

    if (isPlatformBrowser(this.platformId)) {
      const savedState = localStorage.getItem('sidebarExpanded');
      this.isExpanded = savedState === 'true';
    }
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    console.log(this.isExpanded);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidebarExpanded', this.isExpanded.toString());
    }
  }
  _auth = inject(AuthService);
  _clientAuth = inject(ClientauthService);
  _router = inject(Router);
  logout() {
    this._clientAuth.clear();
    this._auth.removeToken();
    this._router.navigate(['/landing']);
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
