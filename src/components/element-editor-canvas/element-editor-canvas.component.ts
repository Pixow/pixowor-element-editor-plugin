import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  NgZone,
  HostListener,
  Input,
} from '@angular/core';

import {
  EditorCanvasManager,
  EditorCanvasType,
  ElementEditorEmitType,
  ElementEditorBrushType,
  ElementEditorCanvas,
} from '@PixelPai/game-core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ElementNode } from 'game-capsule';
import { ElementEditorService } from 'src/app/element-editor.service';
import { PixoworCore } from 'pixowor-core';

@Component({
  selector: 'element-editor-canvas',
  templateUrl: './element-editor-canvas.component.html',
  styleUrls: ['./element-editor-canvas.component.scss'],
})
export class ElementEditorCanvasComponent implements AfterViewInit, OnDestroy {
  @Input() element: ElementNode;

  @ViewChild('elementEditorCanvas') elementEditorCanvas: ElementRef;

  constructor(
    private elementEditorService: ElementEditorService,
    private pixoworCore: PixoworCore
  ) {}

  @HostListener('mouseout', ['$event'])
  mouseout(event: KeyboardEvent) {
    if ((event.srcElement as any).localName === 'input') {
      return;
    }
    document.body.style.cursor = 'default';
  }

  ngAfterViewInit() {
    this.initElementEditorCanvas();
  }

  initElementEditorCanvas() {
    const canvas = this.elementEditorCanvas.nativeElement;
    const { WEB_RESOURCE_URI, USER_DATA_PATH } = this.pixoworCore.settings;

    const elementEditorCanvas = this.elementEditorService.elementEditorCanvas = EditorCanvasManager.CreateCanvas(
      EditorCanvasType.Element,
      {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        parent: 'element-editor-canvas',
        node: this.element,
        LOCAL_HOME_PATH: 'file://' + USER_DATA_PATH,
        osd: WEB_RESOURCE_URI,
        game_created: undefined,
      }
    ) as ElementEditorCanvas;

    elementEditorCanvas.on(
      ElementEditorEmitType.Resource_Loaded,
      (success, message) => {
        if (success) {
          elementEditorCanvas.deserializeDisplay().then((images) => {
            this.elementEditorService.setElementImages(images);
          });
          elementEditorCanvas.changeBrush(ElementEditorBrushType.Drag);
        }
      }
    );

    elementEditorCanvas.on(
      ElementEditorEmitType.Active_Animation_Layer,
      (id) => {
        if (id) {
          // const layer = this.elementEditorService.animationData.layerDict.get(id);
          // this.elementEditorService.selectLayer(layer, true);
        }
      }
    );

    elementEditorCanvas.on(
      ElementEditorEmitType.Active_Mount_Layer,
      (pointIndex) => {
        if (pointIndex !== undefined) {
          // const mountLayer = this.elementEditorService.animationData.mountLayer;
          // this.elementEditorService.selectLayer(mountLayer, true);
        }
      }
    );
  }

  ngOnDestroy() {}
}
