import { Vector } from "../vector";
import { Painter } from "./painter";

export abstract class Paintable {
    public abstract render(painter: Painter): void;
}

export class LineStyle {
    public width: number = 1;
    public color: string = "black";
    public cap: CanvasLineCap = "round";
    public join: CanvasLineJoin = "round";

    constructor(width?: number, color?: string, cap?: CanvasLineCap, join?: CanvasLineJoin) {
        if (width)
            this.width = width;
        if (color)
            this.color = color;
        if (cap)
            this.cap = cap;
        if (join)
            this.join = join;
    }
}

export class Line extends Paintable {
    constructor(public verteces: [from: Vector, to: Vector, ...rest: Vector[]], public stroke: LineStyle = new LineStyle) {
        super();
    }

    public override render(painter: Painter): void {
        painter.start()

        painter.setStroke(this.stroke.width, this.stroke.color, this.stroke.cap, this.stroke.join);

        painter.moveTo(this.verteces[0]);
        for (let i = 1; i < this.verteces.length; i++)
            painter.lineTo(this.verteces[i]);

        painter.end();
    }
}

export class Polygon extends Paintable {
    constructor(public verteces: Vector[], public fill?: string, public stroke?: LineStyle) {
        super();
    }

    public override render(painter: Painter): void {
        painter.start()

        if (this.fill)
            painter.setFillColor(this.fill);
        if (this.stroke)
            painter.setStroke(this.stroke.width, this.stroke.color, this.stroke.cap, this.stroke.join);

        painter.moveTo(this.verteces[0]);
        for (let i = 1; i < this.verteces.length; i++)
            painter.lineTo(this.verteces[i]);
        painter.lineTo(this.verteces[0]);

        painter.end();
    }
}