import {
  Component,
  Input,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'small-cross',
  template: `
    <span class="close-icon" (click)="handleClick()">
      <svg data-icon="small-cross" width="16" height="16" viewBox="0 0 16 16">
        <desc>small-cross</desc>
        <path
          d="M9.41 8l2.29-2.29c.19-.18.3-.43.3-.71a1.003 1.003 0 00-1.71-.71L8 6.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42L6.59 8 4.3 10.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71L8 9.41l2.29 2.29c.18.19.43.3.71.3a1.003 1.003 0 00.71-1.71L9.41 8z"
          fill-rule="evenodd"
        ></path>
      </svg>
    </span>
  `,
  styles: [
    `
      .close-icon {
        cursor: pointer;
        margin-bottom: 5px;
      }
      .close-icon > svg {
        vertical-align: middle;
        fill: #fff;
        opacity: 0.5;
      }

      .close-icon:hover {
        svg {
          opacity: 1;
        }
      }
    `,
  ],
})
export class SmallCrossComponent {
  @Input() click = new EventEmitter();

  handleClick() {
    this.click.emit();
  }
}
