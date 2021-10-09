import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HumanoidDescriptionNode } from 'game-capsule';
import { PixoworCore, UploadFileConfig } from 'pixowor-core';
const imageToBlob = require('image-to-blob');
const urlResolve = require('url-resolve-browser');

@Component({
  selector: 'humanoid-thumbnail',
  templateUrl: './humanoid-thumbnail.component.html',
  styleUrls: ['./humanoid-thumbnail.component.scss'],
})
export class HumanoidThumbnailComponent implements OnInit, AfterViewInit {
  @Input() thumbnailUploadFileConfig: UploadFileConfig;

  // Emit when select a image
  @Output() onThumbnailSelect = new EventEmitter<UploadFileConfig>();
  // Emit when remove a image
  @Output() onThumbnailRemove = new EventEmitter();

  hasThumbnail = false;

  @ViewChild('thumbnailPreview') thumbnailPreview: ElementRef;

  constructor(@Inject(PixoworCore) private pixoworCore: PixoworCore) {}

  ngOnInit(): void {
    if (this.thumbnailUploadFileConfig.file) {
      this.hasThumbnail = true;
    }
  }

  ngAfterViewInit(): void {

  }

  selectFile(event): void {
    console.log(event);
    const { currentFiles } = event;

    if (currentFiles.length > 0) {
      const selectedFile = currentFiles[0];
      this.hasThumbnail = true;

      imageToBlob(selectedFile.path, (err, blob) => {
        if (err) {
          console.error(err);
          return;
        }

        this.onThumbnailSelect.emit({
          key: this.thumbnailUploadFileConfig.key,
          file: new File([blob], this.thumbnailUploadFileConfig.key),
        });

        const src = window.URL.createObjectURL(blob);
        this.thumbnailPreview.nativeElement.src = src;
      });
    }
  }

  onRemove() {
    this.onThumbnailRemove.emit();
  }
}
