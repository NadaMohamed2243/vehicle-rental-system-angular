import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCompleteProfileComponent } from './agent-complete-profile.component';

describe('AgentCompleteProfileComponent', () => {
  let component: AgentCompleteProfileComponent;
  let fixture: ComponentFixture<AgentCompleteProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCompleteProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCompleteProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
