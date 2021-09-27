import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PixoworCore } from 'pixowor-core';
import { SlotConfig } from '../avatar-upload/avatar-upload.component';
const imageToBlob = require('image-to-blob');

@Component({
  selector: 'avatar-slot',
  templateUrl: './avatar-slot.component.html',
  styleUrls: ['./avatar-slot.component.scss'],
})
export class AvatarSlotComponent implements OnInit, AfterViewInit {
  @Input() slotConfig: SlotConfig;

  canvas;
  selectedFile: File;

  @ViewChild('avatarSlot') avatarSlot: ElementRef;
  @ViewChild('imagePreview') imagePreview: ElementRef;

  constructor(@Inject(PixoworCore) private pixoworCore: PixoworCore) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.avatarSlot.nativeElement.style.setProperty('top', `${this.slotConfig.top}px`);
    this.avatarSlot.nativeElement.style.setProperty(
      'left',
      `${this.slotConfig.left}px`
    );
  }

  selectFile(event): void {
    console.log(event);
    const { currentFiles } = event;

    if (currentFiles.length > 0) {
      this.selectedFile = currentFiles[0];

      imageToBlob(this.selectedFile.path, (err, blob) => {
        if (err) {
          console.error(err);
          return;
        }

        const src = window.URL.createObjectURL(blob);
        this.imagePreview.nativeElement.src = src;
      });
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }
}
