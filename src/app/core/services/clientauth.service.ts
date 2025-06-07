import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ClientauthService {
  private userRole: string | null = null;
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  setTokenAndRole(token: string) {
    this.token = token;
    const decoded = this.decodeToken(token);
    this.userRole = decoded ? decoded.role : null;
    console.log("Token and role set:", this.token, this.userRole);
    localStorage.setItem('token', token);
  }

  private loadToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      const decoded = this.decodeToken(token);
      this.userRole = decoded ? decoded.role : null;
      console.log("Loaded token and role from localStorage:", this.token, this.userRole);
    }
  }

  getRole(): string | null {
    return this.userRole;
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  clear() {
    this.token = null;
    this.userRole = null;
    localStorage.removeItem('token');
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}
