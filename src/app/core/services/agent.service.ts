import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Agent } from '../../core/interfaces/agent';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private apiURL = `${environment.apiUrl}/auth`;
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.baseUrl}/agents`, {
      headers: this.getAuthHeaders(),
    });
  }
  getAgentsByStatus(status: string): Observable<Agent[]> {
  return this.http.get<Agent[]>(`${this.baseUrl}/agents?status=${status}`, {
    headers: this.getAuthHeaders()
  });
}

  // getPendingAgents(): Observable<Agent[]> {
  //   return this.http.get<Agent[]>(`${this.baseUrl}/agents?status=pending`, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }

  // getApprovedAgents(): Observable<Agent[]> {
  //   return this.http.get<Agent[]>(`${this.baseUrl}/agents?status=approved`, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }

  // getRejectedAgents(): Observable<Agent[]> {
  //   return this.http.get<Agent[]>(`${this.apiURL}/agents?status=rejected`, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }

  // getBannedAgents(): Observable<Agent[]> {
  //   return this.http.get<Agent[]>(`${this.baseUrl}/agents?status=banned`, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }

  // getSuspendedAgents(): Observable<Agent[]> {
  //   return this.http.get<Agent[]>(`${this.baseUrl}/agents?status=suspended`, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }

  approveAgent(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/approve/agent/${id}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  rejectAgent(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/reject/agent/${id}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  banAgent(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/ban/agent/${id}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  suspendAgent(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/suspend/agent/${id}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
    // Unban agent
  unbanAgent(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/unban/agent/${id}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Unsuspend agent
  unsuspendAgent(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/unsuspend/agent/${id}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  getDocumentUrl(path: string): string {
    const formattedPath = path.replace(/\\/g, '/');
    return `${environment.baseUrl}/${formattedPath}`;
  }
}

