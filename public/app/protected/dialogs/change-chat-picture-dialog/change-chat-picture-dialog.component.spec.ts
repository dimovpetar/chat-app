import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeChatPictureDialogComponent } from './change-chat-picture-dialog.component';

describe('ChangeChatPictureDialogComponent', () => {
  let component: ChangeChatPictureDialogComponent;
  let fixture: ComponentFixture<ChangeChatPictureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeChatPictureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeChatPictureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
