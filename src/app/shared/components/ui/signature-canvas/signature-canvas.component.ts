import {
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  Input,
  PLATFORM_ID,
  Inject,
  NgZone,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-signature-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="signature-container">
      <div class="signature-header mb-3 flex justify-between items-center">
        <label class="text-sm font-medium text-gray-700">
          {{ label || 'Please sign below:' }}
        </label>
        <div class="flex gap-2">
          <button
            type="button"
            class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            (click)="clear()"
            [disabled]="isEmpty"
          >
            <i class="pi pi-eraser mr-1"></i>
            Clear
          </button>
          <button
            type="button"
            class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            (click)="undo()"
            [disabled]="!canUndo"
          >
            <i class="pi pi-undo mr-1"></i>
            Undo
          </button>
        </div>
      </div>

      <div
        class="canvas-wrapper border-2 border-dashed border-gray-300 rounded-lg bg-white"
      >
        <canvas
          #signatureCanvas
          class="signature-canvas cursor-crosshair hover:border-blue-400 transition-colors block"
          [style.width.px]="canvasWidth"
          [style.height.px]="canvasHeight"
        >
          Your browser does not support canvas
        </canvas>
      </div>

      <div class="mt-3 text-center">
        <p class="text-xs text-gray-500">
          {{
            isEmpty
              ? 'Canvas is empty - Click and drag to sign'
              : 'Signature captured'
          }}
        </p>
        @if (showPreview && !isEmpty && previewUrl) {
        <div class="mt-2">
          <img
            [src]="previewUrl"
            alt="Signature preview"
            class="max-w-32 h-8 border rounded mx-auto object-contain bg-gray-50"
          />
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .signature-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
      }

      .canvas-wrapper {
        position: relative;
        display: inline-block;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .signature-canvas {
        touch-action: none;
        background: white;
      }

      .signature-canvas:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
    `,
  ],
})
export class SignatureCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('signatureCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() canvasWidth = 500;
  @Input() canvasHeight = 200;
  @Input() label = '';
  @Input() showPreview = true;
  @Input() penColor = '#000000';
  @Input() backgroundColor = '#ffffff';
  @Input() minWidth = 1;
  @Input() maxWidth = 3;

  @Output() signatureChange = new EventEmitter<string>();
  @Output() signatureStart = new EventEmitter<void>();
  @Output() signatureEnd = new EventEmitter<void>();

  private undoData: ImageData[] = [];
  private isInitialized = false;
  private isDrawing = false;
  private lastPoint: { x: number; y: number } = { x: 0, y: 0 };

  isEmpty = true;
  canUndo = false;
  previewUrl = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('=== Component AfterViewInit ===');
      // Delay initialization to ensure DOM is ready
      setTimeout(() => {
        this.initializeCanvas();
      }, 200);
    }
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  private initializeCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    console.log('=== Initializing Canvas ===');
    console.log('Canvas element:', canvas);
    console.log('Canvas dimensions:', this.canvasWidth, 'x', this.canvasHeight);

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = this.canvasWidth * dpr;
    canvas.height = this.canvasHeight * dpr;
    canvas.style.width = this.canvasWidth + 'px';
    canvas.style.height = this.canvasHeight + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Scale context for device pixel ratio
    ctx.scale(dpr, dpr);

    // Set drawing properties
    ctx.strokeStyle = this.penColor;
    ctx.lineWidth = this.maxWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;

    // Fill canvas with white background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.setupEventListeners(canvas);
    this.isInitialized = true;

    // Initial state
    this.ngZone.run(() => {
      this.updateSignature();
    });

    console.log('=== Canvas initialization complete ===');
  }

  private setupEventListeners(canvas: HTMLCanvasElement) {
    console.log('Setting up event listeners');

    // Mouse events
    canvas.addEventListener('mousedown', this.handleStart.bind(this), {
      passive: false,
    });
    canvas.addEventListener('mousemove', this.handleMove.bind(this), {
      passive: false,
    });
    canvas.addEventListener('mouseup', this.handleEnd.bind(this), {
      passive: false,
    });
    canvas.addEventListener('mouseleave', this.handleEnd.bind(this), {
      passive: false,
    });

    // Touch events
    canvas.addEventListener('touchstart', this.handleStart.bind(this), {
      passive: false,
    });
    canvas.addEventListener('touchmove', this.handleMove.bind(this), {
      passive: false,
    });
    canvas.addEventListener('touchend', this.handleEnd.bind(this), {
      passive: false,
    });
    canvas.addEventListener('touchcancel', this.handleEnd.bind(this), {
      passive: false,
    });

    console.log('Event listeners setup complete');
  }

  private removeEventListeners() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    canvas.removeEventListener('mousedown', this.handleStart.bind(this));
    canvas.removeEventListener('mousemove', this.handleMove.bind(this));
    canvas.removeEventListener('mouseup', this.handleEnd.bind(this));
    canvas.removeEventListener('mouseleave', this.handleEnd.bind(this));
    canvas.removeEventListener('touchstart', this.handleStart.bind(this));
    canvas.removeEventListener('touchmove', this.handleMove.bind(this));
    canvas.removeEventListener('touchend', this.handleEnd.bind(this));
    canvas.removeEventListener('touchcancel', this.handleEnd.bind(this));
  }

  private getEventPoint(event: MouseEvent | TouchEvent): {
    x: number;
    y: number;
  } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    let clientX: number, clientY: number;

    if (event instanceof TouchEvent) {
      if (event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if (event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else {
        return this.lastPoint;
      }
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  private handleStart(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    console.log('=== Drawing started ===');

    this.isDrawing = true;
    this.saveState();

    const point = this.getEventPoint(event);
    this.lastPoint = point;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);

    this.ngZone.run(() => {
      this.signatureStart.emit();
    });
  }

  private handleMove(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    event.preventDefault();

    const point = this.getEventPoint(event);
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // Draw line from last point to current point
    ctx.beginPath();
    ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    this.lastPoint = point;
  }

  private handleEnd(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    event.preventDefault();

    console.log('=== Drawing ended ===');
    this.isDrawing = false;

    this.ngZone.run(() => {
      this.updateSignature();
      this.signatureEnd.emit();
    });
  }

  private saveState() {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.undoData.push(imageData);

    if (this.undoData.length > 10) {
      this.undoData.shift();
    }
    this.canUndo = this.undoData.length > 0;
  }

  private updateSignature() {
    const dataURL = this.toDataURL();
    this.isEmpty = this.checkIfEmpty();
    this.previewUrl = dataURL;

    console.log('=== Signature updated ===');
    console.log('Empty:', this.isEmpty);
    console.log('DataURL length:', dataURL.length);
    console.log('DataURL sample:', dataURL.substring(0, 100));

    this.signatureChange.emit(dataURL);
  }

  clear() {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    console.log('=== Clearing signature ===');

    // Clear and refill with background
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.undoData = [];
    this.canUndo = false;
    this.updateSignature();
  }

  undo() {
    if (this.undoData.length > 0) {
      const canvas = this.canvasRef?.nativeElement;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const previousState = this.undoData.pop()!;
      ctx.putImageData(previousState, 0, 0);
      this.canUndo = this.undoData.length > 0;
      this.updateSignature();
    }
  }

  toDataURL(type = 'image/png', quality = 1): string {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return '';

    return canvas.toDataURL(type, quality);
  }

  toBlob(
    callback: (blob: Blob | null) => void,
    type = 'image/png',
    quality = 1
  ) {
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      canvas.toBlob(callback, type, quality);
    } else {
      callback(null);
    }
  }

  private checkIfEmpty(): boolean {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return true;

    // Create a blank canvas with white background for comparison
    const blankCanvas = document.createElement('canvas');
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;
    const blankCtx = blankCanvas.getContext('2d')!;
    blankCtx.fillStyle = this.backgroundColor;
    blankCtx.fillRect(0, 0, blankCanvas.width, blankCanvas.height);

    const canvasData = canvas.toDataURL();
    const blankData = blankCanvas.toDataURL();

    return canvasData === blankData;
  }
}
