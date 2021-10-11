import { Inject, Injectable } from '@angular/core';
import { PixoworCore } from 'pixowor-core';
import { BehaviorSubject } from 'rxjs';
import { Avatar, QueryParams } from 'pixow-api';
const urlResolve = require('url-resolve-browser');

export type HumanoidCard = Avatar & {
  cover: string;
};

@Injectable({
  providedIn: 'root',
})
export class AppService {
  total$ = new BehaviorSubject<number>(0);
  humanoidCards$ = new BehaviorSubject<HumanoidCard[]>([]);

  constructor(private pixoworCore: PixoworCore) {}

  getHumanoidCards(query: QueryParams): void {
    this.pixoworCore.pixowApi.avatar.listAvatars(query).then((res) => {
      this.total$.next(res.total);

      const humanoidCards = res.list.map((record: HumanoidCard) => {

        if (!record.owner) {
          record.owner = {
            _id: '',
            nickname: '已注销',
            username: '已注销',
          };
        }

        if (record.version) {
          record.cover = urlResolve(
            this.pixoworCore.settings.WEB_RESOURCE_URI,
            `avatar/${record._id}/${record.version}/thumbnail.png`
          );
        } else {
          record.cover = urlResolve(
            this.pixoworCore.settings.WEB_RESOURCE_URI,
            `avatar/${record._id}/stand.png`
          );
        }

        return record;
      });

      this.humanoidCards$.next(humanoidCards);
    });
  }

  public getQiniuToken(name: string): Promise<string> {
    return this.pixoworCore.pixowApi.util.getQiniuToken({ name });
  }
}
