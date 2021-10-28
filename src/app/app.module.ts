import * as path from 'path';
import { remote } from 'electron';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import storage from 'electron-json-storage';
import { Settings, PixoworCore } from 'pixowor-core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SliderModule } from 'primeng/slider';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { ElementSettingsComponent } from 'src/components/element-settings/element-settings.component';
import { PanelBodyComponent, PanelComponent } from 'src/components/panel/panel.component';
import { AnimationLayerControllerComponent } from 'src/components/animation-layer-controller/animation-layer-controller.component';
import { AnimationLayerSettingComponent } from 'src/components/animation-layer-setting/animation-layer-setting.component';
import { AnimationListComponent } from 'src/components/animation-list/animation-list.component';
import { AssetsListComponent } from 'src/components/assets-list/assets-list.component';
import { CharacterActionSettingComponent } from 'src/components/character-action-setting/character-action-setting.component';
import { ElementAttributesComponent } from 'src/components/element-attributes/element-attributes.component';
import { ElementEditorCanvasComponent } from 'src/components/element-editor-canvas/element-editor-canvas.component';
import { TimeLineComponent } from 'src/components/time-line/time-line.component';
import { FrameComponent } from 'src/components/frame/frame.component';
import { ElementEditorService } from './element-editor.service';
import { SmallCrossComponent } from 'src/components/small-cross.component';
import { AddAnimationComponent } from 'src/components/add-animation.component';

function initPixoworCore(): PixoworCore {
  storage.setDataPath(path.join(remote.app.getPath('userData'), 'runtime'));
  const settings = storage.getSync('settings');
  return new PixoworCore(settings as Settings);
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    PanelBodyComponent,
    ElementSettingsComponent,
    AnimationLayerControllerComponent,
    AnimationLayerSettingComponent,
    AnimationListComponent,
    AssetsListComponent,
    CharacterActionSettingComponent,
    ElementAttributesComponent,
    ElementEditorCanvasComponent,
    TimeLineComponent,
    FrameComponent,
    SmallCrossComponent,
    AddAnimationComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    PaginatorModule,
    ButtonModule,
    DropdownModule,
    HttpClientModule,
    DynamicDialogModule,
    FileUploadModule,
    PanelMenuModule,
    InputTextModule,
    ToastModule,
    TooltipModule,
    SliderModule,
    DragDropModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    NgxTippyModule,
  ],
  providers: [
    AppService,
    ElementEditorService,
    { provide: PixoworCore, useFactory: initPixoworCore },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddAnimationComponent]
})
export class AppModule {}
