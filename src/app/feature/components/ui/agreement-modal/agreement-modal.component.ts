import {
  Component,
  Input,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url.pipe';
import { SignatureCanvasComponent } from '../../../../shared/components/ui/signature-canvas/signature-canvas.component';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-agreement-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    SafeUrlPipe,
    SignatureCanvasComponent,
  ],
  templateUrl: './agreement-modal.component.html',
  styleUrls: ['./agreement-modal.component.css'],
})
export class AgreementModalComponent {
  @Input() visible: boolean = false;
  @Input() agreement: any = null;
  @Input() signatureData: string = '';
  @Input() isSubmittingSignature: boolean = false;
  @Input() isDownloading: boolean = false;
  @Input() isProcessingPayment: boolean = false;
  @Input() totalPrice: number = 0;
  @Input() isBrowser: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() signatureChange = new EventEmitter<string>();
  @Output() signatureStart = new EventEmitter<void>();
  @Output() signatureEnd = new EventEmitter<void>();
  @Output() submitSignature = new EventEmitter<void>();
  @Output() skipSigning = new EventEmitter<void>();
  @Output() reviewDocument = new EventEmitter<void>();
  @Output() downloadAgreement = new EventEmitter<void>();
  @Output() proceedToPayment = new EventEmitter<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private languageService: LanguageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  onSignatureChange(signature: string) {
    this.signatureChange.emit(signature);
  }

  onSignatureStart() {
    this.signatureStart.emit();
  }

  onSignatureEnd() {
    this.signatureEnd.emit();
  }

  onSubmitSignature() {
    this.submitSignature.emit();
  }

  onSkipSigning() {
    this.skipSigning.emit();
  }

  onReviewDocument() {
    this.reviewDocument.emit();
  }

  onDownloadAgreement() {
    this.downloadAgreement.emit();
  }

  onProceedToPayment() {
    this.proceedToPayment.emit();
  }

  getCurrentLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  }

  getLanguageLabel(): string {
    const currentLang = this.getCurrentLanguage();
    return currentLang === 'ar' ? 'Arabic' : 'English';
  }
}
