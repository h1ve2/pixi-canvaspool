import {ArrayOr, Assets, convertToList, DOMAdapter, Texture} from "pixi.js";

/**
 * Canvas资源池
 * 导入后将劫持 DOMAdapter.get().createCanvas
 * 需要手动调用remove或removeBundle销毁对应资源释放canvas
 */
class CanvasPoolClass {

    private pool: HTMLCanvasElement[] = [];

    constructor() {
        this.init();
    }

    /**
     * 初始化CanvasPool
     */
    public init() {
        // @ts-ignore
        DOMAdapter.get().createCanvas = (width: number, height: number): HTMLCanvasElement => {
            const canvas = CanvasPool.getCanvas();

            canvas.width = width;
            canvas.height = height;

            return canvas;
        }
    }

    /**
     * 从资源池获取一个canvas，如果没有可用canvas则创建新对象
     */
    public getCanvas(): HTMLCanvasElement {
        let canvas: HTMLCanvasElement;
        for (let i = 0; !canvas && i < this.pool.length; i++) {
            if (this.pool[i].dataset.active !== '1') {
                canvas = this.pool[i];
                // const context = canvas.getContext('2d');
                // context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        if (!canvas) {
            canvas = document.createElement('canvas');
            this.pool.push(canvas);
        }

        // console.log(this.pool.length)
        canvas.dataset.active = '1';
        return canvas;
    }

    /**
     * 销毁资源组对应的canvas对象
     * @param bundleIds 资源组ID
     */
    public destroyBundle(bundleIds: ArrayOr<string>) {
        bundleIds = convertToList<string>(bundleIds);

        const resolveResults = Assets.resolver.resolveBundle(bundleIds);

        Object.keys(resolveResults).map((bundleId) => {
            Object.keys(resolveResults[bundleId]).forEach(n => {
                this.destroy(resolveResults[bundleId][n].src);
            })
        });
    }

    /**
     * 销毁url对应的canvas对象
     * @param url 图片地址
     */
    public destroy(url: string) {
        const c = Assets.cache.get(url)
        if (!(c instanceof Texture)) return;
        const canvas = c.source.resource;
        if (!(canvas instanceof HTMLCanvasElement)) return;

        this.destoryCanvas(canvas);
    }

    /**
     * 释放canvas
     * @param canvas
     */
    public destoryCanvas(canvas: HTMLCanvasElement) {
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx && ctx.clearRect(0, 0, 1, 1);
        canvas.dataset.active = '0';
    }

    /**
     * 释放所有资源（慎用）
     */
    public destroyAll() {
        this.pool.forEach(n => {
            this.destoryCanvas(n);
        })
    }

}

/**
 * 全局唯一实例
 */
export const CanvasPool = new CanvasPoolClass();
