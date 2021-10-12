import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HumanoidSlot } from '@PixelPai/game-core';
import { HumanoidDescriptionNode } from 'game-capsule';
import { PixoworCore, UploadFileConfig } from 'pixowor-core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AvatarPreviewComponent } from '../avatar-preview/avatar-preview.component';
import { MessageService } from 'primeng/api';
const imageToBlob = require('image-to-blob');
const urlResolve = require('url-resolve-browser');

export interface SlotConfig {
  isFront: boolean;
  name: string;
  slotName: string;
  sn: string;
  version: string;
  limitImageWidth: number;
  limitImageHeight: number;
  top: number;
  left: number;
  imageBlob?: Blob;
  emptyOverride?: boolean;
  removeBase?: boolean;
  isHidden?: boolean;
}

export enum AvatarDir {
  FRONT = 3,
  BACK = 1,
}

const SlotConfigs: SlotConfig[] = [
  {
    isFront: true,
    slotName: 'head_face_3',
    sn: 'LOCALSN',
    name: 'Face',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 90,
    emptyOverride: null,
  },
  {
    isFront: true,
    slotName: 'head_base_3',
    sn: 'LOCALSN',
    name: 'Base',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 253,
    emptyOverride: null,
  },
  {
    isFront: true,
    slotName: 'head_mask_3',
    sn: 'LOCALSN',
    name: 'Mask',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 413,
    emptyOverride: null,
  },
  {
    isFront: true,
    slotName: 'barm_cost_3',
    sn: 'LOCALSN',
    name: 'Right Arm',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 150,
    left: 136,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: true,
    slotName: 'barm_base_3',
    sn: 'LOCALSN',
    name: 'Right Arm Base',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 260,
    left: 136,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: true,
    slotName: 'body_cost_3',
    sn: 'LOCALSN',
    name: 'Body Cost',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 177,
    left: 254,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: true,
    slotName: 'body_base_3',
    sn: 'LOCALSN',
    name: 'Body Base',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 67,
    left: 254,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: true,
    slotName: 'body_cost_dres_3',
    sn: 'LOCALSN',
    name: 'Dress',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 295,
    left: 254,
    emptyOverride: null,
  },
  {
    isFront: true,
    slotName: 'farm_cost_3',
    sn: 'LOCALSN',
    name: 'Left Arm',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 150,
    left: 377,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: true,
    slotName: 'farm_base_3',
    sn: 'LOCALSN',
    name: 'Left Arm Base',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 260,
    left: 377,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: true,
    slotName: 'barm_weap_3',
    sn: 'LOCALSN',
    name: 'Right Arm Weapon',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 176,
    left: 19,
    emptyOverride: null,
  },
  {
    isFront: true,
    slotName: 'barm_shld_3',
    sn: 'LOCALSN',
    name: 'Right Arm Handheld',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 286,
    left: 19,
    emptyOverride: null,
  },
  {
    isFront: true,
    slotName: 'farm_weap_3',
    sn: 'LOCALSN',
    name: 'Left Arm Weapon',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 176,
    left: 495,
    emptyOverride: null,
  },
  {
    isFront: true,
    slotName: 'farm_shld_3',
    sn: 'LOCALSN',
    name: 'Left Arm Handheld',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 286,
    left: 495,
    emptyOverride: null,
  },
  {
    isFront: true,
    slotName: 'bleg_cost_3',
    sn: 'LOCALSN',
    name: 'Right Leg',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 186,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: true,
    slotName: 'bleg_base_3',
    sn: 'LOCALSN',
    name: 'Right Leg Base',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 76,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: true,
    slotName: 'fleg_cost_3',
    sn: 'LOCALSN',
    name: 'Left Leg',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 321,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: true,
    slotName: 'fleg_base_3',
    sn: 'LOCALSN',
    name: 'Left Leg Base',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 431,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: false,
    slotName: 'head_base_1',
    sn: 'LOCALSN',
    name: 'Head Base',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 253,
    emptyOverride: null,
  },
  {
    isFront: false,
    slotName: 'head_mask_1',
    sn: 'LOCALSN',
    name: 'Head Mask',
    version: '0',
    limitImageWidth: 85,
    limitImageHeight: 93,
    top: 7,
    left: 413,
    emptyOverride: null,
  },
  {
    isFront: false,
    slotName: 'farm_cost_1',
    sn: 'LOCALSN',
    name: 'Left Arm',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 150,
    left: 136,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: false,
    slotName: 'farm_base_1',
    sn: 'LOCALSN',
    name: 'Left Arm Base',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 260,
    left: 136,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: false,
    slotName: 'body_cost_1',
    sn: 'LOCALSN',
    name: 'Body Cost',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 177,
    left: 254,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: false,
    slotName: 'body_base_1',
    sn: 'LOCALSN',
    name: 'Body Base',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 67,
    left: 254,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: false,
    slotName: 'body_cost_dres_1',
    sn: 'LOCALSN',
    name: 'Dress',
    version: '0',
    limitImageWidth: 44,
    limitImageHeight: 36,
    top: 295,
    left: 254,
    emptyOverride: null,
  },
  {
    isFront: false,
    slotName: 'barm_cost_1',
    sn: 'LOCALSN',
    name: 'Right Arm',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 150,
    left: 377,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: false,
    slotName: 'barm_base_1',
    sn: 'LOCALSN',
    name: 'Right Arm Base',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 260,
    left: 377,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: false,
    slotName: 'farm_weap_1',
    sn: 'LOCALSN',
    name: 'Left Arm Weap',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 176,
    left: 19,
    emptyOverride: null,
  },
  {
    isFront: false,
    slotName: 'farm_shld_1',
    sn: 'LOCALSN',
    name: 'Left Arm Handheld',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 286,
    left: 19,
    emptyOverride: null,
  },
  {
    isFront: false,
    slotName: 'barm_weap_1',
    sn: 'LOCALSN',
    name: 'Right Arm Weap',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 176,
    left: 495,
    emptyOverride: null,
  },
  {
    isFront: false,
    slotName: 'barm_shld_1',
    sn: 'LOCALSN',
    name: 'Right Arm Handheld',
    version: '0',
    limitImageWidth: 21,
    limitImageHeight: 26,
    top: 286,
    left: 495,
    emptyOverride: null,
  },
  {
    isFront: false,
    slotName: 'fleg_cost_1',
    sn: 'LOCALSN',
    name: 'Left Leg',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 186,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: false,
    slotName: 'fleg_base_1',
    sn: 'LOCALSN',
    name: 'Left Leg Base',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 76,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
  },
  {
    isFront: false,
    slotName: 'bleg_cost_1',
    sn: 'LOCALSN',
    name: 'Right Leg',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 321,
    emptyOverride: null,
    removeBase: null,
  },
  {
    isFront: false,
    slotName: 'bleg_base_1',
    sn: 'LOCALSN',
    name: 'Right Leg Base',
    version: '0',
    limitImageWidth: 17,
    limitImageHeight: 25,
    top: 450,
    left: 431,
    emptyOverride: null,
    removeBase: null,
    isHidden: true,
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

  nextVersion: number;

  public get frontSlotConfigs(): SlotConfig[] {
    return this.slotConfigs.filter((config) => config.isFront);
  }

  public get backSlotConfigs(): SlotConfig[] {
    return this.slotConfigs.filter((config) => !config.isFront);
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

  private generateSlotConfigsWithHumanoidDescSlots(): SlotConfig[] {
    const newSlotConfigs = JSON.parse(JSON.stringify(SlotConfigs));
    for (const config of newSlotConfigs) {
      const slot = this.humanoidDescNode.slots.find(
        (item) => item.slot === config.slotName
      );
      if (slot) {
        config.version = slot.version;
        config.sn = slot.sn;
        config.emptyOverride = slot.emptyOverride;
        config.removeBase = slot.removeBase;
      }
    }

    return newSlotConfigs;
  }

  async ngOnInit() {
    await this.initSlotConfigs();
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

  private getSlotAssetKey(sn: string, version: string, slotName: string) {
    return `avatar/${sn}/${version}/${slotName}.png`;
  }

  private initSlotConfigs(): Promise<any> {
    // Generate slotConfigs with humanoidDescNode slots
    const slotConfigs = this.generateSlotConfigsWithHumanoidDescSlots();
    console.log('🚀 initSlotConfigs ~ slotConfigs', slotConfigs);

    const tasks: Promise<any>[] = [];

    for (const slot of this.humanoidDescNode.slots) {
      const slotConfig = slotConfigs.find(
        (config) => config.slotName === slot.slot
      );

      const slotAssetKey = this.getSlotAssetKey(
        slot.sn,
        slot.version,
        slot.slot
      );

      const slotAssetUrl = urlResolve(
        this.pixoworCore.settings.WEB_RESOURCE_URI,
        slotAssetKey
      );

      tasks.push(this.loadSlotAsset(slotAssetUrl, slotConfig));
    }

    return Promise.all(tasks).then(() => {
      this.slotConfigs = slotConfigs;
    });
  }

  private loadSlotAsset(url: string, config: SlotConfig): Promise<SlotConfig> {
    return new Promise((resolve, reject) => {
      imageToBlob(url, (err, blob) => {
        if (err) {
          console.error(err);
          config.imageBlob = null;
          resolve(config);
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

  public turnAroundHumanoidSlots(): void {
    this.isFront = !this.isFront;
  }

  public dressup(slots: HumanoidSlot[]): void {
    this.avatarPreview.dressup(slots);
  }

  private getSlotConfig(slotName: string): SlotConfig {
    return this.slotConfigs.find((item) => item.slotName === slotName);
  }

  public handleSlotAssetSelect(event): void {
    const { slotName, imageBlob } = event;

    const slotConfig = this.getSlotConfig(slotName);
    slotConfig.imageBlob = imageBlob;

    // preview avatar with slot
    this.blobToBase64(imageBlob).then((imgData) => {
      const humanoidSlot: HumanoidSlot = {
        slot: slotConfig.slotName,
        version: slotConfig.version,
        sn: slotConfig.sn,
        imgDataBase64: imgData as string,
      };
      this.dressup([humanoidSlot]);
    });
  }

  handleSlotTakeoff(event): void {
    const { slotName } = event;

    const slotConfig = this.getSlotConfig(slotName);
    slotConfig.imageBlob = null;

    this.avatarPreview.canvas.cancelSlots([slotName]);
  }

  handleEmptyOverride(event): void {
    const { slotName, emptyOverride } = event;

    const slotConfig = this.getSlotConfig(slotName);
    slotConfig.emptyOverride = emptyOverride;
  }

  handleRemoveBase(event): void {
    const { slotName, removeBase } = event;

    const slotConfig = this.getSlotConfig(slotName);
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
        return this.generateHumanoidThumbnailAndUpload();
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
      this.nextVersion = +this.humanoidDescNode.version + 1;
      return new Promise((resolve, reject) => {
        this.pixoworCore.pixowApi.avatar
          .updateAvatar(this.humanoidDescNode.sn, {
            name: this.humanoidDescNode.name,
            version: this.nextVersion,
          })
          .then((res) => {
            this.humanoidDescNode.version = this.nextVersion.toString();

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

            resolve(this.humanoidDescNode);
          })
          .catch((err) => reject(err));
      });
    }
  }

  private serializeAndUploadHumanoid(): Promise<any> {
    // generate humanoidDescNode slots from slotConfigs

    this.humanoidDescNode.slots = this.slotConfigs
      .filter((slotConfig) => {
        if (
          slotConfig.imageBlob ||
          !!slotConfig.removeBase ||
          !!slotConfig.emptyOverride
        ) {
          return slotConfig;
        }
      })
      .map((slotConfig) => {
        if (slotConfig.imageBlob) {
          slotConfig.sn = this.humanoidDescNode.sn;
          slotConfig.version = this.humanoidDescNode.version;

          return {
            slot: slotConfig.slotName,
            version: this.humanoidDescNode.version,
            sn: this.humanoidDescNode.sn,
            emptyOverride: slotConfig.emptyOverride,
            ...(slotConfig.removeBase && { removeBase: slotConfig.removeBase }),
          };
        } else {
          return {
            slot: slotConfig.slotName,
            version: this.humanoidDescNode.version,
            emptyOverride: slotConfig.emptyOverride,
            ...(slotConfig.removeBase && { removeBase: slotConfig.removeBase }),
          };
        }
      });

    console.log('slots: ', this.humanoidDescNode.slots);

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
        const key = `avatar/${config.sn}/${config.version}/${config.slotName}.png`;
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

  public generateHumanoidThumbnailAndUpload(): Promise<any> {
    return this.avatarPreview.canvas.generateThumbnail().then((imageData) => {
      console.log('Thumbnail: ', imageData);
      const key = `avatar/${this.humanoidDescNode.sn}/${this.humanoidDescNode.version}/thumbnail.png`;

      const thumbnailUploadFileConfig = {
        key,
        file: new File([this.base64toBlob(imageData)], key),
      };

      return this.pixoworCore.uploadFile(thumbnailUploadFileConfig);
    });
  }

  private base64toBlob(base64Data, contentType?) {
    if (base64Data.indexOf(',') >= 0) {
      base64Data = base64Data.substring(base64Data.indexOf(',') + 1);
    }

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

  private blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  public closeTooltip(): void {
    this.myTooltip.close();
  }

  ngOnDestroy(): void {
    this.readySubscription.unsubscribe();
  }
}
