import { Injectable } from '@angular/core';
import { Agent } from '../../core/interfaces/agent';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private _agents: Agent[] = [
    {
      _id: '1',
      user_id: 'u1',
      company_name: 'Rently Cairo',
      phone_number: '01012345678',
      location: 'Cairo',
      ID_document: 'uploads/id_documents/agent1.jpg',
      verification_status: 'pending',
      lat: 30.0444,
      lng: 31.2357,
      opening_hours: '9AM - 5PM',
      permissions: ['view', 'edit'],
    },
    {
      _id: '2',
      user_id: 'u2',
      company_name: 'Rently Alex',
      phone_number: '01087654321',
      location: 'Alex',
      ID_document: 'uploads/id_documents/agent2.jpg',
      verification_status: 'approved',
      lat: 31.2001,
      lng: 29.9187,
      opening_hours: '10AM - 6PM',
      permissions: ['view'],
    },
    {
      _id: '3',
      user_id: 'u3',
      company_name: 'Rently Mansoura',
      phone_number: '01123456789',
      location: 'Mansoura',
      ID_document: 'uploads/id_documents/agent3.jpg',
      verification_status: 'pending',
      lat: 31.0364,
      lng: 31.3807,
      opening_hours: '8AM - 4PM',
      permissions: ['view', 'delete'],
    }
  ];

  getPendingAgents(): Observable<Agent[]> {
    return of(this._agents.filter(agent => agent.verification_status === 'pending'));
  }

  getApprovedAgents(): Observable<Agent[]> {
    return of(this._agents.filter(agent => agent.verification_status === 'approved'));
  }

  approveAgent(id: string): Observable<Agent[]> {
    const index = this._agents.findIndex(c => c._id === id);
    if (index !== -1) {
      this._agents[index].verification_status = 'approved';
    }
    return of(this._agents);
  }

  rejectAgent(id: string): Observable<Agent[]> {
    this._agents = this._agents.filter(c => c._id !== id);
    return of(this._agents);
  }

  constructor() { }
}
