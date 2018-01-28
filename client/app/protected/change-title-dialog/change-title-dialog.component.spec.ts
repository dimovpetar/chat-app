import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTitleDialogComponent } from './change-title-dialog.component';

describe('ChangeTitleDialogComponent', () => {
  let component: ChangeTitleDialogComponent;
  let fixture: ComponentFixture<ChangeTitleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTitleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTitleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
