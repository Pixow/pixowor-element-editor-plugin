import { UrlResolver } from '@angular/compiler';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HumanoidSlot } from '@PixelPai/game-core';
import { Avatar } from 'pixow-api';
import { PixoworCore } from 'pixowor-core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AvatarPreviewComponent } from '../avatar-preview/avatar-preview.component';
const imageToBlob = require('image-to-blob');

export interface SlotConfig {
  slotName: string;
  name: string;
  limitImageWidth: number;
  limitImageHeight: number;
  top: number;
  left: number;
  imageBlob?: Blob;
}

export interface SlotAsset {
  slotName: string;
  imageBlob: Blob;
}

export enum AvatarDir {
  FRONT = 3,
  BACK = 1,
}

@Component({
  selector: 'avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
})
export class AvatarUploadComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() avatarNode;

  @ViewChild(AvatarPreviewComponent) avatarPreview: AvatarPreviewComponent;

  front = true;

  avatar: Avatar;

  readySubscription: Subscription = null;

  frontSlotConfigs: SlotConfig[] = [
    {
      slotName: 'head_face_3',
      name: 'Face',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 90,
    },
    {
      slotName: 'head_base_3',
      name: 'Base',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 253,
    },
    {
      slotName: 'head_mask_3',
      name: 'Mask',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 413,
    },
    {
      slotName: 'barm_cost_3',
      name: 'Right Arm',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 150,
      left: 136,
    },
    {
      slotName: 'body_cost_3',
      name: 'Body',
      limitImageWidth: 44,
      limitImageHeight: 36,
      top: 177,
      left: 254,
    },
    {
      slotName: 'body_cost_dres_3',
      name: 'Dress',
      limitImageWidth: 44,
      limitImageHeight: 36,
      top: 295,
      left: 254,
    },
    {
      slotName: 'farm_cost_3',
      name: 'Left Arm',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 150,
      left: 377,
    },
    {
      slotName: 'barm_weap_3',
      name: 'Right Arm Weapon',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 176,
      left: 19,
    },
    {
      slotName: 'barm_shld_3',
      name: 'Right Arm Handheld',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 286,
      left: 19,
    },
    {
      slotName: 'farm_weap_3',
      name: 'Left Arm Weapon',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 176,
      left: 495,
    },
    {
      slotName: 'farm_shld_3',
      name: 'Left Arm Handheld',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 286,
      left: 495,
    },
    {
      slotName: 'bleg_cost_3',
      name: 'Right Leg',
      limitImageWidth: 17,
      limitImageHeight: 25,
      top: 450,
      left: 186,
    },
    {
      slotName: 'fleg_cost_3',
      name: 'Left Leg',
      limitImageWidth: 17,
      limitImageHeight: 25,
      top: 450,
      left: 321,
    },
  ];

  backSlotConfigs: SlotConfig[] = [
    {
      slotName: 'head_base_1',
      name: 'Base',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 253,
    },
    {
      slotName: 'head_mask_1',
      name: 'Mask',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 413,
    },
    {
      slotName: 'farm_cost_1',
      name: 'Left Arm',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 150,
      left: 136,
    },
    {
      slotName: 'body_cost_1',
      name: 'Body',
      limitImageWidth: 44,
      limitImageHeight: 36,
      top: 177,
      left: 254,
    },
    {
      slotName: 'body_cost_dres_1',
      name: 'Dress',
      limitImageWidth: 44,
      limitImageHeight: 36,
      top: 295,
      left: 254,
    },
    {
      slotName: 'barm_cost_1',
      name: 'Right Arm',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 150,
      left: 377,
    },
    {
      slotName: 'farm_weap_1',
      name: 'Left Arm Weap',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 176,
      left: 19,
    },
    {
      slotName: 'farm_shld_1',
      name: 'Left Arm Handheld',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 286,
      left: 19,
    },
    {
      slotName: 'barm_weap_1',
      name: 'Right Arm Weap',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 176,
      left: 495,
    },
    {
      slotName: 'barm_shld_1',
      name: 'Right Arm Handheld',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 286,
      left: 495,
    },
    {
      slotName: 'fleg_cost_1',
      name: 'Left Leg',
      limitImageWidth: 17,
      limitImageHeight: 25,
      top: 450,
      left: 186,
    },
    {
      slotName: 'bleg_cost_1',
      name: 'Right Leg',
      limitImageWidth: 17,
      limitImageHeight: 25,
      top: 450,
      left: 321,
    },
  ];

  constructor(
    @Inject(PixoworCore) private pixoworCore: PixoworCore,
    public config: DynamicDialogConfig
  ) {
    const { avatar } = this.config.data;
    this.avatar = avatar;
  }

  ngOnInit(): void {
    this.loadAvatarAssets(AvatarDir.FRONT).then((items) => {
      console.log('Load avatar assets FRONT: ', items);
      for (const item of items) {
        const slotConfig = this.frontSlotConfigs.find(
          (config) => config.slotName === item.slotName
        );
        if (slotConfig) {
          slotConfig.imageBlob = item.imageBlob;
        }
      }
    });

    this.loadAvatarAssets(AvatarDir.BACK).then((items) => {
      console.log('Load avatar assets BACK: ', items);
      for (const item of items) {
        const slotConfig = this.backSlotConfigs.find(
          (config) => config.slotName === item.slotName
        );
        if (slotConfig) {
          slotConfig.imageBlob = item.imageBlob;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // 必须等待avatarPreview龙骨加载完成
    this.readySubscription = this.avatarPreview.ready$
      .asObservable()
      .subscribe((ready) => {
        if (ready) {
          const slots = this.avatar.parts.map((part) => {
            return {
              slot: part,
              sn: this.avatar._id,
            };
          });

          this.dressup(slots);
        }
      });
  }

  loadAvatarAssets(dir: AvatarDir): Promise<SlotAsset[]> {
    const urlResolver = new UrlResolver();
    const { WEB_RESOURCE_URI } = this.pixoworCore.settings;

    const tasks: Promise<any>[] = [];

    for (const part of this.avatar.parts) {
      let frontAssetUrl;
      if (this.avatar.version) {
        frontAssetUrl = urlResolver.resolve(
          WEB_RESOURCE_URI,
          `/avatar/part/${part}_${this.avatar._id}_${dir}_${this.avatar.version}.png`
        );
      } else {
        frontAssetUrl = urlResolver.resolve(
          WEB_RESOURCE_URI,
          `/avatar/part/${part}_${this.avatar._id}_${dir}.png`
        );
      }

      tasks.push(this.loadImageAdBlob(frontAssetUrl, `${part}_${dir}`));
    }

    return Promise.all(tasks);
  }

  loadImageAdBlob(assetUrl: string, slotName: string): Promise<SlotAsset> {
    return new Promise((resolve, reject) => {
      imageToBlob(assetUrl, (err, blob) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            slotName,
            imageBlob: blob,
          });
        }
      });
    });
  }

  turnAroundAvatarSlots(): void {
    this.front = !this.front;
  }

  dressup(slots: HumanoidSlot[]): void {
    this.avatarPreview.dressup(slots);
  }

  ngOnDestroy(): void {
    this.readySubscription.unsubscribe();
  }
}
