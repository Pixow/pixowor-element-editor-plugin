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
  // selectedFile: File;
  imageBlob: Blob;

  @ViewChild('avatarSlot') avatarSlot: ElementRef;
  @ViewChild('slotPreview') slotPreview: ElementRef;

  constructor(@Inject(PixoworCore) private pixoworCore: PixoworCore) {}

  ngOnInit(): void {
    console.log(`SlotConfig: ${this.slotConfig.slotName}    `, this.slotConfig);
    if (this.slotConfig.imageBlob) {
      this.imageBlob = this.slotConfig.imageBlob;
      const src = window.URL.createObjectURL(this.slotConfig.imageBlob);
      this.slotPreview.nativeElement.src = src;
    }
  }

  ngAfterViewInit(): void {
    this.avatarSlot.nativeElement.style.setProperty(
      'top',
      `${this.slotConfig.top}px`
    );
    this.avatarSlot.nativeElement.style.setProperty(
      'left',
      `${this.slotConfig.left}px`
    );
  }

  selectFile(event): void {
    console.log(event);
    const { currentFiles } = event;

    if (currentFiles.length > 0) {
      const selectedFile = currentFiles[0];

      imageToBlob(selectedFile.path, (err, blob) => {
        if (err) {
          console.error(err);
          return;
        }

        this.imageBlob = blob;
        const src = window.URL.createObjectURL(blob);
        this.slotPreview.nativeElement.src = src;
      });
    }
  }

  // getImageDataUrl(): string {
  //   return window.URL.createObjectURL(this.imageBlob);
  // }

  removeSelectedFile(): void {
    this.imageBlob = null;
  }
}
