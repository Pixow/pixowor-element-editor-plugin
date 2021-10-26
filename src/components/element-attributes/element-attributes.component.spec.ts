import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementAttributesComponent } from './element-attributes.component';

describe('ElementAttributesComponent', () => {
  let component: ElementAttributesComponent;
  let fixture: ComponentFixture<ElementAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
