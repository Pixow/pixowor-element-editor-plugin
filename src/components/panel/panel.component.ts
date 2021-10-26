import { Component, OnInit, ContentChild, Input } from '@angular/core';

@Component({
  selector: 'panel-body',
  template: '<ng-content></ng-content>',
})
export class PanelBodyComponent {}

@Component({
  selector: 'panel-body-fixed',
  template: '<ng-content></ng-content>',
})
export class PanelBodyFixedComponent {}

@Component({
  selector: 'panel-header',
  template: '<ng-content></ng-content>',
})
export class PanelHeaderComponent {
  constructor() {}
}

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  @Input() title: string;
  @Input() isLoading = false;
  @Input() style: object;
  @Input() showClose = false;
  @ContentChild(PanelHeaderComponent, { static: false }) panelHeader;
  @ContentChild(PanelBodyComponent, { static: false }) panelBody;
  @ContentChild(PanelBodyFixedComponent, { static: false }) panelBodyFixed;
  constructor() {}

  ngOnInit() {}
}
