import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AnimationsNode, AnimationDataNode, ElementNode } from 'game-capsule';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ElementEditorService } from 'src/app/element-editor.service';
import { AddAnimationComponent } from '../add-animation.component';
import { SmallCrossComponent } from '../small-cross.component';

@Component({
  selector: 'animation-list',
  templateUrl: './animation-list.component.html',
  styleUrls: ['./animation-list.component.scss'],
  providers: [DialogService, MessageService],
})
export class AnimationListComponent implements OnInit {
  @Input() element: ElementNode;
  public selectedAnimationData: AnimationDataNode;
  public isEditor: false;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private elementEditorService: ElementEditorService
  ) {}

  ngOnInit() {
    // this.element$ = this.elementEditorService.getElement();

    this.elementEditorService
      .getSelectedAnimationData()
      .subscribe((aniData) => {
        this.selectedAnimationData = aniData;
      });
  }

  onOpenAddAnimationDataDialog() {
    const ref = this.dialogService.open(AddAnimationComponent, {
      header: 'Add Animation',
      width: '20%',
      data: {
        name: '',
      },
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.elementEditorService.addAnimationData(result.name);
      }
    });
  }

  isAnimationDataSelected(animationData: AnimationDataNode) {
    return animationData.name === this.selectedAnimationData.name;
  }

  onSelectAnimationData(animationData: AnimationDataNode) {
    this.elementEditorService.updateSelectedAnimationData(animationData);
  }

  onRemoveAnimationData(index: number) {
    if (this.elementEditorService.element.animations.animationData.length > 1) {
      this.elementEditorService.removeAnimationData(index);
    } else {
      this.messageService.add({
        severity: 'warn',
        detail: '至少应保留一个动画',
      });
    }
  }

  setDefaultAnimationData(animationData) {
    this.elementEditorService.setDefaultAnimationData(animationData);
  }

  modifyAnimationName(index) {}
}
