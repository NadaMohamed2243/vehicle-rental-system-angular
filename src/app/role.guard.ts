// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { ClientauthService } from './core/services/clientauth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: ClientauthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getRole();

    if (!this.authService.isLoggedIn()) {
      return this.router.parseUrl('/login');
    }

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    }

    // Redirect to unauthorized page or home if role not allowed
    return this.router.parseUrl('/unauthorized');
  }
}
