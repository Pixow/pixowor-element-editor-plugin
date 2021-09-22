import { Inject, Injectable } from '@angular/core';
import { QingCore } from 'qing-core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(@Inject(QingCore) private qingCore: QingCore) {}

  listAvatarComponents(): void {
    this.qingCore.qingApi.avatar.listAvatars().then((res) => {
      console.log('res: ', res);
    });
  }
}
