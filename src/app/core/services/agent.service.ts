import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Agent } from '../../core/interfaces/agent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/agents`, {
      headers: this.getAuthHeaders()
    });
  }

  getPendingAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/agents?status=pending`, {
      headers: this.getAuthHeaders()
    });
  }

  getApprovedAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/agents?status=approved`, {
      headers: this.getAuthHeaders()
    });
  }

  getRejectedAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/agents?status=rejected`, {
      headers: this.getAuthHeaders()
    });
  }

  getBannedAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/agents?status=banned`, {
      headers: this.getAuthHeaders()
    });
  }

  getSuspendedAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/agents?status=suspended`, {
      headers: this.getAuthHeaders()
    });
  }


  approveAgent(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/approve/agent/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  rejectAgent(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reject/agent/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  banAgent(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/ban/agent/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  suspendAgent(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/suspend/agent/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }



  getDocumentUrl(path: string): string {
    const formattedPath = path.replace(/\\/g, '/');
    return `http://localhost:5000/${formattedPath}`;
  }
}
