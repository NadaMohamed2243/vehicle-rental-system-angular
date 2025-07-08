import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChooseMeshwarkComponent } from './why-choose-rently.component';

describe('WhyChooseMeshwarkComponent', () => {
  let component: WhyChooseMeshwarkComponent;
  let fixture: ComponentFixture<WhyChooseMeshwarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChooseMeshwarkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyChooseMeshwarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
