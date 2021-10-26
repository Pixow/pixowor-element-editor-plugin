import { Plugin, PixoworCore, UIEvents } from 'pixowor-core';
import manifest from './manifest.json';

export class PixoworElementEditorPlugin extends Plugin {
  constructor(pixoworCore: PixoworCore) {
    super(pixoworCore, manifest);
  }

  activate(): void {
    this.colorLog(`${this.name} activate, Pid: ${this.pid}`);

    this.pixoworCore.workspace.emit(UIEvents.INJECT_PLUGIN_MENU, {
      pid: this.pid,
      label: '物件编辑器',
      type: 'subwindow',
      width: 1320,
      height: 870
    });
  }

  deactivate(): void {}
}
