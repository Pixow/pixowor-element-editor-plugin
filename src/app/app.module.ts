import * as path from 'path';
import { remote } from 'electron';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
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


import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HumanoidCardComponent } from 'src/components/humanoid-card/humanoid-card.component';
import { DateAgoPipe } from 'src/pipes/date-ago.pipe';
import { AvatarPreviewComponent } from 'src/components/avatar-preview/avatar-preview.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HumanoidAssetsUploadComponent } from 'src/components/humanoid-assets-upload/humanoid-assets-upload.component';
import { HumanoidSlotComponent } from 'src/components/humanoid-slot/humanoid-slot.component';
import { CommonModule } from '@angular/common';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

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
    HumanoidCardComponent,
    DateAgoPipe,
    AvatarPreviewComponent,
    HumanoidAssetsUploadComponent,
    HumanoidSlotComponent,
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
    { provide: PixoworCore, useFactory: initPixoworCore },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
