import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {
  AnimationDataNode,
  AnimationLayer,
  AnimationMountLayer,
  ElementNode,
} from 'game-capsule';
import { ElementEditorService } from 'src/app/element-editor.service';
import { moveArray } from 'src/utils';

interface LayerData {
  id: number;
  depth: number;
  layer: AnimationLayer | AnimationMountLayer;
}

export enum MoveDir {
  UP = 1,
  DOWN = -1,
  LEFT = 2,
  RIGHT = -2,
}

@Component({
  selector: 'animation-layer-controller',
  templateUrl: './animation-layer-controller.component.html',
  styleUrls: ['./animation-layer-controller.component.scss'],
})
export class AnimationLayerControllerComponent implements OnInit {
  @Input() element: ElementNode;
  public selectedLayer: AnimationLayer | AnimationMountLayer;
  public mixinLayers: Array<AnimationLayer | AnimationMountLayer> = [];

  constructor(private elementEditorService: ElementEditorService) {}

  ngOnInit() {
    this.elementEditorService
      .getSelectedAnimationData()
      .subscribe((animationData: AnimationDataNode) => {
        this.mixinLayers =
          this.elementEditorService.getMixinLayers(animationData);
      });

    this.elementEditorService.getSelectedLayer().subscribe((layer) => {
      if (layer) {
        this.selectedLayer = layer;
      }
    });
  }

  public isAnimationLayer(layer: AnimationLayer | AnimationMountLayer) {
    return layer instanceof AnimationLayer;
  }

  public showToolbar() {
    return false;
  }

  public onAddAnimationMountPoint() {
    this.elementEditorService.addAnimationMountPoint();
  }

  public onSelectLayer(layer: AnimationLayer | AnimationMountLayer) {
    this.elementEditorService.selectLayer(layer);
  }

  public onSelectAnimationMountPoint(index: number) {
    this.elementEditorService.selectAnimationMountPoint(index);
  }

  public isAnimationMountLayer() {
    return this.selectedLayer instanceof AnimationMountLayer;
  }

  public onAddAnimationLayer() {
    this.elementEditorService.addAnimationLayer();
  }

  public onAddAnimationMountLayer() {
    this.elementEditorService.addAnimationMountLayer();
  }

  public onDeleteAnimationMountPoint(index: number) {
    this.elementEditorService.deleteAnimationMountPoint(index);
  }

  public onMoveLayer(dir: MoveDir) {
    const oldIndex = this.mixinLayers.findIndex(
      (layer) => this.selectedLayer.id === layer.id
    );
    if (dir === MoveDir.UP) {
      this.mixinLayers = moveArray(this.mixinLayers, oldIndex, oldIndex - 1);
    } else {
      this.mixinLayers = moveArray(this.mixinLayers, oldIndex, oldIndex + 1);
    }

    this.elementEditorService.updateLayersDepth(this.mixinLayers);
  }

  public onDeleteLayer() {
    this.elementEditorService.deleteLayer();
  }

  public onToggleLayerVisible() {
    this.elementEditorService.toggleLayerVisible();
  }
}
