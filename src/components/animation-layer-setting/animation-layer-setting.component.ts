import { OnInit, Component } from '@angular/core';
import { AnimationLayer } from 'game-capsule';

@Component({
  selector: 'animation-layer-setting',
  templateUrl: './animation-layer-setting.component.html',
  styleUrls: ['./animation-layer-setting.component.scss'],
})
export class AnimationLayerSettingComponent implements OnInit {
  public selectLayer: AnimationLayer;
  constructor() {}

  ngOnInit() {

  }

  updateOffset() {

  }

  get offsetX(): number {
    if (!this.selectLayer) {
      return 0;
    }
    return this.selectLayer.offsetLoc.x;
  }

  set offsetX(val: number) {
    if (this.selectLayer) {
      this.selectLayer.offsetLoc.x = val;
      this.updateOffset();
    }
  }
}
