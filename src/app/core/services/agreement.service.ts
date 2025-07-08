import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Agreement {
  _id?: string; // MongoDB uses _id
  id?: string; // Some APIs use id
  bookingId: string;
  clientId: string;
  agentId: string;
  documentUrl: string;
  signedDocumentUrl?: string; // URL to the PDF with embedded signature
  status: string;
  signedAt?: string;
  signatureImageUrl?: string; // URL to the signature image
}

@Injectable({ providedIn: 'root' })
export class AgreementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/agreements';

  generateAgreement(
    bookingId: string
  ): Observable<{ message: string; agreement: Agreement }> {
    return this.http.post<{ message: string; agreement: Agreement }>(
      `${this.apiUrl}/generate/${bookingId}`,
      {}
    );
  }

  getAgreement(agreementId: string): Observable<Agreement> {
    return this.http.get<Agreement>(`${this.apiUrl}/${agreementId}`);
  }

  signAgreement(
    agreementId: string,
    signature: string
  ): Observable<{ message: string; agreement: Agreement }> {
    console.log('signn', signature);

    return this.http.put<{ message: string; agreement: Agreement }>(
      `${this.apiUrl}/sign/${agreementId}`,
      { signature }
    );
  }

  downloadAgreement(agreementId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${agreementId}`, {
      responseType: 'blob',
    });
  }

  // Method to preview the signed document (if available)
  previewSignedDocument(agreementId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/preview/${agreementId}`, {
      responseType: 'blob',
    });
  }
}
