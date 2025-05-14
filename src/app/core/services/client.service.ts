import { Injectable } from '@angular/core';
import { Client } from '../../core/interfaces/client';
import { Observable, of } from 'rxjs';    //use it until we use httpClient ,when deelivering data from the server

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private _clients: Client [] = [
    {
    id: 123,
    name: 'hagar',
    email: 'hagar@gmail.com',
    location: {
      city: 'cairo'
    },
    status: 'pending' 
    },{
    id: 456,
    name: 'esraa',
    email: 'esraa@gmail.com',
    location: {
      city: 'Alex'
    },
    status: 'approved' 
  },
  {
    id: 789,
    name: 'dina',
    email: 'dina@gmail.com',
    location: {
      city: 'cairo'
    },
    status: 'pending' 
    },{
    id: 741,
    name: 'nada',
    email: 'nada@gmail.com',
    location: {
      city: 'Alex'
    },
    status: 'approved' 
  },{
    id: 852,
    name: 'nouran',
    email: 'nouran@gmail.com',
    location: {
      city: 'Alex'
    },
    status: 'approved' 
  },{
    id: 963,
    name: 'lina',
    email: 'lina@gmail.com',
    location: {
      city: 'Alex'
    },
    status: 'pending' 
  },
]

// this function will return the list of clients
 getPendingClients(): Observable<Client[]> {
    return of(this._clients.filter(client => client.status === 'pending'));
  }

  getApprovedClients(): Observable<Client[]> {
    return of(this._clients.filter(client => client.status === 'approved'));
  }

  // this function will approve the client and change its status to approved
  approveClient(id: number): Observable<Client[]> {
    const index = this._clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this._clients[index].status = 'approved';
    }
    return of(this._clients);
  }

  // this function will remove the client from the list
  rejectClient(id: number): Observable<Client[]> {
    this._clients = this._clients.filter(c => c.id !== id);
    return of(this._clients);
  }

  constructor() { }
}
