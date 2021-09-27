import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HumanoidSlot } from '@PixelPai/game-core';
import { PixoworCore } from 'pixowor-core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AvatarPreviewComponent } from '../avatar-preview/avatar-preview.component';

export interface SlotConfig {
  slotId: string;
  name: string;
  limitImageWidth: number;
  limitImageHeight: number;
  top: number;
  left: number;
}

@Component({
  selector: 'avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
})
export class AvatarUploadComponent implements OnInit, AfterViewInit {
  @Input() avatarNode;

  @ViewChild(AvatarPreviewComponent) avatarPreview: AvatarPreviewComponent;

  front = true;

  frontSlotConfigs: SlotConfig[] = [
    {
      slotId: 'head_face_3',
      name: 'Face',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 90,
    },
    {
      slotId: 'head_base_3',
      name: 'Base',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 253,
    },
    {
      slotId: 'head_mask_3',
      name: 'Mask',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 413,
    },
    {
      slotId: 'barm_cost_3',
      name: 'Right Arm',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 150,
      left: 136,
    },
    {
      slotId: 'body_cost_3',
      name: 'Body',
      limitImageWidth: 44,
      limitImageHeight: 36,
      top: 177,
      left: 254,
    },
    {
      slotId: 'body_cost_dres_3',
      name: 'Dress',
      limitImageWidth: 44,
      limitImageHeight: 36,
      top: 295,
      left: 254,
    },
    {
      slotId: 'farm_cost_3',
      name: 'Left Arm',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 150,
      left: 377,
    },
    {
      slotId: 'barm_weap_3',
      name: 'Right Arm Weapon',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 176,
      left: 19,
    },
    {
      slotId: 'barm_shld_3',
      name: 'Right Arm Handheld',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 286,
      left: 19,
    },
    {
      slotId: 'farm_weap_3',
      name: 'Left Arm Weapon',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 176,
      left: 495,
    },
    {
      slotId: 'farm_shld_3',
      name: 'Left Arm Handheld',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 286,
      left: 495,
    },
    {
      slotId: 'bleg_cost_3',
      name: 'Right Leg',
      limitImageWidth: 17,
      limitImageHeight: 25,
      top: 450,
      left: 186,
    },
    {
      slotId: 'fleg_cost_3',
      name: 'Left Leg',
      limitImageWidth: 17,
      limitImageHeight: 25,
      top: 450,
      left: 321,
    },
  ];

  backSlotConfigs: SlotConfig[] = [
    {
      slotId: 'head_base_1',
      name: 'Base',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 253,
    },
    {
      slotId: 'head_mask_1',
      name: 'Mask',
      limitImageWidth: 85,
      limitImageHeight: 93,
      top: 7,
      left: 413,
    },
    {
      slotId: 'farm_cost_1',
      name: 'Left Arm',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 150,
      left: 136,
    },
    {
      slotId: 'body_cost_1',
      name: 'Body',
      limitImageWidth: 44,
      limitImageHeight: 36,
      top: 177,
      left: 254,
    },
    {
      slotId: 'body_cost_dres_1',
      name: 'Dress',
      limitImageWidth: 44,
      limitImageHeight: 36,
      top: 295,
      left: 254,
    },
    {
      slotId: 'barm_cost_1',
      name: 'Right Arm',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 150,
      left: 377,
    },
    {
      slotId: 'farm_weap_1',
      name: 'Left Arm Weap',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 176,
      left: 19,
    },
    {
      slotId: 'farm_shld_1',
      name: 'Left Arm Handheld',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 286,
      left: 19,
    },
    {
      slotId: 'barm_weap_1',
      name: 'Right Arm Weap',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 176,
      left: 495,
    },
    {
      slotId: 'barm_shld_1',
      name: 'Right Arm Handheld',
      limitImageWidth: 21,
      limitImageHeight: 26,
      top: 286,
      left: 495,
    },
    {
      slotId: 'fleg_cost_1',
      name: 'Left Leg',
      limitImageWidth: 17,
      limitImageHeight: 25,
      top: 450,
      left: 186,
    },
    {
      slotId: 'bleg_cost_1',
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
  ) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    const { avatar } = this.config.data;

    const slots = avatar.parts.map((part) => {
      return {
        slot: part,
        sn: avatar._id,
      };
    });

    setTimeout(() => {
      this.dressup(slots);
    }, 100);
  }

  turnAroundAvatarSlots(): void {
    this.front = !this.front;
  }

  dressup(slots: HumanoidSlot[]): void {
    this.avatarPreview.dressup(slots);
  }
}
