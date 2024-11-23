import { Operand, Operator } from "./operator";

export class Matrix<T> extends Operand {
    public rowCount: number;
    public columnCount: number;

    public data: T[];

    constructor(rowCount: number, columnCount: number, data: T[]) {
        super();
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.data = data;
    }

    public get(rowIndex: number, columnIndex: number): T {
        return this.data[rowIndex * this.columnCount + columnIndex];
    }

    public set(rowIndex: number, columnIndex: number, value: T): void {
        this.data[rowIndex * this.columnCount + columnIndex] = value;
    }

    static unitMatrix(size: number): Matrix<number> {

        const data: number[] = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                data.push(i === j ? 1 : 0);
            }
        }

        return new Matrix(size, size, data);
    }

    static scale<T>(scaler: number, matrix: Matrix<T>): Matrix<T> {
        return new Matrix(matrix.rowCount, matrix.columnCount, matrix.data.map(x => Operator.multiply(scaler, x)));
    }

    static matrixProduct<T>(matrixA: Matrix<T>, matrixB: Matrix<T>): Matrix<T> {
        if (matrixA.columnCount !== matrixB.rowCount)
            throw new Error("Matrix dimensions must match for matrix multiplication");

        const data: T[] = [];
        for (let i = 0; i < matrixA.rowCount; i++) {
            for (let j = 0; j < matrixB.columnCount; j++) {
                let value = Operator.unitElement as unknown as T;
                for (let k = 0; k < matrixA.columnCount; k++)
                    value = Operator.add(value, Operator.multiply(matrixA.get(i, k), matrixB.get(k, j)));
                data.push(value);
            }
        }

        return new Matrix(matrixA.rowCount, matrixB.columnCount, data);
    }

    static multiply(valueA: any, valueB: any): any {
        if (valueA instanceof Matrix && typeof valueB === "number")
            return Matrix.scale(valueB, valueA);
        else if (typeof valueA === "number" && valueB instanceof Matrix)
            return Matrix.scale(valueA, valueB);
        else if (valueA instanceof Matrix && valueB instanceof Matrix)
            return Matrix.matrixProduct(valueA, valueB);
        throw new Matrix.UnsupportOperandError('`Multiply` is not supported');
    }

    /**
     * Calculates the power of a square matrix.
     *
     * @template T - The type of elements in the matrix.
     * @param matrix - The square matrix to be raised to a power.
     * @param times - The power to which the matrix should be raised.
     * @throws Will throw an error if the matrix is not square.
     * @returns The result of raising the matrix to the specified power.
     *          If the power is 0, the unit matrix of the same size is returned.
     */
}

// globalThis.Matrix = Matrix; 
Object.assign(globalThis, { Matrix });