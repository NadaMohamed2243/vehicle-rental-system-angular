import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChooseRentlyComponent } from './why-choose-rently.component';

describe('WhyChooseRentlyComponent', () => {
  let component: WhyChooseRentlyComponent;
  let fixture: ComponentFixture<WhyChooseRentlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChooseRentlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyChooseRentlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
