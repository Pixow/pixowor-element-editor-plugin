import { UrlResolver } from '@angular/compiler';
import {
  AfterViewInit,
  ChangeDetectorRef,
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
import * as fs from 'fs';
import * as path from 'path';
import { HumanoidDescriptionNode } from 'game-capsule';
import { Avatar } from 'pixow-api';
import { PixoworCore, UploadFileConfig } from 'pixowor-core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AvatarPreviewComponent } from '../avatar-preview/avatar-preview.component';
import { MessageService } from 'primeng/api';
const imageToBlob = require('image-to-blob');
const urlResolve = require('url-resolve-browser');

export interface SlotConfig {
  front: boolean;
  slotName: string;
  name: string;
  version: string;
  limitImageWidth: number;
  limitImageHeight: number;
  top: number;
  left: number;
  imageBlob?: Blob;
  emptyOverride?: boolean;
  removeBase?: boolean;
}

export enum AvatarDir {
  FRONT = 3,
  BACK = 1,
}

const SlotConfigs: SlotConfig[] = [
  {
    front: true,
    slotName: 'head_face_3',
    name: 'Face',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 90,
    emptyOverride: undefined,
  },
  {
    front: true,
    slotName: 'head_base_3',
    name: 'Base',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 253,
    emptyOverride: undefined,
  },
  {
    front: true,
    slotName: 'head_mask_3',
    name: 'Mask',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 413,
    emptyOverride: undefined,
  },
  {
    front: true,
    slotName: 'barm_cost_3',
    name: 'Right Arm',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 150,
    left: 136,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: true,
    slotName: 'body_cost_3',
    name: 'Body',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 177,
    left: 254,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: true,
    slotName: 'body_cost_dres_3',
    name: 'Dress',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 295,
    left: 254,
    emptyOverride: undefined,
  },
  {
    front: true,
    slotName: 'farm_cost_3',
    name: 'Left Arm',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 150,
    left: 377,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: true,
    slotName: 'barm_weap_3',
    name: 'Right Arm Weapon',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 176,
    left: 19,
    emptyOverride: undefined,
  },
  {
    front: true,
    slotName: 'barm_shld_3',
    name: 'Right Arm Handheld',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 286,
    left: 19,
    emptyOverride: undefined,
  },
  {
    front: true,
    slotName: 'farm_weap_3',
    name: 'Left Arm Weapon',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 176,
    left: 495,
    emptyOverride: undefined,
  },
  {
    front: true,
    slotName: 'farm_shld_3',
    name: 'Left Arm Handheld',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 286,
    left: 495,
    emptyOverride: undefined,
  },
  {
    front: true,
    slotName: 'bleg_cost_3',
    name: 'Right Leg',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 186,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: true,
    slotName: 'fleg_cost_3',
    name: 'Left Leg',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 321,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: false,
    slotName: 'head_base_1',
    name: 'Base',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 253,
    emptyOverride: undefined,
  },
  {
    front: false,
    slotName: 'head_mask_1',
    name: 'Mask',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 413,
    emptyOverride: undefined,
  },
  {
    front: false,
    slotName: 'farm_cost_1',
    name: 'Left Arm',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 150,
    left: 136,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: false,
    slotName: 'body_cost_1',
    name: 'Body',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 177,
    left: 254,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: false,
    slotName: 'body_cost_dres_1',
    name: 'Dress',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 295,
    left: 254,
    emptyOverride: undefined,
  },
  {
    front: false,
    slotName: 'barm_cost_1',
    name: 'Right Arm',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 150,
    left: 377,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: false,
    slotName: 'farm_weap_1',
    name: 'Left Arm Weap',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 176,
    left: 19,
    emptyOverride: undefined,
  },
  {
    front: false,
    slotName: 'farm_shld_1',
    name: 'Left Arm Handheld',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 286,
    left: 19,
    emptyOverride: undefined,
  },
  {
    front: false,
    slotName: 'barm_weap_1',
    name: 'Right Arm Weap',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 176,
    left: 495,
    emptyOverride: undefined,
  },
  {
    front: false,
    slotName: 'barm_shld_1',
    name: 'Right Arm Handheld',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 286,
    left: 495,
    emptyOverride: undefined,
  },
  {
    front: false,
    slotName: 'fleg_cost_1',
    name: 'Left Leg',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 186,
    emptyOverride: undefined,
    removeBase: undefined,
  },
  {
    front: false,
    slotName: 'bleg_cost_1',
    name: 'Right Leg',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 321,
    emptyOverride: undefined,
    removeBase: undefined,
  },
];

@Component({
  selector: 'humanoid-assets-upload',
  templateUrl: './humanoid-assets-upload.component.html',
  styleUrls: ['./humanoid-assets-upload.component.scss'],
  providers: [MessageService],
})
export class HumanoidAssetsUploadComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(AvatarPreviewComponent) avatarPreview: AvatarPreviewComponent;
  @ViewChild('myTooltip', { static: false }) myTooltip;

  isFront = true;

  humanoidDescNode: HumanoidDescriptionNode;

  readySubscription: Subscription = null;

  slotConfigs: SlotConfig[];

  thumbnailUploadFileConfig: UploadFileConfig;

  public get frontSlotConfigs(): SlotConfig[] {
    return this.slotConfigs.filter((config) => config.front);
  }

  public get backSlotConfigs(): SlotConfig[] {
    return this.slotConfigs.filter((config) => !config.front);
  }

  constructor(
    @Inject(PixoworCore) private pixoworCore: PixoworCore,
    public config: DynamicDialogConfig,
    private messageService: MessageService,
    public cd: ChangeDetectorRef
  ) {
    const { humanoidDescNode } = this.config.data;
    this.humanoidDescNode = humanoidDescNode;
  }

  private mergeHumanoidDescNodeSlotsWithSlotConfigs(
    slotConfigs: SlotConfig[]
  ): SlotConfig[] {
    for (const config of slotConfigs) {
      const slot = this.humanoidDescNode.slots.find(
        (item) => item.slot === config.slotName
      );
      if (slot) {
        config.version = slot.version;
      }
    }

    return slotConfigs;
  }

  async ngOnInit() {
    this.loadThumbnail();
    await this.initSlotConfigs();

    this.cd.markForCheck();
  }

  ngAfterViewInit(): void {
    // 必须等待avatarPreview龙骨加载完成
    this.readySubscription = this.avatarPreview.ready$
      .asObservable()
      .subscribe((ready) => {
        if (ready) {
          this.previewHumanoidSlots();
        }
      });
  }

  private loadThumbnail() {
    const key = `avatar/${this.humanoidDescNode.sn}/${this.humanoidDescNode.version}/thumbnail.png`;
    const humanoidThumbnailUrl = urlResolve(
      this.pixoworCore.settings.WEB_RESOURCE_URI,
      key
    );

    imageToBlob(humanoidThumbnailUrl, (err, blob) => {
      if (err) {
        console.error(err);

        this.thumbnailUploadFileConfig = {
          key,
          file: null,
        };
      } else {
        this.thumbnailUploadFileConfig = {
          key,
          file: new File([blob], key),
        };
      }
    });
  }

  private initSlotConfigs(): Promise<any> {
    // Merge humanoidDescNode slots with slotConfigs
    this.slotConfigs =
      this.mergeHumanoidDescNodeSlotsWithSlotConfigs(SlotConfigs);

    const tasks: Promise<any>[] = [];

    for (const slot of this.humanoidDescNode.slots) {
      const slotConfig = this.slotConfigs.find(
        (config) => config.slotName === slot.slot
      );

      const slotAssetKey = `avatar/${this.humanoidDescNode.sn}/${slotConfig.version}/${slotConfig.slotName}.png`;

      const slotAssetUrl = urlResolve(
        this.pixoworCore.settings.WEB_RESOURCE_URI,
        slotAssetKey
      );

      tasks.push(this.loadSlotAsset(slotAssetUrl, slotConfig));
    }

    return Promise.all(tasks);
  }

  private loadSlotAsset(url: string, config: SlotConfig): Promise<SlotConfig> {
    return new Promise((resolve, reject) => {
      imageToBlob(url, (err, blob) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          config.imageBlob = blob;
          resolve(config);
        }
      });
    });
  }

  public previewHumanoidSlots() {
    const humanoidSlots: HumanoidSlot[] = this.humanoidDescNode.slots.map(
      (slot) => {
        return {
          slot: slot.slot,
          version: slot.version,
          sn: slot.sn,
          emptyOverride: slot.emptyOverride,
          removeBase: slot.removeBase,
        };
      }
    );

    this.dressup(humanoidSlots);
  }

  public handleThumbnailSelect(event) {
    this.thumbnailUploadFileConfig = event;
  }

  public handleThumbnailRemove() {
    this.thumbnailUploadFileConfig.file = null;
  }

  public turnAroundHumanoidSlots(): void {
    this.isFront = !this.isFront;
  }

  public dressup(slots: HumanoidSlot[]): void {
    this.avatarPreview.dressup(slots);
  }

  private blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  public handleSlotAssetSelect(event): void {
    const { slotName, imageBlob } = event;

    const slotConfig = this.slotConfigs.find(
      (item) => item.slotName === slotName
    );
    slotConfig.imageBlob = imageBlob;

    // preview avatar with slot
    this.blobToBase64(imageBlob).then((imgData) => {
      const humanoidSlot: HumanoidSlot = {
        slot: slotConfig.slotName,
        version: (+slotConfig.version + 1).toString(),
        sn: this.humanoidDescNode.sn,
        imgDataBase64: imgData as string,
      };

      this.dressup([humanoidSlot]);
      // Record slot data in humanoidNode
      delete humanoidSlot.imgDataBase64;
      this.humanoidDescNode.addSlot(humanoidSlot);
    });
  }

  handleSlotTakeoff(event): void {
    const { slotName } = event;

    const slotConfig = this.slotConfigs.find(
      (item) => item.slotName === slotName
    );
    slotConfig.imageBlob = null;

    this.avatarPreview.canvas.cancelSlots([slotName]);

    // Record slot data in humanoidNode
    this.humanoidDescNode.removeSlot({
      slot: slotConfig.slotName,
    });
  }

  handleEmptyOverride(event): void {
    const { slotName, emptyOverride } = event;

    const slotConfig = this.slotConfigs.find(
      (item) => item.slotName === slotName
    );
    slotConfig.emptyOverride = emptyOverride;
  }

  handleRemoveBase(event): void {
    const { slotName, removeBase } = event;

    const slotConfig = this.slotConfigs.find(
      (item) => item.slotName === slotName
    );
    slotConfig.removeBase = removeBase;
  }

  public saveAndUpload(): void {
    // 1. 保存数据到平台
    this.saveToDB()
      .then((humanoid) => {
        // 2. 序列化humanoid文件并上传
        return this.serializeAndUploadHumanoid();
      })
      .then(() => {
        // 3. 上传Humanoid图片资源
        return this.uploadSlotAssets();
      })
      .then(() => {
        // 4. 上传封面图
        // return this.generateHumanoidThumbnailAndUpload();
      })
      .then(() => {
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          detail: 'Sava and upload success!',
        });
      });
  }

  private saveToDB(): Promise<HumanoidDescriptionNode> {
    if (this.humanoidDescNode.sn) {
      const nextVersion = +this.humanoidDescNode.version + 1;
      return new Promise((resolve, reject) => {
        this.pixoworCore.pixowApi.avatar
          .updateAvatar(this.humanoidDescNode.sn, {
            name: this.humanoidDescNode.name,
            version: nextVersion,
          })
          .then((res) => {
            this.humanoidDescNode.version = nextVersion.toString();
            this.humanoidDescNode.slots.forEach((slot) => {
              slot.version = this.humanoidDescNode.version;
            });
            // Version manage
            this.mergeHumanoidDescNodeSlotsWithSlotConfigs(this.slotConfigs);

            resolve(this.humanoidDescNode);
          })
          .catch((err) => reject(err));
      });
    } else {
      return new Promise((resolve, reject) => {
        this.pixoworCore.pixowApi.avatar
          .createAvatar({
            name: this.humanoidDescNode.name,
            version: 1,
            type: 'other', // TODO: dont need this type
          })
          .then((res) => {
            this.humanoidDescNode.sn = res.data._id;
            this.humanoidDescNode.version = '1';
            this.humanoidDescNode.slots.forEach((slot) => {
              slot.sn = res.data._id;
              slot.version = '1';
            });
            // Version manage
            this.mergeHumanoidDescNodeSlotsWithSlotConfigs(this.slotConfigs);

            resolve(this.humanoidDescNode);
          })
          .catch((err) => reject(err));
      });
    }
  }

  private serializeAndUploadHumanoid(): Promise<any> {
    const buff = this.humanoidDescNode.serialize();

    const blob = new Blob([buff]);
    const key = `avatar/${this.humanoidDescNode.sn}/${this.humanoidDescNode.version}/${this.humanoidDescNode.sn}.humanoid`;
    const file = new File([blob], key);

    const fileConfig: UploadFileConfig = {
      file,
      key,
    };

    return this.pixoworCore.uploadFile(fileConfig);
  }

  private uploadSlotAssets(): Promise<any> {
    const tasks: Promise<any>[] = [];

    const uploadFileConfigs: UploadFileConfig[] = this.slotConfigs
      .filter((config) => config.imageBlob)
      .map((config) => {
        const key = `avatar/${this.humanoidDescNode.sn}/${config.version}/${config.slotName}.png`;
        const file = new File([config.imageBlob], key);

        return {
          file,
          key,
        };
      });

    uploadFileConfigs.forEach((config) => {
      tasks.push(this.pixoworCore.uploadFile(config));
    });

    return Promise.all(tasks);
  }

  // private generateHumanoidThumbnailAndUpload(): Promise<any> {
  //   return this.avatarPreview.generateThumbnail().then((imageData) => {
  //     const key = `avatar/${this.humanoidDescNode.sn}/${this.humanoidDescNode.version}/thumbnail.png`;

  //     const thumbnailUploadFileConfig = {
  //       key,
  //       file: new File([this.base64toBlob(imageData)], key),
  //     };

  //     return this.pixoworCore.uploadFile(thumbnailUploadFileConfig);
  //   });
  // }

  private base64toBlob(base64Data, contentType?) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  public closeTooltip(): void {
    this.myTooltip.close();
  }

  ngOnDestroy(): void {
    this.readySubscription.unsubscribe();
  }
}
