import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorliveComponent } from './doctorlive.component';

describe('DoctorliveComponent', () => {
  let component: DoctorliveComponent;
  let fixture: ComponentFixture<DoctorliveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorliveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorliveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
