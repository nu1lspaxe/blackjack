import { Operand } from "./operator";

export class Vector extends Operand {
    public data: number[];

    public get x(): number {
        return this.data[0] ?? 0;
    }

    public get y(): number {
        return this.data[1] ?? 0;
    }

    public get z(): number {
        return this.data[2] ?? 0;
    }

    public get w(): number {
        return this.data[3] ?? 0;
    }

    public get length(): number {
        return Math.sqrt(this.data.reduce((sum, x) => sum + x * x, 0));
    }


    constructor(...data: number[]) {
        super();
        this.data = [...data];
    }

    public static Zero = new Vector(0, 0);

    static scale(scaler: number, vector: Vector): Vector {
        return new Vector(...vector.data.map(x => scaler * x));
    }

    static normalize(vector: Vector): Vector {
        const length = vector.length;
        return new Vector(...vector.data.map(x => x / length));
    }

    static vectorAdd(vectorA: Vector, vectorB: Vector): Vector {
        const data: number[] = [];
        const length = Math.max(vectorA.data.length, vectorB.data.length);
        for (let i = 0; i < length; i++)
            data.push((vectorA.data[i] ?? 0) + (vectorB.data[i] ?? 0));
        return new Vector(...data);
    }

    static vectorSubtract(vectorA: Vector, vectorB: Vector): Vector {
        const data: number[] = [];
        const length = Math.max(vectorA.data.length, vectorB.data.length);
        for (let i = 0; i < length; i++)
            data.push((vectorA.data[i] ?? 0) - (vectorB.data[i] ?? 0));
        return new Vector(...data);
    }

    static dotProduct(vectorA: Vector, vectorB: Vector): number {
        let sum = 0;
        for (let i = Math.min(vectorA.data.length, vectorB.data.length) - 1; i >= 0; i--)
            sum += vectorA.data[i] * vectorB.data[i];
        return sum;
    }

    static add(valueA: any, valueB: any): Vector {
        if (valueA instanceof Vector && valueB instanceof Vector)
            return Vector.vectorAdd(valueA, valueB);
        throw new Vector.UnsupportOperandError('`Add` is not supported');
    }

    static subtract(valueA: any, valueB: any): Vector {
        if (valueA instanceof Vector && valueB instanceof Vector)
            return Vector.vectorSubtract(valueA, valueB);
        throw new Vector.UnsupportOperandError('`Subtract` is not supported');
    }

    static multiply(valueA: any, valueB: any): Vector {
        if (valueA instanceof Vector && typeof valueB === "number")
            return Vector.scale(valueB, valueA);
        else if (typeof valueA && valueB instanceof Vector)
            return Vector.scale(valueA, valueB);
        throw new Vector.UnsupportOperandError('`Multiply` is not supported');
    }

    static divide(valueA: any, valueB: any): Vector {
        if (valueA instanceof Vector && typeof valueB === "number")
            return Vector.scale(1 / valueB, valueA);
        throw new Vector.UnsupportOperandError('`Divide` is not supported');
    }
}

Object.assign(globalThis, { Vector });