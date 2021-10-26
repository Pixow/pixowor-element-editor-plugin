import { Injectable } from '@angular/core';
import { PixoworCore } from 'pixowor-core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import {
  AnimationDataNode,
  AnimationLayer,
  AnimationMountLayer,
  ElementNode,
  IImage,
} from 'game-capsule';
import { Capsule } from 'game-capsule';
import * as fs from 'fs';
import * as path from 'path';
import { ElementEditorCanvas } from '@PixelPai/game-core';
import { nativeImage } from 'electron';

export const BLANK_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';

@Injectable({
  providedIn: 'root',
})
export class ElementEditorService {
  images$ = new BehaviorSubject<IImage[]>([]);
  private capsule$ = new BehaviorSubject<Capsule>(undefined);
  private element$ = new BehaviorSubject<ElementNode>(undefined);
  selectedLayer$ = new BehaviorSubject<AnimationLayer | AnimationMountLayer>(
    undefined
  );
  selectedAnimationData$ = new BehaviorSubject<AnimationDataNode>(undefined);
  elementEditorCanvas: ElementEditorCanvas = undefined;

  updateCapsule(capsule: Capsule) {
    this.capsule$.next(capsule);
  }

  public get capsule() {
    return this.capsule$.getValue();
  }

  updateElement(element: ElementNode) {
    this.element$.next(element);
  }

  getElement(): Observable<ElementNode> {
    return this.element$.asObservable();
  }

  public get element() {
    return this.element$.getValue();
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

  updateSelectedAnimationLayer(animationLayer: AnimationLayer) {
    this.selectedLayer$.next(animationLayer);
  }

  getSelectedAnimationLayer() {
    return this.selectedLayer$.asObservable();
  }

  public get selectedLayer() {
    return this.selectedLayer$.getValue();
  }

  public get images() {
    return this.images$.getValue();
  }

  constructor(private pixoworCore: PixoworCore) {}

  public initElement() {
    const { USER_DATA_PATH } = this.pixoworCore.settings;

    const capsule = new Capsule();

    fs.readFile(
      path.join(
        USER_DATA_PATH,
        'packages/elements/601fd448765b50025e3fbd25/1/601fd448765b50025e3fbd25.pi'
      ),
      (error, data) => {
        capsule.deserialize(new Uint8Array(data));
        console.log('Capsule: ', capsule);
        const element = capsule.root.children[0] as ElementNode;
        const defaultAniName = element.animations.defaultAnimation;
        const defaultAniData = element.animations.animationData.find(
          (aniData) => aniData.name === defaultAniName
        );
        const defaultAniLayer = Array.from(
          defaultAniData.layerDict.values()
        )[0];
        this.updateSelectedAnimationData(defaultAniData);
        this.updateSelectedAnimationLayer(defaultAniLayer);
        this.updateCapsule(capsule);
        this.updateElement(element);
      }
    );
  }

  setElementImages(images: IImage[]) {
    this.images$.next(images);
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

      const element = this.element$.getValue();

      element.animations.display.textureBuffer = imageBuffer;
      element.animations.display.dataJSON = json;
      this.elementEditorCanvas.reloadDisplayNode();
    });

    this.images$.next(images);
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

  public selectFrame() {}

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
}
