import { Injectable } from '@angular/core';
import { Client } from '../../core/interfaces/client';
import { Observable } from 'rxjs';  
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {}
  private apiURL = 'http://localhost:5000/api/auth';
  private baseUrl = 'http://localhost:5000/api/admin';



  // to get token add it to the headers
  private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('token') || '';
      return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
  }


  // Get all clients
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/clients`, {
      headers: this.getAuthHeaders()
    });
  }

  // Approve client
  approveClient(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/approve/client/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Reject client
  rejectClient(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/reject/client/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Ban client
  banClient(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/ban/client/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
  

  // Suspend client
  suspendClient(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/suspend/client/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }


  
  getClientProfile() {
  const token = localStorage.getItem('token');
  return this.http.get(`${this.apiURL}/client/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  }


 getDriverLicenseImageUrl(path: string): string {
    const formattedPath = path.replace(/\\/g, '/');  // Ensure it's a valid URL path
    return `http://localhost:5000/${formattedPath}`;
  }
}


