import { Vector } from "../vector";

export interface Painter {

    start(): this;
    end(): this;

    setFillColor(color: string): this;

    setStroke(width: number, color?: string, cap?: CanvasLineCap, join?: CanvasLineJoin): this;

    moveTo(position: Vector): this;
    lineTo(position: Vector): this;
}

export class CanvasPainter implements Painter {
    private context: CanvasRenderingContext2D;

    private drawStrokes: boolean = false;
    private drawFills: boolean = false;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    start(): this {
        this.context.beginPath();
        this.drawFills = false;
        this.drawStrokes = false;
        return this;
    }

    end(): this {
        if (this.drawFills)
            this.context.fill();
        if (this.drawStrokes)
            this.context.stroke();
        this.context.closePath();
        return this;
    }
    
    setFillColor(color: string): this {
        this.context.fillStyle = color;
        this.drawFills = true;
        return this;
    }

    setStroke(width: number, color: string = 'black', cap: CanvasLineCap = "round", join: CanvasLineJoin = "round"): this {
        this.context.lineWidth = width;
        this.context.strokeStyle = color;
        this.context.lineJoin = join;
        this.context.lineCap = cap;
        this.drawStrokes = true;
        return this;
    }

    moveTo(position: Vector): this {
        this.context.moveTo(position.x, position.y);
        return this;
    }

    lineTo(position: Vector): this {
        this.context.lineTo(position.x, position.y);
        return this;
    }
}