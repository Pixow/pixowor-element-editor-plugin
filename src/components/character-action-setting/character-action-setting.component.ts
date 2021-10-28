import { Component, Input, OnInit } from '@angular/core';
import { ElementEditorService } from 'src/app/element-editor.service';

@Component({
  selector: 'character-action-setting',
  templateUrl: './character-action-setting.component.html',
  styleUrls: ['./character-action-setting.component.scss'],
})
export class CharacterActionSettingComponent implements OnInit {
  public curAction = 'idle';
  public curDirection = '';

  constructor(private elementEditorService: ElementEditorService) {}

  ngOnInit(): void {}

  public setAction(event) {
    const { value } = event.target;
    this.elementEditorService.elementEditorCanvas.toggleMountPointAnimationPlay(
      `${value}${this.curDirection}`
    );
  }

  public setDirection(event) {
    const { value } = event.target;
    this.elementEditorService.elementEditorCanvas.toggleMountPointAnimationPlay(
      `${this.curAction}${value}`
    );
  }
}
