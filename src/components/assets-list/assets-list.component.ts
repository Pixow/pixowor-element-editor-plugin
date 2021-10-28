import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IImage } from 'game-capsule';
import { MessageService } from 'primeng/api';
import { ElementEditorService } from 'src/app/element-editor.service';

@Component({
  selector: 'assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  providers: [MessageService],
})
export class AssetsListComponent implements OnInit {
  public images: IImage[];
  public selectedImage: IImage;

  constructor(
    private cd: ChangeDetectorRef,
    private elementEditorService: ElementEditorService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.elementEditorService.getImages().subscribe((images: IImage[]) => {
      this.images = images;
      this.cd.detectChanges();
    });
  }

  onSelectImage(image: IImage) {
    this.elementEditorService.selectImage(image);
  }

  onAddImages(event) {
    const task = [];
    const files = event.target.files;
    for (const file of files) {
      task.push(this.readFile(file));
    }

    Promise.all(task).then((images) => {
      this.elementEditorService.addImages(images);
    });
  }

  readFile(file): Promise<any> {
    if (file.size > 1024 * 1024 * 2) {
      this.messageService.add({
        severity: 'warn',
        detail: '图片最大不能超过2M',
      });
      return;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const image: IImage = {
          key: file.name + '?t=' + file.lastModified,
          name: file.name,
          url: reader.result,
          isBlank: false,
        };

        resolve(image);
      };

      reader.onerror = (e) => {
        reject(e);
      };
    });
  }

  onDeleteImage(image: IImage) {
    this.elementEditorService.removeImage(image);
  }
}
