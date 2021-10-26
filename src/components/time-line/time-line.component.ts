import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import * as _ from 'lodash';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AnimationLayer, AnimationDataNode, IFrame } from 'game-capsule';
import { combineLatest } from 'rxjs';
import {
  BLANK_BASE64,
  ElementEditorService,
} from 'src/app/element-editor.service';

@Component({
  selector: 'time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss'],
})
export class TimeLineComponent implements OnInit {
  selectedAnimationData: AnimationDataNode;
  animationLayer: AnimationLayer;
  animationFrames: IFrame[] = [];
  frameRate: number;
  playing = false;
  currentDisplayValue = 1;
  selectedFrameIndex = 0;


  public frameRateOptions = [
    { display: '很慢', frameRate: 1, value: 1 },
    { display: '慢', frameRate: 2, value: 2 },
    { display: '正常', frameRate: 5, value: 3 },
    { display: '快', frameRate: 10, value: 4 },
    { display: '很快', frameRate: 20, value: 5 },
  ];

  constructor(
    private ref: ChangeDetectorRef,
    private elementEditorService: ElementEditorService
  ) {}

  ngOnInit() {
    this.elementEditorService
      .getSelectedAnimationData()
      .subscribe((animationData: AnimationDataNode) => {
        if (animationData) {
          this.selectedAnimationData = animationData;
        }
      });

    this.elementEditorService
      .getSelectedAnimationLayer()
      .subscribe((aniLayer) => {
        if (aniLayer instanceof AnimationLayer) {
          this.animationLayer = aniLayer;
          const selectedAnimationData =
            this.elementEditorService.selectedAnimationData;
          const images = this.elementEditorService.images;

          this.animationFrames = aniLayer.frameName.map((key, index) => {
            let img;
            if (key === 'blank') {
              img = {
                frameIndex: index,
                name: 'blank',
                visible: true,
                duration: 1 / selectedAnimationData.frameRate,
                img: BLANK_BASE64,
              };
            } else {
              img = images.find((item) => item.key === key);
            }

            let duration = 1 / selectedAnimationData.frameRate;
            if (selectedAnimationData.frameDuration[index]) {
              const frameDuration =
                selectedAnimationData.frameDuration[index].toFixed(1);
              const durationTotal = duration + Number(frameDuration);
              duration = Number(durationTotal.toFixed(1));
            }

            return {
              frameIndex: index,
              visible: aniLayer.frameVisible
                ? aniLayer.frameVisible[index]
                : true,
              name: key,
              img,
              duration,
            } as IFrame;
          });
        }
      });
  }

  public onPlay() {
    this.playing = true;
  }

  public onStop() {
    this.playing = false;
  }

  public onToggleLoop(event) {
    this.elementEditorService.toggleLoop();
  }

  public onAddFrame() {}

  public onDeleteFrame() {}

  public onCopyFrame() {}

  public onMoveFrame(dir: number) {}

  public onSelectFrame(frame: IFrame) {
    this.ref.detectChanges();
  }

  public onDecreaseFrameDuration(frame: IFrame) {
    if ((frame.duration * 1000 - 0.1 * 1000) / 1000 < 0) {
      return;
    }
    frame.duration = (frame.duration * 1000 - 0.1 * 1000) / 1000;
  }

  public onIncreaseFrameDuration(frame) {
    frame.duration = (frame.duration * 1000 + 0.1 * 1000) / 1000;
  }

  public onChangeFrameIndex(event: CdkDragDrop<any[]>) {
    // moveItemInArray(this.selectedAnimationData.frameData, event.previousIndex, event.currentIndex);
  }

  public initAnimationRate(rate) {
    for (const display of this.frameRateOptions) {
      if (rate === display.frameRate) {
        this.currentDisplayValue = display.value;
      }
    }
  }
}
