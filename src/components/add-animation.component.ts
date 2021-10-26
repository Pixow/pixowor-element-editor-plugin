import { Component, Input, EventEmitter } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'add-animation',
  template: `
    <div class="add-animation-content">
      <input
        pInputText
        type="text"
        placeholder="{{ 'ANIMATIONDIALOG.NAME' | translate }}"
        pattern="^[a-zA-Z][a-zA-Z0-9_]*$"
        [(ngModel)]="data.name"
      />
    </div>
    <div class="add-animation-footer">
      <button
        class="p-button-sm"
        pButton
        (click)="onClose()"
        label="{{ 'ANIMATIONDIALOG.CANCEL' | translate }}"
      ></button>
      <button
        class="p-button-sm"
        pButton
        (click)="onConfirm()"
        label="{{ 'ANIMATIONDIALOG.OK' | translate }}"
      ></button>
    </div>
  `,
  styles: [
    `
      .add-animation-content {
        margin-bottom: 10px;
      }

      .add-animation-content input {
        width: 100%;
      }

      .add-animation-footer {
        display: flex;
        justify-content: flex-end;
      }

      .add-animation-footer button {
        margin-left: 8px;
      }
  
    `
  ],
})
export class AddAnimationComponent {
  data: any;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
    this.data = config.data;
  }

  public onClose() {
    this.ref.close();
  }

  public onConfirm() {
    this.ref.close(this.data);
  }
}
