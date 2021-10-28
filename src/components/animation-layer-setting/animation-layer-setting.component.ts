import { OnInit, Component } from '@angular/core';
import { AnimationLayer } from 'game-capsule';
import {
  ElementEditorService,
} from 'src/app/element-editor.service';

@Component({
  selector: 'animation-layer-setting',
  templateUrl: './animation-layer-setting.component.html',
  styleUrls: ['./animation-layer-setting.component.scss'],
})
export class AnimationLayerSettingComponent implements OnInit {
  public selectedLayer: AnimationLayer;
  constructor(private elementEditorService: ElementEditorService) {}

  ngOnInit() {
    this.elementEditorService.getSelectedLayer().subscribe((selectedLayer) => {
      if (selectedLayer instanceof AnimationLayer) {
        this.selectedLayer = selectedLayer;
      }
    });
  }

  updateOffset() {
      this.elementEditorService.elementEditorCanvas.updateOffsetLoc(
        this.selectedLayer.id
      );
  }

  get offsetX(): number {
    if (!this.selectedLayer) {
      return 0;
    }
    return this.selectedLayer.offsetLoc.x;
  }

  set offsetX(val: number) {
    if (this.selectedLayer) {
      this.selectedLayer.offsetLoc.x = val;
      this.updateOffset();
    }
  }
}
