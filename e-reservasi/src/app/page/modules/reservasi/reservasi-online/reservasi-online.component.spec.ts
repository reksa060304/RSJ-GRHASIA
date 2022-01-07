import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasiOnlineComponent } from './reservasi-online.component';

describe('ReservasiOnlineComponent', () => {
  let component: ReservasiOnlineComponent;
  let fixture: ComponentFixture<ReservasiOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservasiOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservasiOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
