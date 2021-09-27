import { Plugin, PixoworCore, UIEvents } from 'pixowor-core';
import manifest from './manifest.json';

export class PixoworAvatarManagePlugin extends Plugin {
  constructor(pixoworCore: PixoworCore) {
    super(pixoworCore, manifest);
  }

  activate(): void {
    this.colorLog(`${this.name} activate, Pid: ${this.pid}`);

    this.pixoworCore.workspace.emit(UIEvents.INJECT_PLUGIN_MENU, {
      pid: this.pid,
      label: '装扮管理',
      type: 'subwindow'
    });
  }

  deactivate(): void {}
}
