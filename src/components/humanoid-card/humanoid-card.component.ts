import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { HumanoidSlot } from '@PixelPai/game-core';
import { HumanoidDescriptionNode } from 'game-capsule';
import { PixoworCore } from 'pixowor-core';
import { DialogService } from 'primeng/dynamicdialog';
import { HumanoidCard } from 'src/app/app.service';
import { HumanoidAssetsUploadComponent } from '../humanoid-assets-upload/humanoid-assets-upload.component';
const urlResolve = require('url-resolve-browser');

@Component({
  selector: 'humanoid-card',
  templateUrl: './humanoid-card.component.html',
  styleUrls: ['./humanoid-card.component.scss'],
  providers: [DialogService],
})
export class HumanoidCardComponent {
  @Input() humanoidCard: HumanoidCard;

  @Output() onDressup = new EventEmitter();

  constructor(
    @Inject(PixoworCore) private pixoworCore: PixoworCore,
    public dialogService: DialogService
  ) {}

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
    const humanoidFileUrl = urlResolve(
      this.pixoworCore.settings.WEB_RESOURCE_URI,
      `avatar/${this.humanoidCard._id}/${this.humanoidCard.version}/${this.humanoidCard._id}.humanoid`
    );

    fetch(humanoidFileUrl)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const message = HumanoidDescriptionNode.decode(new Uint8Array(buffer));
        const humanoidDescNode = new HumanoidDescriptionNode();
        humanoidDescNode.deserialize(message);

        console.log('humanoidDescNode: ', humanoidDescNode);

        this.onDressup.emit(humanoidDescNode.slots);
      });
  }

  editHumanoid(): void {
    const humanoidFileUrl = urlResolve(
      this.pixoworCore.settings.WEB_RESOURCE_URI,
      `avatar/${this.humanoidCard._id}/${this.humanoidCard.version}/${this.humanoidCard._id}.humanoid`
    );

    fetch(humanoidFileUrl)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const message = HumanoidDescriptionNode.decode(new Uint8Array(buffer));
        const humanoidDescNode = new HumanoidDescriptionNode();
        humanoidDescNode.deserialize(message);

        console.log('humanoidDescNode: ', humanoidDescNode);

        const ref = this.dialogService.open(HumanoidAssetsUploadComponent, {
          header: 'Edit Humanoid',
          width: '70%',
          data: {
            humanoidDescNode,
          },
        });
      });
  }
}
