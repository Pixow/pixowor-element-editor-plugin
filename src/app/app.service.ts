import { Inject, Injectable } from '@angular/core';
import { PixoworCore } from 'pixowor-core';
import { BehaviorSubject } from 'rxjs';
import { Avatar, QueryParams } from 'pixow-api';
const urlResolve = require('url-resolve-browser');

export type AvatarCard = Avatar & {
  cover: string;
};

@Injectable({
  providedIn: 'root',
})
export class AppService {
  total$ = new BehaviorSubject<number>(0);
  avatars$ = new BehaviorSubject<AvatarCard[]>([]);

  constructor(private pixoworCore: PixoworCore) {}

  listAvatarComponents(query: QueryParams): void {
    this.pixoworCore.pixowApi.avatar.listAvatars(query).then((res) => {
      this.total$.next(res.total);

      const avatarCards = res.list.map((avatar) => {
        const avatarCard = avatar as AvatarCard;

        if (!avatar.owner) {
          avatar.owner = {
            _id: '',
            nickname: '已注销',
            username: '已注销',
          };
        }

        if (avatar.version) {
          avatarCard.cover = urlResolve(
            this.pixoworCore.settings.WEB_RESOURCE_URI,
            `avatar/part/${avatar._id}/stand_${avatar.version}.png`
          );
        } else {
          avatarCard.cover = urlResolve(
            this.pixoworCore.settings.WEB_RESOURCE_URI,
            `avatar/part/${avatar._id}/stand.png`
          );
        }

        return avatarCard;
      });

      this.avatars$.next(avatarCards);
    });
  }

  public getQiniuToken(name: string): Promise<string> {
    return this.pixoworCore.pixowApi.util.getQiniuToken({ name });
  }
}
