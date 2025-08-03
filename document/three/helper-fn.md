---
title: 对比模型
---

## 在 Three.js 和 R3F 环境下比较两个模型的距离函数
### 代码示例
```javascript
import { useRef, useEffect } from "react";
import * as THREE from "three";
/**
 * @returns {[displayModelHelper, refreshModelHelper, setOptions]}
 * - `displayModelHelper`: 显示模型辅助工具，测量功能
 *     - `model` ： 测量模型
 *     - `compareModel` ： 对比模型
 * - `refreshModelHelper`: 根据当前模型数据刷新辅助工具显示
 * - `setOptions`: 设置辅助工具的可配置项（如颜色、尺寸、文字等）
 * @example  解构取值
 * const [displayModelHelper, refreshModelHelper, setOptions] = useDisplayModelHelper();
 */
const useDisplayModelHelper = () => {
  const helperRef = useRef(); // 生成的辅助工具的引用 其都存在一个Group（group.name = "Measure"） 下面
  const helperRefParentRef = useRef(); // 记录把 helperRef 辅助工具加载到那个Node层级下面的Node层级；也就是 helperRef 的父级
  const refreshModelRef = useRef(); // 测量模型
  const refreshCompareModelRef = useRef(); // 对比模型
  /**
   * @property {Object}  options
   * 通过 setOptions 配置辅助工具的样式，文字，字体等
   */
  let options = {
    joinNode: null, // 让辅助工具 helperRef 加入到那个Node层级
    isChildren: false, // 是否让辅助工具 helperRef 为 `model` 测量模型的子元素 ，默认为false，默认加入到同一层级，为兄弟元素，避免受到model的scale影响。
    unit: "mm", // 配置单位
    /**
     * @description
     * 配置对比线的 `线` 的各种属性
     */
    distanceLine: {
      color: "#fff",
      dashSize: 0.1,
      gapSize: 0.1,
      descColor: "green",
      leftDesc: "Left:",
      rightDesc: "Right:",
      topDesc: "Top:",
      bottomDesc: "Bottom:",
      frontDesc: "Front:",
      backDesc: "Back:",
    },
    /**
     * @description
     * 配置对比线的 `圆锥箭头` 的各种属性
     */
    coneArrow: {
      radius: 5,
      height: 20,
      radialSegments: 32,
      color: "#fff",
      scale: 0.01,
      offset: 0.09,
    },
    /**
     * @description
     * 配置 `model` 测量模型的box描边各种属性
     */
    modelBox: {
      color: "#fff",
      wDesc: "W:",
      hDesc: "H:",
      dDesc: "D:",
      descColor: "green",
    },
  };
  /**
   * @description
   * 清理显示出来的辅助工具
   */
  const _clearHelpers = () => {
    if (helperRef.current) {
      helperRefParentRef.current.remove(helperRef.current.group);
      helperRef.current.group.traverse((child) => {
        if (child.material) child.material.dispose();
      });
      helperRef.current.group.parent.remove(helperRef.current.group);
      helperRefParentRef.current = null;
      helperRef.current = null;
      refreshModelRef.current = null;
      refreshCompareModelRef.current = null;
    }
  };
  /**
   * @description
   * 获取提示工具的大小，一般是文字获取的Scale
   * @param {baseRatio} 基础缩放比例
   * @param {axisRatio} xyz axis 缩放比例
   * @param {value} 基本大小
   * @returns {THREE.Vector3}
   */
  const _getPromptScale = (baseRatio, axisRatio, value) => {
    const [xRatio, yRatio, zRatio] = baseRatio;
    const { x, y, z } = axisRatio;
    if (options.isChildren) {
      const newValue = Math.max(1, Math.abs(value || 1));
      return new THREE.Vector3(
        xRatio * newValue * (1 / x),
        yRatio * newValue * (1 / y),
        zRatio * newValue * (1 / z)
      );
    } else {
      const size = Math.abs(value || 1);
      let newValue = size;
      if (size <= 5) {
        newValue = 4;
      }
      if (size <= 10 && size > 5) {
        newValue = 8;
      }
      if (size <= 20 && size > 10) {
        newValue = 16;
      }
      if (size <= 30 && size > 20) {
        newValue = 50;
      }
      return new THREE.Vector3(
        xRatio * Math.max(1, 1 / x) * newValue,
        yRatio * Math.max(1, 1 / y) * newValue,
        zRatio * Math.max(1, 1 / z) * newValue
      );
    }
  };
  /**
   * @param {THREE.Object3D} model 获取模型的box、大小、中心点信息
   * @returns {{ THREE.Box3 ,  THREE.Vector3 , THREE.Vector3 }}
   */
  const _getModelInfo = (model) => {
    const modelBox = new THREE.Box3().setFromObject(model);
    const modelSize = new THREE.Vector3();
    const modelCenter = new THREE.Vector3();
    modelBox.getSize(modelSize);
    modelBox.getCenter(modelCenter);
    return { modelBox, modelCenter, modelSize };
  };
  /**
   * @description 画出一个两个点之间的距离线，箭头，描述文字
   * @param {Object} item 画出测量辅助线的各种参数
   * @returns {THREE.Group}
   */
  const _distanceLinePrompt = (item) => {
    const group = new THREE.Group();
    const material = new THREE.LineDashedMaterial({
      color: options.distanceLine.color,
      dashSize: options.distanceLine.dashSize,
      gapSize: options.distanceLine.gapSize,
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(
      item.linePosition
    );
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    const prompt = _createTextPrompt(
      item.text,
      item.centerVector,
      item.scaleVector,
      options.distanceLine.descColor
    );
    const coneGeometry = new THREE.ConeGeometry(
      options.coneArrow.radius,
      options.coneArrow.height,
      options.coneArrow.radialSegments
    );
    const materialGeometry = new THREE.MeshBasicMaterial({
      color: options.coneArrow.color,
    });
    const cone1 = new THREE.Mesh(coneGeometry, materialGeometry);
    cone1.position.copy(item.conePosition[0]);
    cone1.rotation.copy(item.coneRotate[0]);
    cone1.scale.copy(item.coneScale);
    const cone2 = new THREE.Mesh(coneGeometry, materialGeometry);
    cone2.position.copy(item.conePosition[1]);
    cone2.rotation.copy(item.coneRotate[1]);
    cone2.scale.copy(item.coneScale);
    group.add(line);
    group.add(prompt);
    group.add(cone1);
    group.add(cone2);
    return group;
  };
  /**
   * @description 根据测量模型和对比模型的参数数据，得到 _distanceLinePrompt 所需要的参数
   * @param {THREE.Object3D} model
   * @param {THREE.Object3D} compareModel
   * @returns {Array<THREE.Object3D>}
   */
  const _calcCreatePrompt = (model, compareModel) => {
    const { modelBox, modelCenter } = _getModelInfo(model);
    const { modelBox: boxCompare } = _getModelInfo(compareModel);
    const { x, y, z } = model.scale;
    const coneScale = new THREE.Vector3(
      options.coneArrow.scale,
      options.coneArrow.scale,
      options.coneArrow.scale
    );
    const data = [
      {
        text: `${options.distanceLine.leftDesc}${(
          modelBox.min.x - boxCompare.min.x
        ).toFixed(2)}${options.unit}`,
        type: "left",
        linePosition: [
          new THREE.Vector3(modelBox.min.x, modelCenter.y, modelCenter.z),
          new THREE.Vector3(boxCompare.min.x, modelCenter.y, modelCenter.z),
        ],
        conePosition: [
          new THREE.Vector3(
            modelBox.min.x - options.coneArrow.offset,
            modelCenter.y,
            modelCenter.z
          ),
          new THREE.Vector3(
            boxCompare.min.x + options.coneArrow.offset,
            modelCenter.y,
            modelCenter.z
          ),
        ],
        coneRotate: [
          new THREE.Euler(0, 0, -Math.PI / 2),
          new THREE.Euler(0, 0, Math.PI / 2),
        ],
        coneScale,
        centerVector: new THREE.Vector3(
          (modelBox.min.x + boxCompare.min.x) / 2,
          modelCenter.y,
          modelCenter.z
        ),
        scaleVector: _getPromptScale(
          [0.25, 0.125, 0.5],
          { x, y, z },
          modelBox.min.x - boxCompare.min.x
        ),
      },
      {
        text: `${options.distanceLine.rightDesc}${(
          boxCompare.max.x - modelBox.max.x
        ).toFixed(2)}${options.unit}`,
        type: "right",
        linePosition: [
          new THREE.Vector3(modelBox.max.x, modelCenter.y, modelCenter.z),
          new THREE.Vector3(boxCompare.max.x, modelCenter.y, modelCenter.z),
        ],
        conePosition: [
          new THREE.Vector3(
            modelBox.max.x + options.coneArrow.offset,
            modelCenter.y,
            modelCenter.z
          ),
          new THREE.Vector3(
            boxCompare.max.x - options.coneArrow.offset,
            modelCenter.y,
            modelCenter.z
          ),
        ],
        coneRotate: [
          new THREE.Euler(0, 0, Math.PI / 2),
          new THREE.Euler(0, 0, -Math.PI / 2),
        ],
        coneScale,
        centerVector: new THREE.Vector3(
          (modelBox.max.x + boxCompare.max.x) / 2,
          modelCenter.y,
          modelCenter.z
        ),
        scaleVector: _getPromptScale(
          [0.25, 0.125, 0.5],
          { x, y, z },
          modelBox.max.x - boxCompare.max.x
        ),
      },
      {
        text: `${options.distanceLine.topDesc}${(
          boxCompare.max.y - modelBox.max.y
        ).toFixed(2)}${options.unit}`,
        type: "top",
        linePosition: [
          new THREE.Vector3(modelCenter.x, modelBox.max.y, modelCenter.z),
          new THREE.Vector3(modelCenter.x, boxCompare.max.y, modelCenter.z),
        ],
        conePosition: [
          new THREE.Vector3(
            modelCenter.x,
            modelBox.max.y + options.coneArrow.offset,
            modelCenter.z
          ),
          new THREE.Vector3(
            modelCenter.x,
            boxCompare.max.y - options.coneArrow.offset,
            modelCenter.z
          ),
        ],
        coneRotate: [new THREE.Euler(0, 0, -Math.PI), new THREE.Euler(0, 0, 0)],
        centerVector: new THREE.Vector3(
          modelCenter.x,
          (modelBox.max.y + boxCompare.max.y) / 2,
          modelCenter.z
        ),
        coneScale,
        scaleVector: _getPromptScale(
          [0.25, 0.125, 0.5],
          { x, y, z },
          modelBox.max.y - boxCompare.max.y
        ),
      },
      {
        text: `${options.distanceLine.bottomDesc}${(
          modelBox.min.y - boxCompare.min.y
        ).toFixed(2)}${options.unit}`,
        type: "bottom",
        linePosition: [
          new THREE.Vector3(modelCenter.x, modelBox.min.y, modelCenter.z),
          new THREE.Vector3(modelCenter.x, boxCompare.min.y, modelCenter.z),
        ],
        conePosition: [
          new THREE.Vector3(
            modelCenter.x,
            modelBox.min.y - options.coneArrow.offset,
            modelCenter.z
          ),
          new THREE.Vector3(
            modelCenter.x,
            boxCompare.min.y + options.coneArrow.offset,
            modelCenter.z
          ),
        ],
        coneRotate: [new THREE.Euler(0, 0, 0), new THREE.Euler(0, 0, Math.PI)],
        centerVector: new THREE.Vector3(
          modelCenter.x,
          (modelBox.min.y + boxCompare.min.y) / 2,
          modelCenter.z
        ),
        coneScale,
        scaleVector: _getPromptScale(
          [0.25, 0.125, 0.5],
          { x, y, z },
          modelBox.min.y - boxCompare.min.y
        ),
      },
      {
        text: `${options.distanceLine.frontDesc}${(
          modelBox.min.z - boxCompare.min.z
        ).toFixed(2)}${options.unit}`,
        type: "front",
        linePosition: [
          new THREE.Vector3(modelCenter.x, modelCenter.y, modelBox.min.z),
          new THREE.Vector3(modelCenter.x, modelCenter.y, boxCompare.min.z),
        ],
        conePosition: [
          new THREE.Vector3(
            modelCenter.x,
            modelCenter.y,
            modelBox.min.z - 0.09
          ),
          new THREE.Vector3(
            modelCenter.x,
            modelCenter.y,
            boxCompare.min.z + 0.09
          ),
        ],
        coneRotate: [
          new THREE.Euler(Math.PI / 2, 0, 0),
          new THREE.Euler(-Math.PI / 2, 0, 0),
        ],
        coneScale,
        centerVector: new THREE.Vector3(
          modelCenter.x,
          modelCenter.y,
          (modelBox.min.z + boxCompare.min.z) / 2
        ),
        scaleVector: _getPromptScale(
          [0.25, 0.125, 0.5],
          { x, y, z },
          modelBox.min.z - boxCompare.min.z
        ),
      },
      {
        text: `${options.distanceLine.backDesc}${(
          boxCompare.max.z - modelBox.max.z
        ).toFixed(2)}${options.unit}`,
        type: "back",
        linePosition: [
          new THREE.Vector3(modelCenter.x, modelCenter.y, modelBox.max.z),
          new THREE.Vector3(modelCenter.x, modelCenter.y, boxCompare.max.z),
        ],
        conePosition: [
          new THREE.Vector3(
            modelCenter.x,
            modelCenter.y,
            modelBox.max.z + 0.09
          ),
          new THREE.Vector3(
            modelCenter.x,
            modelCenter.y,
            boxCompare.max.z - 0.09
          ),
        ],
        coneRotate: [
          new THREE.Euler(-Math.PI / 2, 0, 0),
          new THREE.Euler(Math.PI / 2, 0, 0),
        ],
        coneScale,
        centerVector: new THREE.Vector3(
          modelCenter.x,
          modelCenter.y,
          (modelBox.max.z + boxCompare.max.z) / 2
        ),
        scaleVector: _getPromptScale(
          [0.25, 0.125, 0.5],
          { x, y, z },
          modelBox.max.z - boxCompare.max.z
        ),
      },
    ];
    const matrixInverse = new THREE.Matrix4().copy(model.matrixWorld).invert();
    const returnData = data.map((item) => {
      if (options.isChildren) {
        item.linePosition.map((point) => point.applyMatrix4(matrixInverse));
        item.conePosition.map((point) => point.applyMatrix4(matrixInverse));
        item.centerVector.applyMatrix4(matrixInverse);
      }
      const line = _distanceLinePrompt(item);
      line.renderOrder = 998;
      return line;
    });
    return returnData;
  };
  /**
   * @description 在指定位置画出文字提示内容
   * @param {String} text
   * @param {THREE.Vector3} position
   * @param {THREE.Vector3} scale
   * @param {THREE.Color} color
   * @returns {THREE.Sprite}
   */
  const _createTextPrompt = (text, position, scale, color) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const deviceRatio = window.devicePixelRatio || 1;
    const logicalWidth = 256 * 2;
    const logicalHeight = 128 * 2;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;
    canvas.width = logicalWidth * deviceRatio;
    canvas.height = logicalHeight * deviceRatio;
    ctx.scale(deviceRatio, deviceRatio);
    ctx.fillStyle = color;
    ctx.font = `${32 * deviceRatio}px IBM Plex Sans`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, logicalWidth / 2, logicalHeight / 2);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      depthTest: false,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.copy(scale);
    sprite.renderOrder = 999;
    return sprite;
  };
  /**
   * @description 画出测量模型的box 辅助描边线的文字描述
   * @param {THREE.Object3D} model
   * @returns  {Array<THREE.Object3D>}
   */
  const _createWDHPrompt = (model) => {
    const { modelBox, modelSize } = _getModelInfo(model);
    if (options.isChildren) {
      const inverseMatrix = new THREE.Matrix4()
        .copy(model.matrixWorld)
        .invert();
      modelBox.applyMatrix4(inverseMatrix);
    }
    const { x, y, z } = model.scale;
    const midPoint = new THREE.Vector3();
    midPoint.copy(modelBox.min).add(modelBox.max).multiplyScalar(0.5);
    const [w, h, d] = [
      modelBox.max.x - modelBox.min.x,
      modelBox.max.y - modelBox.min.y,
      modelBox.max.z - modelBox.min.z,
    ];
    const modelPixelRatio = (w + d + h) / 3;
    const spriteScale = _getPromptScale(
      options.isChildren ? [0.5, 0.25, 1] : [0.1, 0.05, 0.2],
      { x, y, z },
      modelPixelRatio
    );
    const retuenData = [
      _createTextPrompt(
        `${options.modelBox.wDesc}${(modelSize.x * x).toFixed(2)}${
          options.unit
        }`,
        new THREE.Vector3(midPoint.x, modelBox.max.y, modelBox.max.z),
        spriteScale,
        options.modelBox.descColor
      ),
      _createTextPrompt(
        `${options.modelBox.hDesc}${(modelSize.y * y).toFixed(2)}${
          options.unit
        }`,
        new THREE.Vector3(modelBox.max.x, midPoint.y, modelBox.max.z),
        spriteScale,
        options.modelBox.descColor
      ),
      _createTextPrompt(
        `${options.modelBox.dDesc}${(modelSize.z * z).toFixed(2)}${
          options.unit
        }`,
        new THREE.Vector3(modelBox.max.x, modelBox.max.y, midPoint.z),
        spriteScale,
        options.modelBox.descColor
      ),
    ];
    return retuenData;
  };
  /**
   * @description 画出测量模型的box 辅助描边线
   * @param {THREE.Object3D} model
   * @returns  {THREE.LineSegments}
   */
  const _createModelBoxHelper = (model) => {
    const modelBox = new THREE.Box3().setFromObject(model);
    if (options.isChildren) {
      const inverseMatrix = new THREE.Matrix4()
        .copy(model.matrixWorld)
        .invert();
      modelBox.applyMatrix4(inverseMatrix);
    }
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    modelBox.getSize(size);
    modelBox.getCenter(center);
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const edges = new THREE.EdgesGeometry(geometry);
    const boxLine = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: options.modelBox.color })
    );
    boxLine.position.copy(center);
    return boxLine;
  };
  /**
   * @description model - Loaded THREE.Object3D Object
   * @description compareModel - THREE.Object3D Object
   * @param {THREE.Object3D} model
   * @param {THREE.Object3D} compareModel
   * @returns {void}
   */
  const displayModelHelper = (model, compareModel) => {
    _clearHelpers();
    if (!model || !model.isObject3D) return;
    const group = new THREE.Group();
    group.name = "Measure";
    group.customizeType = "Helper";
    group.__autoCleanInfo = true;
    const boxLine = _createModelBoxHelper(model);
    group.add(boxLine);
    const dimensionLabels = _createWDHPrompt(model);
    dimensionLabels.forEach((label) => group.add(label));
    if (compareModel && model.uuid !== compareModel.uuid) {
      const positionLines = _calcCreatePrompt(model, compareModel);
      positionLines.forEach((line) => group.add(line));
    }
    helperRef.current = { group };
    if (options.isChildren) {
      model.add(group);
      helperRefParentRef.current = model;
    } else {
      (options?.joinNode || model.parent).add(group);
      helperRefParentRef.current = model.parent;
    }
    refreshModelRef.current = model;
    refreshCompareModelRef.current = compareModel;
  };
  /**
   * @description Configure the function to describe object attribute data.
   * @param {Object} optionsData
   * @example The options property of the current hooks.
   * @returns {void}
   */
  const setOptions = (optionsData) => {
    const { joinNode, unit, distanceLine, coneArrow, modelBox } = optionsData;
    const {
      isChildren: isChildrenD,
      unit: unitD,
      distanceLine: distanceLineD,
      coneArrow: coneArrowD,
      modelBox: modelBoxD,
    } = options;
    options = {
      joinNode: joinNode,
      isChildren: !!isChildrenD,
      unit: unit || unitD,
      distanceLine: {
        ...distanceLineD,
        ...distanceLine,
      },
      coneArrow: {
        ...coneArrowD,
        ...coneArrow,
      },
      modelBox: {
        ...modelBoxD,
        ...modelBox,
      },
    };
  };
  /**
   * @description 刷新辅助工具
   * @param {THREE.Object3D} focusModel
   * @param {THREE.Object3D} compareModel
   */
  const refreshModelHelper = (
    focusModel = refreshModelRef.current,
    compareModel = refreshCompareModelRef.current
  ) => {
    displayModelHelper(focusModel, compareModel);
  };
  /**
   * @description 引用此hoohs的组件在卸载的时候清除辅助工具
   */
  useEffect(() => {
    return () => {
      _clearHelpers();
    };
  }, []);
  return [displayModelHelper, refreshModelHelper, setOptions];
};
export default useDisplayModelHelper;
```

### 功能示意图
其中的线以及箭头，描边都是通过这个函数完成的

- 整体
![full.png](/full.png "整体")

- 放大
![full.png](/part.png "聚焦")