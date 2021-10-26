import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'character-action-setting',
  templateUrl: './character-action-setting.component.html',
  styleUrls: ['./character-action-setting.component.scss'],
})
export class CharacterActionSettingComponent implements OnInit {
  @Input() usedBy: string;

  @Input() avatarCanvas: any;

  public curAction = 'idle';
  private curDirection = '';

  constructor() {}

  ngOnInit(): void {}

  public clearState() {
    this.curAction = 'idle';
    this.curDirection = '';
  }

  public setAction(event) {
    const value = event.target.value;
    this.curAction = value;
    this.updateCharacterAction();
  }
  public setDirection(event) {
    const value = event.target.value;
    this.curDirection = value;
    this.updateCharacterAction();
  }

  private updateCharacterAction() {
    const value: string = this.curAction + this.curDirection;
  }
}
