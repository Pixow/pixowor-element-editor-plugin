import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Capsule, ElementNode, LayerEnum } from 'game-capsule';

import { op_def } from 'pixelpai_proto';
import { TranslateService } from '@ngx-translate/core';
import { ElementEditorService } from 'src/app/element-editor.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Component({
  selector: 'element-settings',
  templateUrl: './element-settings.component.html',
  styleUrls: ['./element-settings.component.scss'],
})
export class ElementSettingsComponent implements OnInit, OnDestroy {
  @Input() element: ElementNode;

  layerOption: any[];

  constructor(
    private translate: TranslateService,
    private elementEditorService: ElementEditorService,
    private cd: ChangeDetectorRef
  ) {
  this.layerOption = [
    {
      value: LayerEnum.Floor,
      name: this.translate.instant('ELEMENTSETTINGS.FLOOR'),
    },
    {
      value: LayerEnum.Surface,
      name: this.translate.instant('ELEMENTSETTINGS.SURFACE'),
    },
    {
      value: LayerEnum.Hanging,
      name: this.translate.instant('ELEMENTSETTINGS.HANGING'),
    },
  ];
  }

  ngOnInit() {
    // this.element$ = this.elementEditorService.getElement();
  }

  ngOnDestroy() {}

  onChangeName() {}

  onChangeDescription() {}

  onChangeThumbnail(event) {}

  // get showLayer() {
  //   return this.element?.nodeType === op_def.NodeType.ElementNodeType;
  // }
}
