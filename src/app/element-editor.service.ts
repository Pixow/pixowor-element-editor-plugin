import { Injectable } from '@angular/core';
import { PixoworCore } from 'pixowor-core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import {
  AnimationDataNode,
  AnimationLayer,
  AnimationMountLayer,
  ElementNode,
  IFrame,
  IImage,
} from 'game-capsule';
import { Capsule } from 'game-capsule';
import * as fs from 'fs';
import * as path from 'path';
import { ElementEditorBrushType, ElementEditorCanvas } from '@PixelPai/game-core';
import { nativeImage } from 'electron';
import * as fsa from 'fs-extra';

export const BLANK_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';

@Injectable({
  providedIn: 'root',
})
export class ElementEditorService {
  private images$ = new BehaviorSubject<IImage[]>([]);
  public capsule: Capsule;
  private element$ = new BehaviorSubject<ElementNode>(undefined);
  public element: ElementNode;
  private selectedLayer$ = new BehaviorSubject<
    AnimationLayer | AnimationMountLayer
  >(undefined);
  private selectedAnimationData$ = new BehaviorSubject<AnimationDataNode>(
    undefined
  );
  public elementEditorCanvas: ElementEditorCanvas = undefined;
  private selectedImage$ = new BehaviorSubject<IImage>(undefined);
  private elementDir: string;

  updateElement(element: ElementNode) {
    this.element$.next(element);
  }

  getElement(): Observable<ElementNode> {
    return this.element$.asObservable();
  }

  updateSelectedAnimationData(animationData: AnimationDataNode) {
    this.selectedAnimationData$.next(animationData);
  }

  getSelectedAnimationData() {
    return this.selectedAnimationData$.asObservable();
  }

  public get selectedAnimationData() {
    return this.selectedAnimationData$.getValue();
  }

  updateSelectedLayer(animationLayer: AnimationLayer | AnimationMountLayer) {
    this.selectedLayer$.next(animationLayer);
  }

  getSelectedLayer() {
    return this.selectedLayer$.asObservable();
  }

  public get selectedLayer() {
    return this.selectedLayer$.getValue();
  }

  public getImages() {
    return this.images$.asObservable();
  }

  public get images() {
    return this.images$.getValue();
  }

  public getSelectedImage() {
    return this.selectedImage$.asObservable();
  }

  public get selectedImage() {
    return this.selectedImage$.getValue();
  }

  constructor(private pixoworCore: PixoworCore) {}

  public initElement(): Promise<ElementNode> {
    const { USER_DATA_PATH } = this.pixoworCore.settings;

    this.elementDir =
      'packages/elements/mjxmjx/ElementNode/601fd448765b50025e3fbd25/1';

    this.capsule = new Capsule();

    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(
          USER_DATA_PATH,
          'packages/elements/mjxmjx/ElementNode/601fd448765b50025e3fbd25/1/601fd448765b50025e3fbd25.pi'
        ),
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }

          this.capsule.deserialize(new Uint8Array(data));
          const element = this.capsule.root.children[0] as ElementNode;
          const defaultAniName = element.animations.defaultAnimation;
          const defaultAniData = element.animations.animationData.find(
            (aniData) => aniData.name === defaultAniName
          );
          const defaultAniLayer = Array.from(
            defaultAniData.layerDict.values()
          )[0];
          this.updateSelectedAnimationData(defaultAniData);
          this.updateSelectedLayer(defaultAniLayer);
          this.updateElement(element);
          this.element = element;
          resolve(element);
        }
      );
    });
  }

  setElementImages(images: IImage[]) {
    this.images$.next(images);
  }

  selectImage(image: IImage) {
    this.selectedImage$.next(image);
  }

  public changeBrushType(type: ElementEditorBrushType) {
    this.elementEditorCanvas.changeBrush(type);
  }

  addImages(imgs: IImage[]) {
    let images = this.images$.getValue().concat(imgs);
    images = _.uniqBy(images, 'key');
    const hasBlank = images.findIndex((img) => img.key === 'blank');
    if (hasBlank === -1) {
      images = images.concat(this.getBlankImage());
    }

    this.elementEditorCanvas.generateSpriteSheet(images).then((ret) => {
      const { url, json } = ret;
      const imageBuffer = this.imgDataStringToBuffer(url);

      this.saveElementDisplay(imageBuffer, json)
        .then(() => {
          this.elementEditorCanvas.reloadDisplayNode();
        })
        .catch((err) => {
          console.log(err);
        });
    });

    this.images$.next(images);
  }

  removeImage(image: IImage) {
    const images = this.images;
    const index = images.findIndex((img) => img.key === image.key);
    images.splice(index, 1);

    this.elementEditorCanvas.generateSpriteSheet(images).then((ret) => {
      const { url, json } = ret;
      const imageBuffer = this.imgDataStringToBuffer(ret.url);

      this.saveElementDisplay(imageBuffer, json)
        .then(() => {
          this.elementEditorCanvas.reloadDisplayNode();
        })
        .catch((err) => {
          console.log(err);
        });
    });

    this.images$.next(images);
  }

  saveElementDisplay(textureBuffer: any, dataJSON: string): Promise<any> {
    const { USER_DATA_PATH } = this.pixoworCore.settings;
    const task = [];

    this.element.animations.display.textureBuffer = textureBuffer;
    this.element.animations.display.dataJSON = dataJSON;

    this.element.animations.display.texturePath = path.posix.join(
      this.elementDir,
      `${this.element.sn}.png`
    );
    this.element.animations.display.dataPath = path.posix.join(
      this.elementDir,
      `${this.element.sn}.json`
    );
    const componentTexturePath = path.posix.join(
      USER_DATA_PATH,
      this.elementDir,
      `${this.element.sn}.png`
    );
    const componentDataPath = path.posix.join(
      USER_DATA_PATH,
      this.elementDir,
      `${this.element.sn}.json`
    );

    if (!fs.existsSync(componentTexturePath)) {
      fsa.ensureFileSync(componentTexturePath);
    }
    if (!fs.existsSync(componentDataPath)) {
      fsa.ensureFileSync(componentDataPath);
    }

    task.push(fsa.writeFile(componentTexturePath, Buffer.from(textureBuffer)));
    task.push(fsa.writeFile(componentDataPath, dataJSON));

    return Promise.all(task);
  }

  private imgDataStringToBuffer(data) {
    const image = nativeImage.createFromDataURL(data);
    return new Uint8Array(image.toPNG()).buffer;
  }

  private getBlankImage(): IImage {
    return {
      name: 'blank',
      key: 'blank',
      isBlank: true,
      url: BLANK_BASE64,
    };
  }

  public addAnimationData(name: string) {
    const animationData = this.capsule.add.animationdata(
      this.element.animations,
      name
    );

    this.elementEditorCanvas.changeAnimationData(animationData.id);
    this.selectedAnimationData$.next(animationData);
  }

  public removeAnimationData(index: number) {
    const element = this.element;

    const animationData = element.animations.animationData[index];
    element.animations.removeAnimationData(animationData);
    if (element.animations.defaultAnimationName === animationData.name) {
      element.animations.defaultAnimationName =
        element.animations.animationData[0].name;
    }
    this.selectedAnimationData$.next(element.animations.animationData[0]);

    this.updateElement(element);
  }

  public setDefaultAnimationData(animationData: AnimationDataNode) {
    const element = this.element;

    this.element.animations.defaultAnimationName = animationData.name;

    this.updateElement(element);
  }

  public toggleLoop() {
    const animationData = this.selectedAnimationData;
    animationData.loop = !animationData.loop;
    this.updateSelectedAnimationData(animationData);
  }

  public showFrame(frameIndex: number) {
    this.elementEditorCanvas.selectFrame(frameIndex);
  }

  public addFrame(frame: IFrame, index: number) {
    const animationData = this.selectedAnimationData;
    const animationLayer = this.selectedLayer;
    Array.from(animationData.layerDict.values()).forEach((layer: any) => {
      layer.addFrameAt(frame.name, index);
    });

    animationData.addDuration(index);

    if (animationData.mountLayer) {
      animationData.mountLayer.addFrameVisible(index);
    }

    this.updateSelectedAnimationData(animationData);
    this.updateSelectedLayer(animationData.layerDict.get(animationLayer.id));
  }

  public removeFrame(frameIndex: number) {
    const animationData = this.selectedAnimationData;
    const animationLayer = this.selectedLayer;
    for (const layer of Array.from(animationData.layerDict.values())) {
      (layer as AnimationLayer).removeFrame(frameIndex);
    }
    animationData.deleteDuration(frameIndex);
    this.updateSelectedAnimationData(animationData);
    this.updateSelectedLayer(animationData.layerDict.get(animationLayer.id));
  }

  public moveFrame(fromIndex: number, toIndex: number) {
    const animationData = this.selectedAnimationData;
    const animationLayer = this.selectedLayer;
    for (const layer of Array.from(animationData.layerDict.values())) {
      (layer as AnimationLayer).moveFrame(fromIndex, toIndex);
    }
    this.updateSelectedAnimationData(animationData);
    this.updateSelectedLayer(animationData.layerDict.get(animationLayer.id));
  }

  public updateFrame(frame: IFrame, frameIndex: number) {
    const animationData = this.selectedAnimationData;
    if (this.selectedLayer instanceof AnimationLayer) {
      this.selectedLayer.updateFrame(frame, frameIndex);
    }

    this.updateSelectedAnimationData(animationData);
    this.updateSelectedLayer(this.selectedLayer);
  }

  public updateFrameRate(value: number) {
    const animationData = this.selectedAnimationData;
    animationData.frameRate = value;

    this.updateSelectedAnimationData(animationData);
  }

  public selectLayer(layer: AnimationLayer | AnimationMountLayer) {
    this.selectedLayer$.next(layer);
  }

  public addAnimationLayer() {
    const animationData = this.selectedAnimationData;
    animationData.addAnimationLayer();
    this.updateSelectedAnimationData(animationData);
  }

  public addAnimationMountLayer() {
    const animationData = this.selectedAnimationData;

    if (animationData.mountLayer) {
      return;
    }
    const aniLayers: AnimationLayer[] = Array.from(
      animationData.layerDict.values()
    );
    animationData.addAnimationMountLayer(aniLayers.length);

    if (aniLayers.length) {
      animationData.mountLayer.initMountPoints(aniLayers[0].frameName.length);
    } else {
      animationData.mountLayer.initMountPoints(0);
    }

    this.elementEditorCanvas.updateDepth();

    this.updateSelectedAnimationData(animationData);
  }

  public getMixinLayers(
    animationData: AnimationDataNode
  ): Array<AnimationLayer | AnimationMountLayer> {
    let mixinLayers: Array<AnimationLayer | AnimationMountLayer> = [];

    if (animationData && animationData.layerDict) {
      let len = Array.from(animationData.layerDict.values()).length;

      if (animationData.mountLayer) {
        len += 1;
      }

      mixinLayers = new Array(len);

      if (animationData.mountLayer) {
        mixinLayers[animationData.mountLayer.index] = animationData.mountLayer;
      }

      for (const [key, layer] of animationData.layerDict) {
        mixinLayers[layer.depth] = layer;
      }
    }

    return mixinLayers;
  }

  public deleteLayer() {
    const animationData = this.selectedAnimationData;
    if (this.selectedLayer instanceof AnimationLayer) {
      animationData.deleteAnimationLayer(this.selectedLayer.id);
    } else {
      animationData.deleteAnimationMountLayer();
    }

    const mixinLayers = this.getMixinLayers(animationData);
    this.updateLayersDepth(mixinLayers);
    this.elementEditorCanvas.updateDepth();
    this.updateSelectedAnimationData(animationData);
  }

  public toggleLayerVisible() {
    const animationData = this.selectedAnimationData;
    (this.selectedLayer as AnimationLayer).layerVisible = !(
      this.selectedLayer as AnimationLayer
    ).layerVisible;

    this.updateSelectedAnimationData(animationData);
  }

  public updateLayersDepth(
    layers: Array<AnimationLayer | AnimationMountLayer>
  ) {
    const animationData = this.selectedAnimationData;
    const aniLayerDepthData = [];
    let mountLayerIndex = 0;

    layers.forEach((layer, index) => {
      if (layer instanceof AnimationLayer) {
        aniLayerDepthData.push({
          id: layer.id,
          index,
        });
      }

      if (layer instanceof AnimationMountLayer) {
        mountLayerIndex = index;
      }
    });

    animationData.updateAnimationLayerDepth(aniLayerDepthData);
    animationData.updateAnimationMountLayerDepth(mountLayerIndex);

    this.updateSelectedAnimationData(animationData);
  }

  public selectAnimationMountPoint(index: number) {
    this.elementEditorCanvas.selectMountLayer(index);
  }

  public addAnimationMountPoint() {
    const animationData = this.selectedAnimationData;

    const frameLen = animationData.layerDict.size
      ? (Array.from(animationData.layerDict.values())[0] as AnimationLayer)
          .frameName.length
      : 0;
    (this.selectedLayer as AnimationMountLayer).addMountPoint(frameLen);
    this.updateSelectedAnimationData(animationData);
  }

  public deleteAnimationMountPoint(index: number) {
    const animationData = this.selectedAnimationData;
    animationData.mountLayer.deleteMountPoint(index);
    this.updateSelectedAnimationData(animationData);
  }

  public togglePlay(playStatus: boolean) {
    if (playStatus) {
      this.elementEditorCanvas.playAnimation();
    } else {
      this.elementEditorCanvas.stopAnimation();
    }
  }
}
