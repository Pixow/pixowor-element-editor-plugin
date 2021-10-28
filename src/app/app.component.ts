import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ElementNode } from 'game-capsule';
import { PixoworCore } from 'pixowor-core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AddAnimationComponent } from 'src/components/add-animation.component';
import { ElementSettingsComponent } from 'src/components/element-settings/element-settings.component';
import { AppService } from './app.service';
import { ElementEditorService } from './element-editor.service';

interface SortOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService],
})
export class AppComponent implements OnInit {
  loadI18nSuccess = false;

  element$: Observable<ElementNode>;

  constructor(
    private translate: TranslateService,
    public elementEditorService: ElementEditorService,
    private appService: AppService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    @Inject(PixoworCore) private pixoworCore: PixoworCore
  ) {
    const { lang } = this.pixoworCore.settings;
    this.translate.setDefaultLang(lang);
    this.translate.use(lang).subscribe((data) => {
      this.loadI18nSuccess = true;
    });

    this.element$ = this.elementEditorService.getElement();
  }

  ngOnInit(): void {
    // this.elementEditorService.element$.subscribe((element) => {
    //   console.log(
    //     '🚀 ~ file: app.component.ts ~ line 50 ~ AppComponent ~ this.elementEditorService.element$.subscribe ~ element',
    //     element
    //   );
    //   this.element = element;
    //   this.cd.detectChanges();
    // });
    this.elementEditorService.initElement();

    this.appService.getAsyncData();
  }

  open() {
    const ref = this.dialogService.open(AddAnimationComponent, {
      header: 'Add Animation',
      width: '20%',
      data: {
        name: '',
      },
    });
  }
}
