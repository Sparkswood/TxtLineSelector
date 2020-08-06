import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSizeWarningComponent } from './dialog-size-warning.component';

describe('DialogSizeWarningComponent', () => {
  let component: DialogSizeWarningComponent;
  let fixture: ComponentFixture<DialogSizeWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSizeWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSizeWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
