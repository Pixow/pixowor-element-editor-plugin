import { Plugin, QingCore, UIEvents } from 'qing-core';
import manifest from './manifest.json';

export class QingSubwindowTestPlugin extends Plugin {
  constructor(qingCore: QingCore) {
    super(qingCore, manifest);
  }

  activate(): void {}

  deactivate(): void {}
}
