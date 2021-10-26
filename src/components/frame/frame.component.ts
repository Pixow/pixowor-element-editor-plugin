import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IFrame } from 'game-capsule';

@Component({
  selector: 'animation-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent implements OnInit {
  @Input() frame: IFrame;
  @Input() selected = false;
  @Output() onRemoveFrame: EventEmitter<any> = new EventEmitter<any>();
  @Output() decreateFrameDuration: EventEmitter<any> = new EventEmitter<any>();
  @Output() increaseFrameDuration: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  handleRemoveFrame() {
    this.onRemoveFrame.emit();
  }

  handleDecreaseFrameDuration() {
    this.decreateFrameDuration.emit();
  }

  handleIncreaseFrameDuration() {
    this.increaseFrameDuration.emit();
  }
}
