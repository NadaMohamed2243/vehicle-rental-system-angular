//  Focused on HTTP requests only

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ClientRegisterData,
  AuthResponse,
  LoginData,
  RegisterAgentData
} from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthapiService {
  private baseUrl = 'http://localhost:5000/api/auth';
  constructor(private http: HttpClient) {}

  registerClient(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/client`, data);
  }

  registerAgent(data: RegisterAgentData, file: File): Observable<AuthResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    formData.append('ID_document', file);
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/agent`, formData);
  }

  login(credentials: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
  }

  forgotPassword(data: { email: string }) {
    return this.http.post(`${this.baseUrl}/forgot-password`, data );
  }

  resetPassword(token: string, password: string) {
    return this.http.post(`${this.baseUrl}/reset-password/${token}`, { password });
  }
completeGoogleProfile(data: FormData, token: string) {
  return this.http.post<{ token: string }>(
    'http://localhost:5000/api/auth/google/complete-profile',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}



}
