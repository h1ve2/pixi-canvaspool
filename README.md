# @h1ve2/pixi-canvaspool

Used to fix the resource restriction issue of PIXI in browsers such as Safari 11 that do not support Imagebitmap.

It can effectively avoid the situation where getContent ("2d") is null when using a large number of image resources.

> After import, CanvasPool will automatically inject DOMAdapter.get().createCanvas()
>
> Need to manually call destroy or destroyBundle to destroy the corresponding resource and release the canvas

## Usage
``` 
npm install "@h1ve2/pixi-canvaspool"
// yarn add "@h1ve2/pixi-canvaspool"
```
### Use Bundle (recommended)

```
import {CanvasPool} from "@h1ve2/pixi-canvaspool"
...

CanvasPool.destroyBundle(bundleId); // Proactively call to release canvas before uninstalling the resource group
Assets.unloadBundle(bundleId);
...
```

### Use url
```
import {CanvasPool} from "@h1ve2/pixi-canvaspool"
...
CanvasPool.destroy(url);
Assets.unload(url)
...
```