import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Preventivo } from './preventivo';

describe('Preventivo', () => {
  let component: Preventivo;
  let fixture: ComponentFixture<Preventivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Preventivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Preventivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
