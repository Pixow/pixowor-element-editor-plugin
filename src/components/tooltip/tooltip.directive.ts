import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[tolltipTriggerFor]',
})
export class TooltipDirective {
  @HostListener('click')
  onClick() {
    this.show();
  }

  public show() {
    this.createTooltip();
  }

  public createTooltip() {
    // this.getElementPosition();
    // this.appendComponentToBody()
  }
}
