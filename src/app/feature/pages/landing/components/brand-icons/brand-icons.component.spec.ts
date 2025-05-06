import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandIconsComponent } from './brand-icons.component';

describe('BrandIconsComponent', () => {
  let component: BrandIconsComponent;
  let fixture: ComponentFixture<BrandIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandIconsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
