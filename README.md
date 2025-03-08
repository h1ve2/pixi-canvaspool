# @h1ve2/pixi-canvaspool

只是用来修复PIXI在safari11等不支持ImageBitmap的浏览器中的资源限制问题。

在使用大量图片资源时能够有效避免getContent("2d")为null的情况。

> 导入后将劫持 DOMAdapter.get().createCanvas()
>
> 需要手动调用remove或removeBundle销毁对应资源释放canvas

## 使用方法
### 使用Bundle (建议)

```
import {CanvasPool} from "@h1ve2/pixi-canvaspool"
...

CanvasPool.destroyBundle(bundleId); //在资源组卸载前主动调用以释放canvas
Assets.unloadBundle(bundleId);
...
```

### 使用url
```
import {CanvasPool} from "@h1ve2/pixi-canvaspool"
...
CanvasPool.destroy(url);
Assets.unload(url)
...
```