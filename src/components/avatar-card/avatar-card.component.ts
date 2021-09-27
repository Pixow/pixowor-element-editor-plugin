import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HumanoidSlot } from '@PixelPai/game-core';
import { DialogService } from 'primeng/dynamicdialog';
import { AvatarCard } from 'src/app/app.service';
import { AvatarUploadComponent } from '../avatar-upload/avatar-upload.component';

@Component({
  selector: 'avatar-card',
  templateUrl: './avatar-card.component.html',
  styleUrls: ['./avatar-card.component.scss'],
  providers: [DialogService],
})
export class AvatarCardComponent {
  @Input() avatar: AvatarCard;

  @Output() onDressup = new EventEmitter();

  constructor(public dialogService: DialogService) {}

  // avatar = {
  //   cover:
  //     'https://osd-alpha.tooqing.com/avatar/part/6139b9fe23be13001fa570cf/stand.png',
  //   archive: false,
  //   avatar_slot: 'NA==#MA==',
  //   createdAt: '2021-09-23T02:07:03.569Z',
  //   name: '面部202109231007',
  //   owner: {
  //     _id: '60adb0cd10bb4131ca4c4973',
  //     username: 'haitun',
  //     nickname: '海豚',
  //   },
  //   parts: ['head_eyes'],
  //   tags: [],
  //   type: 'face',
  //   updatedAt: '2021-09-23T02:07:03.569Z',
  //   visibility: 'Private',
  // };

  tryDressup(): void {
    const slots: HumanoidSlot[] = this.avatar.parts.map((part) => {
      return {
        slot: part,
        sn: this.avatar._id,
      };
    });

    this.onDressup.emit(slots);
  }

  editAvatar(): void {
    const ref = this.dialogService.open(AvatarUploadComponent, {
      header: 'Edit Avatar',
      width: '70%',
      data: {
        avatar: this.avatar
      }
    });
  }
}
