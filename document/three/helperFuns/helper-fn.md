---
title: Three & R3F常用函数
---

## 1.在 Three.js 和 R3F 环境下比较两个模型的距离函数

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
  ![full.png](/images/full.png "整体")

- 放大
  ![full.png](/images/part.png "聚焦")

## 2.在 Three.js 中

当动态的添加模型，就无法添加模型点击事件，故封装 hooks 函数用来模拟识别点击的模型以及点击事件回调

### 代码示例

```javascript
import { useThree } from "@react-three/fiber";
import { Vector2, Raycaster } from "three";
import { useRef, useEffect, useCallback, useMemo } from "react";
import * as THREE from "three";

/**
 * @description 用户返回点击模型后返回触发的事件
 * @param {{
 *  maxDistance?: number,
 *  modelFilter?: (object: THREE.Object3D) => THREE.Object3D,
 *  eventThrottle?: number,
 *  disable?: boolean,
 *  onClick?: (event: { type: 'single' | 'double', object: THREE.Object3D | null }) => void,
 *  doubleClickInterval?: number
 * }} options
 */
const useRaycastClosest = (options = {}) => {
  const { camera, scene, size } = useThree();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2()); // 点击的坐标
  const lastClickTime = useRef(0); // 用于判断双击的时间戳
  const clickTimeout = useRef(null); // 用于判断双击的Timeout
  const lastCall = useRef(0); // 用于节流
  // 记录按下的点，用于判断单击双击且用户没有移动鼠标
  const dragState = useRef({
    startX: 0,
    startY: 0,
  });
  /**
   * @description
   * 检测固定Node THREE.Object3D 下的物体，减少检测层级，优化性能
   */
  const baseSceneChildren = useMemo(() => {
    const baseSceneIndex = scene.children.length - 1;
    const baseScene = scene.children[baseSceneIndex] || scene;
    return baseScene.children;
  }, [scene]);
  /**
   * @description
   * 用于获取点击的是那个模型
   */
  const getIntersectedObject = useCallback(
    (event) => {
      const now = Date.now();
      //节流：点击的时间间隔小于某个值不触发
      if (now - lastCall.current < (options.eventThrottle ?? 100)) return null;
      const { width, height } = size;
      const rect = event.target.getBoundingClientRect();
      /**
       * @description
       * 浏览器的坐标为左上角为原点，跟WebGL有差别，所以需要计算转化 ：
       * mouse.current.x （（当前的点击位置clientX - canvas距离左边的位置）/ canvas的宽度 ） 获取到点击X Axis的百分比位置（0~1） * 2 -1  轴映射到 [-1, 1]
       * mouse.current.y  y 要取负值，因为 WebGL 向上为正，和 HTML 坐标系相反:
       *  -（（当前的点击位置clientY - canvas距离上边的位置）/ canvas的高度） 获取到点击Y Axis的百分比位置（0~1） * 2 + 1  轴映射到 [-1, 1]
       * 这样即可得到 以canvas的中心为原点的坐标轴转化
       * @example
       * 比如 Canvas 全屏，即left=0 top=0 ，浏览器宽度1000 高度500  clientX = 600  clientY = 400
       * mouse.current.x = （（ 600 - 0 ）/ 1000 ）* 2 - 1 = 0.2
       * mouse.current.y = -（（ 400 - 0 ）/ 500 ）* 2 + 1 = -0.6
       * 点击的位置在 以canvas的中心为原点的坐标轴的右下角区域第四象限
       */
      mouse.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(
        baseSceneChildren,
        true
      );
      //根据判断找到最近的模型并返回
      for (let index = 0; index < intersects.length; index++) {
        const validDistance =
          intersects[index].distance < (options?.maxDistance ?? Infinity);
        const validObject = options?.modelFilter(intersects[index].object);
        if (validDistance && validObject) return validObject;
      }
      return null;
    },
    [camera, baseSceneChildren, size, options]
  );

  const getWorldPosition = useCallback(
    (event) => {
      // 标准化鼠标坐标
      const mouse = new THREE.Vector2(
        (event.clientX / size.width) * 2 - 1,
        -(event.clientY / size.height) * 2 + 1
      );

      // const raycaster = new THREE.Raycaster();
      raycaster.current.setFromCamera(mouse, camera);

      // 用一个平面来接射线（假设是水平地面，Y=0）
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(plane, intersection);

      return intersection;
    },
    [camera, size]
  );
  /**
   * @description
   * 监听 "click", "pointerdown" 事件并作处理
   */
  const handleClick = useCallback(
    (event) => {
      if (options.disable) return;
      //鼠标按下记录下当前的 clientX clientY
      if (event.type === "pointerdown") {
        dragState.current = {
          startX: event.clientX,
          startY: event.clientY,
        };
        return null;
      }
      //鼠标pointerup 这里用click是因为pointerup的触发实际跟理想不符合，使用click模拟pointerup
      if (event.type === "click") {
        const { clientX, clientY } = event;
        const { startX, startY } = dragState.current;
        /**
         * @description
         * 如果 在pointerdown得到的 clientX clientY 与当前的 "click" 的clientX clientY 不相等；
         * 就代表用户触发 "pointerdown" 后一直长按 没松手，说明用户是在旋转场景，这个时候我们就不触发。
         * ~~ 相当于 Math.floor(number) 舍弃小数，向下取整。
         */
        if (~~clientX !== ~~startX || ~~clientY !== ~~startY) {
          return null;
        }
      }
      const currentObject = getIntersectedObject(event);
      const worldPos = getWorldPosition(event);
      const now = Date.now();
      const doubleClickInterval = options.doubleClickInterval ?? 300; // 双击的间隔时间
      // 触发传入的回掉函数 并返回指定的数据 以及类型
      if (now - lastClickTime.current < doubleClickInterval) {
        clearTimeout(clickTimeout.current);
        options.onClick?.({
          type: "double",
          object: currentObject,
          mouseClient: {
            clientX: dragState.current.startX,
            clientY: dragState.current.startY,
          },
          worldPos: worldPos,
        });
      } else {
        clickTimeout.current = setTimeout(() => {
          options.onClick?.({
            type: "single",
            object: currentObject,
            mouseClient: {
              clientX: dragState.current.startX,
              clientY: dragState.current.startY,
            },
            worldPos: worldPos,
          });
        }, doubleClickInterval);
      }

      lastClickTime.current = now;
    },
    [options, getIntersectedObject]
  );

  /**
   * @description
   * 注册 监听 "click", "pointerdown" 事件的触发
   */
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas || options.disable) return;
    const eventTypes = ["click", "pointerdown"];
    eventTypes.forEach((type) => {
      canvas.addEventListener(type, handleClick);
    });
    // 在副作用函数里面清除监听，防止内存泄漏，影响性能
    return () => {
      eventTypes.forEach((type) => {
        canvas.removeEventListener(type, handleClick);
      });
    };
  }, [handleClick, options]);

  return null;
};

export default useRaycastClosest;
```

### 如何使用

在当前页面代码的顶层使用即可

```javascript
/**
 * @description
 * 射线检测
 */
useRaycastClosest({
  maxDistance: 50,
  scene: "", //THREE.js 中的 scene 数据（json）
  //添加自己的过滤条件
  modelFilter: (obj) => {
    const _filterData = (data) => {
      if (!data) return null;
    };
    const data = _filterData(obj);
    return data;
  },
  // type: 单击|双击 ；object ： 点击的模型  ；worldPos ：点击的世界坐标THREE.Vector3
  onClick: ({ type, object, worldPos }) => {
    console.log(`${type} event:`, object?.name);
    if (!object) return;
    //双击
    if (type === "double") {
    }
    //单击
    if (type === "single") {
    }
  },
});
```

## 3. 配合 2 触发相机聚焦模型

- 需要使用 gsap 动画库

```javascript
const { camera } = useThree();
/**
 * @description
 * 单击双击模型处理的事件
 * @param {THREE.Object3D} model 要处理的模型
 */
const handleModelEvent = (model, isUpdateBound = true) => {
  // e.stopPropagation();
  if (model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetCameraPos = new THREE.Vector3(
      center.x,
      center.y + maxDim,
      center.z + maxDim * 2
    );
    const startQuaternion = camera.quaternion.clone();
    camera.lookAt(center);
    const targetQuaternion = camera.quaternion.clone();
    camera.quaternion.copy(startQuaternion);
    gsap.to(camera.position, {
      x: targetCameraPos.x,
      y: targetCameraPos.y,
      z: targetCameraPos.z,
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(camera.quaternion, {
      x: targetQuaternion.x,
      y: targetQuaternion.y,
      z: targetQuaternion.z,
      w: targetQuaternion.w,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        controls?.target.copy(center);
        controls?.update();
      },
    });
  }
};
```

## 4. 实现操作 Undo & Redo 功能

- 根据不同的类型添加不同的功能函数

### 封装统一基类

```javascript
/**
 * @class
 * 此类是所有操作Undo Redo 的基类，所有的Undo Redo的操作都继承此方法，重写部分方法进行操作。
 * 配合状态管理器中的  useCommandHistoryStore  进行管理 Undo/Redo 的栈。
 */
export default class Command {
  constructor() {
    this.id = performance.now();
  }
  execute() {}
  undo() {}
  redo() {
    this.execute();
  }
}
```

### 统一状态管理器

- 这里使用的是 zustand，也可以 Redux

```javascript
import { create } from "zustand";

/**
 * @description
 * 用来管理undo redo的操作
 */
const useCommandHistoryStore = create((set, get) => ({
  undoStack: [],
  redoStack: [],
  maxSteps: 100, //存最大的栈数
  commandId: 0, // 此用作来检测用户undo redo 变化，可以进行监听

  execute: (command) => {
    command.execute();
    set((state) => ({
      undoStack: [...state.undoStack.slice(-state.maxSteps + 1), command],
      redoStack: [],
    }));
  },

  undo: () => {
    const { undoStack, redoStack, commandId } = get();
    if (undoStack.length === 0) return;

    const lastCommand = undoStack[undoStack.length - 1];
    lastCommand.undo();
    const timeid =
      commandId === lastCommand.id ? performance.now() : lastCommand.id;

    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, lastCommand],
      commandId: timeid,
    });
  },

  redo: () => {
    const { undoStack, redoStack, commandId } = get();
    if (redoStack.length === 0) return;

    const nextCommand = redoStack[redoStack.length - 1];
    nextCommand.redo();
    const timeid =
      commandId === nextCommand.id ? performance.now() : nextCommand.id;
    set({
      undoStack: [...undoStack, nextCommand],
      redoStack: redoStack.slice(0, -1),
      commandId: timeid.id,
    });
  },
}));

export default useCommandHistoryStore;
```

### 增加模型的实现

```javascript
import Command from "./Command";
/**
 * @class 增加模型
 * 继承Command类，重写constructor() execute() undo() 实现自己的逻辑
 */
class SetAddModelCommand extends Command {
  constructor(object, model) {
    super();
    this.object = object;
    this.model = model;
  }
  execute() {
    this.object.add(this.model);
  }
  undo() {
    this.object.remove(this.model);
  }
}
export default SetAddModelCommand;
```

### 删除模型的实现

```javascript
import Command from "./Command";
/**
 * @class 删除模型
 * 继承Command类，重写constructor() execute() undo() 实现自己的逻辑
 */
class SetDeleteModelCommand extends Command {
  constructor(object, model) {
    super();
    this.object = object;
    this.model = model;
  }
  execute() {
    this.object.remove(this.model);
  }
  undo() {
    this.object.add(this.model);
  }
}
export default SetDeleteModelCommand;
```

### Transform 的实现

```javascript
import Command from "./Command";
/**
 * @class 模型 Transform 变化
 * 继承Command类，重写constructor() execute() undo() 实现自己的逻辑
 */
class SetTransformCommand extends Command {
  constructor(object, oldState, newState) {
    super();
    this.object = object;
    this.oldState = {
      position: oldState.position.clone(),
      rotation: oldState.rotation.clone(),
      scale: oldState.scale.clone(),
    };
    this.newState = {
      position: newState.position.clone(),
      rotation: newState.rotation.clone(),
      scale: newState.scale.clone(),
    };
  }

  execute() {
    this.object.position.copy(this.newState.position);
    this.object.rotation.copy(this.newState.rotation);
    this.object.scale.copy(this.newState.scale);
    this.object.updateMatrixWorld();
  }

  undo() {
    this.object.position.copy(this.oldState.position);
    this.object.rotation.copy(this.oldState.rotation);
    this.object.scale.copy(this.oldState.scale);
    this.object.updateMatrixWorld();
  }
}
export default SetTransformCommand;
```

### 显示隐藏的实现

```javascript
import Command from "./Command";
/**
 * @class 模型的显示隐藏
 * 继承Command类，重写constructor() execute() undo() 实现自己的逻辑
 */
class SetVisableModelCommand extends Command {
  constructor(object, visible) {
    super();
    this.object = object;
    this.visible = visible;
  }
  execute() {
    this.object.visible = this.visible;
  }
  undo() {
    this.object.visible = !this.visible;
  }
}
export default SetVisableModelCommand;
```

### 使用示例
- execute 需要从状态管理器中引入
- 你想要支持的就需要用封装好的来进行操作，这样既可Undo Redo
- 想支持其他的也是以此类推
```javascript
//增加模型 addModel & parentModel : THREE.Object3D ; parentModel是addModel父级
execute(new SetAddModelCommand(addModel, parentModel));
//删除模型 deleteModel & parentModel : THREE.Object3D ;parentModel是deleteModel父级
execute(new SetDeleteModelCommand(deleteModel, parentModel));
/**
*  currentModel ： THREE.Object3D
*  preTransform ：在移动模型之前记录当前的值 
*  nextTransform ：移动结束的值
*    position & scale : THREE.Vector3  
*    rotation: THREE.Euler
*  一定要使用clone的值，否者将会错乱
*  preTransform:{
*    position: xxx.position.clone(),
*    rotation: xxx.rotation.clone(),
*    scale: xxx.scale.clone(),
*  }
*  nextTransform:{
*    position: xxx.position.clone(),
*    rotation: xxx.rotation.clone(),
*    scale: xxx.scale.clone(),
*  }
 */
execute(
  new SetTransformCommand(currentModel, preTransform, nextTransform)
);
//设置模型的显示与隐藏
execute(new SetVisableModelCommand(currentModel, !currentModel.visible));

//直接调用方法undo() redo()
const { undo, redo } = useCommandHistoryStore();
```
