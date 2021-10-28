import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import * as _ from 'lodash';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AnimationLayer,
  AnimationDataNode,
  IFrame,
  Helpers,
  IImage,
} from 'game-capsule';
import { combineLatest } from 'rxjs';
import {
  BLANK_BASE64,
  ElementEditorService,
} from 'src/app/element-editor.service';
import { MoveDir } from '../animation-layer-controller/animation-layer-controller.component';

@Component({
  selector: 'time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss'],
})
export class TimeLineComponent implements OnInit {
  selectedAnimationData: AnimationDataNode;
  animationLayer: AnimationLayer;
  animationFrames: IFrame[] = [];
  frameRate = 5;
  playing = false;
  selectedFrameIndex = -1;

  public frameRateOptions = [
    { display: 'Very Slow', value: 1 },
    { display: 'Slow', value: 2 },
    { display: 'Normal', value: 5 },
    { display: 'Fast', value: 10 },
    { display: 'Very Fast', value: 20 },
  ];

  constructor(
    private ref: ChangeDetectorRef,
    private elementEditorService: ElementEditorService
  ) {}

  ngOnInit() {
    combineLatest([
      this.elementEditorService.getSelectedAnimationData(),
      this.elementEditorService.getImages(),
      this.elementEditorService.getSelectedLayer(),
    ]).subscribe((data) => {
      const [selectedAnimationData, images, selectedLayer] = data;

      this.selectedAnimationData = selectedAnimationData;

      if (selectedLayer instanceof AnimationLayer) {
        this.animationLayer = selectedLayer;
        const { frameName: frameNames } = selectedLayer;
        const { frameRate, frameDuration: frameDurations } =
          this.elementEditorService.selectedAnimationData;

        this.frameRate = frameRate;

        this.animationFrames = frameNames.map((frameName, index) => {
          let frameImage;
          let duration = 1 / frameRate;
          let visible;

          if (frameName === 'blank') {
            frameImage = {
              key: 'blank',
              name: 'blank',
              url: BLANK_BASE64,
              isBlank: true,
            };
          } else {
            frameImage = images.find((item) => item.key === frameName);
          }

          if (frameDurations[index]) {
            const extraFrameDuration = frameDurations[index].toFixed(1);
            duration = Number(
              (duration + Number(extraFrameDuration)).toFixed(1)
            );
          }

          if (selectedLayer.frameVisible) {
            visible = selectedLayer.frameVisible[index];
          } else {
            visible = true;
          }

          return {
            visible,
            name: frameName,
            img: frameImage,
            duration,
          } as IFrame;
        });

        this.ref.detectChanges();
      }
    });

    this.elementEditorService.getSelectedImage().subscribe((image: IImage) => {
      if (image && this.selectedFrameIndex >= 0) {
        const selectedFrame = this.animationFrames[this.selectedFrameIndex];
        selectedFrame.name = image.key;
        selectedFrame.img = image;
        this.elementEditorService.updateFrame(selectedFrame, this.selectedFrameIndex);
      }
    });
  }

  public togglePlay() {
    this.playing = !this.playing;
    this.elementEditorService.togglePlay(this.playing);
  }

  public onToggleLoop(event) {
    this.elementEditorService.toggleLoop();
  }

  private getBlankFrame(): IFrame {
    return {
      name: 'blank',
      visible: true,
      duration: 1 / this.frameRate,
      img: {
        key: 'blank',
        name: 'blank',
        url: BLANK_BASE64,
        isBlank: true,
      },
    } as IFrame;
  }

  public onAddFrame() {
    if (this.selectedFrameIndex < 0) {
      return;
    }

    const blankFrame = this.getBlankFrame();

    this.elementEditorService.addFrame(blankFrame, this.selectedFrameIndex + 1);
  }

  public onDeleteFrame() {
    if (this.selectedFrameIndex < 0) {
      return;
    }
    this.elementEditorService.removeFrame(this.selectedFrameIndex);
    this.selectedFrameIndex = -1;
  }

  public onCopyFrame() {
    if (this.selectedFrameIndex < 0) {
      return;
    }
    const selectedFrame = this.animationFrames[this.selectedFrameIndex];
    this.elementEditorService.addFrame(
      selectedFrame,
      this.selectedFrameIndex + 1
    );
  }


  public onMoveFrame(dir: MoveDir) {
    if (this.selectedFrameIndex < 0) {
      return;
    }

    const delta = dir === MoveDir.LEFT ? -1 : 1;

    this.elementEditorService.moveFrame(
      this.selectedFrameIndex,
      this.selectedFrameIndex + delta
    );
    this.selectedFrameIndex += delta;
  }

  public onSelectFrame(frameIndex: number) {
    this.selectedFrameIndex = frameIndex;
    this.elementEditorService.showFrame(frameIndex);
  }

  public onDecreaseFrameDuration(frame: IFrame, frameIndex: number) {
    if ((frame.duration * 1000 - 0.1 * 1000) / 1000 < 0) {
      return;
    }
    frame.duration = (frame.duration * 1000 - 0.1 * 1000) / 1000;
    this.elementEditorService.updateFrame(frame, frameIndex);
  }

  public onIncreaseFrameDuration(frame, frameIndex: number) {
    frame.duration = (frame.duration * 1000 + 0.1 * 1000) / 1000;
    this.elementEditorService.updateFrame(frame, frameIndex);
  }

  public onChangeFrameRate(event) {
    const {value} = event.target;

    this.elementEditorService.updateFrameRate(value);

    for (const frame of this.animationFrames) {
      frame.duration = 1 / value;
    }
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.animationFrames,
      event.previousIndex,
      event.currentIndex
    );
    this.selectedFrameIndex = event.currentIndex;
  }
}
