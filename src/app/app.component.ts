import {
  Component,
  ComponentRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HumanoidSlot } from '@PixelPai/game-core/release/types/src/structure/dragonbones';
import { MessageChannel as msgc } from 'electron-re';
import { PixoworCore } from 'pixowor-core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AvatarPreviewComponent } from 'src/components/avatar-preview/avatar-preview.component';
import { HumanoidAssetsUploadComponent } from 'src/components/humanoid-assets-upload/humanoid-assets-upload.component';
import { HumanoidDescriptionNode } from 'game-capsule';
import { AppService } from './app.service';

interface SortOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService]
})
export class AppComponent implements OnInit {
  loadLangSuccess = false;
  page = 1;
  pageSize = 25;
  keyword: string;
  total = 0;
  avatars = [];
  sortOptions: SortOption[] = [
    { name: 'Created Date(recent to past)', value: '-createdAt' },
    { name: 'Created Date(past to recent)', value: 'createdAt' },
  ];
  selectedSortOption: SortOption;

  first = 0;

  categories: MenuItem[];

  type: string; // avatar type

  @ViewChild(AvatarPreviewComponent) avatarPreview: AvatarPreviewComponent;

  constructor(
    private translate: TranslateService,
    private appService: AppService,
    private dialog: DialogService,
    @Inject(PixoworCore) private pixoworCore: PixoworCore
  ) {
    const { lang } = this.pixoworCore.settings;
    this.translate.setDefaultLang(lang);
    this.translate.use(lang).subscribe((data) => {
      this.loadLangSuccess = true;
    });
  }

  ngOnInit(): void {
    msgc.send('io-service', 'test');

    msgc.on('test_replay', (event, data) => {
      console.log('test reply data: ', data);
    });

    this.populate();

    this.appService.total$.subscribe((data) => {
      this.total = data;
    });

    this.appService.avatars$.subscribe((data) => {
      this.avatars = data;
    });

    this.categories = [
      {
        label: 'Head',
        icon: 'pi pi-pw pi-filter',
        items: [
          {
            label: 'Base',
            icon: 'pi pi-fw pi-tags',
            command: () => {
              this.filterByType('base');
            },
          },
          { label: 'Face', icon: 'pi pi-fw pi-tags' },
          { label: 'Mask', icon: 'pi pi-fw pi-tags' },
        ],
      },
      {
        label: 'Body',
        icon: 'pi pi-fw pi-filter',
        items: [
          { label: 'Right Arm', icon: 'pi pi-fw pi-tags' },
          { label: 'Body', icon: 'pi pi-fw pi-tags' },
          { label: 'Dress', icon: 'pi pi-fw pi-tags' },
          { label: 'Left Arm', icon: 'pi pi-fw pi-tags' },
        ],
      },
      {
        label: 'Handheld',
        icon: 'pi pi-fw pi-filter',
        items: [
          {
            label: 'Weapons',
            icon: 'pi pi-pi pi-tags',
          },
          {
            label: 'Opisthenar',
            icon: 'pi pi-pi pi-tags',
          },
        ],
      },
      {
        label: 'Lower Body',
        icon: 'pi pi-fw pi-filter',
        items: [
          {
            label: 'Right Leg',
            icon: 'pi pi-fw pi-tags',
          },
          {
            label: 'Left Leg',
            icon: 'pi pi-fw pi-tags',
          },
        ],
      },
    ];
  }

  populate(): void {
    const query = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.keyword && { keyword: this.keyword }),
      ...(this.selectedSortOption && {
        sorts: [this.selectedSortOption.value],
      }),
      ...(this.type && {
        type: this.type,
      }),
    };

    this.appService.listAvatarComponents(query);
  }

  search(): void {
    this.page = 1;
    this.first = 0;
    this.populate();
  }

  filterByType(value: string): void {
    this.type = value;

    this.populate();
  }

  loadPage(event): void {
    const { page, first } = event;
    this.first = first;
    this.page = page + 1;

    this.populate();
  }

  dressup(slots: HumanoidSlot[]): void {
    console.log(
      '🚀 ~ file: app.component.ts ~ line 170 ~ AppComponent ~ dressup ~ slots',
      slots
    );
    this.avatarPreview.dressup(slots);
  }

  public createAvatar(): void {

    const humanoidDescNode = new HumanoidDescriptionNode();

    this.dialog.open(HumanoidAssetsUploadComponent, {
      header: 'Create Humanoid Description',
      width: '70%',
      data: {
        humanoidDescNode,
      },
    });
  }
}
