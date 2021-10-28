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
import { MessageService } from 'primeng/api';

@Component({
  selector: 'element-editor-canvas',
  templateUrl: './element-editor-canvas.component.html',
  styleUrls: ['./element-editor-canvas.component.scss'],
  providers: [MessageService],
})
export class ElementEditorCanvasComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() element: ElementNode;

  @ViewChild('elementEditorContainer') elementEditorContainer: ElementRef;

  private elementEditorCanvas: ElementEditorCanvas;

  constructor(
    private elementEditorService: ElementEditorService,
    private pixoworCore: PixoworCore,
    private messageService: MessageService
  ) {}

  @HostListener('mouseout', ['$event'])
  mouseout(event: KeyboardEvent) {
    if ((event.srcElement as any).localName === 'input') {
      return;
    }
    document.body.style.cursor = 'default';
  }

  ngOnInit() {
    this.elementEditorService
      .getSelectedAnimationData()
      .subscribe((animationData) => {
        if (animationData && this.elementEditorCanvas) {
          this.elementEditorCanvas.updateAnimationLayer();
          this.elementEditorCanvas.updateMountLayer();
        }
      });
  }

  ngAfterViewInit() {
    this.initElementEditorCanvas();
  }

  initElementEditorCanvas() {
    const elementEditorContainer = this.elementEditorContainer.nativeElement;
    const { WEB_RESOURCE_URI, USER_DATA_PATH } = this.pixoworCore.settings;

    this.elementEditorCanvas = (this.elementEditorService.elementEditorCanvas =
      EditorCanvasManager.CreateCanvas(EditorCanvasType.Element, {
        width: elementEditorContainer.clientWidth,
        height: elementEditorContainer.clientHeight,
        parent: 'element-editor-canvas',
        node: this.elementEditorService.capsule.root.children[0],
        LOCAL_HOME_PATH: 'file://' + USER_DATA_PATH + '/packages/elements',
        osd: WEB_RESOURCE_URI + '/',
        game_created: undefined,
      }) as ElementEditorCanvas);

    this.elementEditorCanvas.on(
      ElementEditorEmitType.Resource_Loaded,
      (success, message) => {
        if (success) {
          this.elementEditorCanvas.deserializeDisplay().then((images) => {
            this.elementEditorService.setElementImages(images);
          });
          this.elementEditorCanvas.changeBrush(ElementEditorBrushType.Drag);
        } else {
          this.messageService.add({
            severity: 'error',
            detail: message,
          });
        }
      }
    );

    this.elementEditorCanvas.on(
      ElementEditorEmitType.Active_Animation_Layer,
      (id) => {
        if (id) {
          const layer =
            this.elementEditorService.selectedAnimationData.layerDict.get(id);
          this.elementEditorService.selectLayer(layer);
        }
      }
    );

    this.elementEditorCanvas.on(
      ElementEditorEmitType.Active_Mount_Layer,
      (pointIndex) => {
        if (pointIndex !== undefined) {
          const mountLayer =
            this.elementEditorService.selectedAnimationData.mountLayer;
          this.elementEditorService.selectLayer(mountLayer);
        }
      }
    );
  }

  ngOnDestroy() {}
}
