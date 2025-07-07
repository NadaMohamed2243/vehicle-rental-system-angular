import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ClientauthService } from '../../services/clientauth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  dropdownOpen = false;
  mobileMenuOpen = false;
  isLoggedIn = false;
  page_name='Home';
  role: string | null = null;
  _router = inject(Router)
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private authService: ClientauthService) {}
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getRole();
  }
  logout(): void {
    this.authService.clear();
    this.isLoggedIn = false;
    this.role = null;
    this._router.navigate(['/landing']);
  }
  goToDashboard(): void {
    if (this.role === 'admin') {
      this.page_name = 'Dashboard';
      this._router.navigate(['/dashboard']);
    } else if (this.role === 'agent') {
      this.page_name = 'Agent Dashboard';
      this._router.navigate(['/agent-dashboard']);
    } else {
      this.page_name = 'Home';
      this._router.navigate(['/home']);
    }
  }
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  navigateToSection(sectionId: string): void {
  this.closeDropdown();
  this.closeMobileMenu();

  if (isPlatformBrowser(this.platformId)) {


    // First navigate to home if we're not already there
    const currentRoute = this._router.url.split('?')[0];
    if (currentRoute !== '/') {
      this._router.navigate(['/']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      });


    } else {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }
}
}
