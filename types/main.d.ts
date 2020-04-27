interface anyObject<T=any> {
    [prop: string]: T;
}
interface CanvasContextEx extends CanvasRenderingContext2D {
    drawGIF: any
}