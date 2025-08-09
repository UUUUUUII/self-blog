---
title: 有趣的实现
---

## 1.旋转头像背景边框

### html

```html
<div className="icon">
  <img
    src=""
    alt="" />
</div>
```

### css

```css
@property --direction {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
@keyframes roate {
  to {
    --direction: 360deg;
  }
}
.icon {
  width: 136px;
  height: 136px;
  border-radius: 50%;
  position: relative;
  background-image: linear-gradient(
    var(--direction),
    #fcb945,
    #37e887 43%,
    #bb45ee
  );
  animation: roate 3s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 16px rgb(61, 61, 61);
  img {
    width: 128px;
    height: 128px;
    border-radius: 50%;
  }
}
```

### 示例

![旋转头像边框](/gifs/header_gif.gif "")