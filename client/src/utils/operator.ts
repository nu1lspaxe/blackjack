export abstract class Operand {

    static add(_valueA: any, _valueB: any) {
        throw new Operand.UnsupportOperandError('`Add` operator is not supported.');
    }
    static subtract(_valueA: any, _valueB: any) {
        throw new Operand.UnsupportOperandError('`Subtract` operator is not supported.');
    }

    static multiply(_valueA: any, _valueB: any) {
        throw new Operand.UnsupportOperandError('`Multiply` operator is not supported.');
    }

    static divide(_valueA: any, _valueB: any) {
        throw new Operand.UnsupportOperandError('`Divide` operator is not supported.');
    }

    static ValueError = class ValueError extends Error {

    }

    static UnsupportOperandError = class ValueError extends Error {

    }
}

export class Operator {

    static unitElement: symbol;

    static add(valueA: any, valueB: any) {
        if (valueA === Operator.unitElement)
            return valueB;
        if (valueB === Operator.unitElement)
            return valueA;

        if (valueA instanceof Operand) {
            try {
                return (valueA.constructor as typeof Operand).add(valueA, valueB);
            }
            catch (e) {
                if (!(e instanceof Operand.UnsupportOperandError))
                    throw e;
            }
        }
        if (valueB instanceof Operand) {
            try {
                return (valueB.constructor as typeof Operand).add(valueA, valueB);
            }
            catch (e) {
                if (!(e instanceof Operand.UnsupportOperandError))
                    throw e;
            }
        }

        return valueA + valueB;
    }
    static subtract(valueA: any, valueB: any) {
        if (valueA === Operator.unitElement)
            return valueB;
        if (valueB === Operator.unitElement)
            return valueA;
        
        if (valueA instanceof Operand) {
            try {
                return (valueA.constructor as typeof Operand).subtract(valueA, valueB);
            }
            catch (e) {
                if (!(e instanceof Operand.UnsupportOperandError))
                    throw e;
            }
        }
        if (valueB instanceof Operand) {
            try {
                return (valueB.constructor as typeof Operand).subtract(valueA, valueB);
            }
            catch (e) {
                if (!(e instanceof Operand.UnsupportOperandError))
                    throw e;
            }
        }

        return valueA - valueB;
    }
    
    static multiply(valueA: any, valueB: any) {
        if (valueA === Operator.unitElement)
            return valueB;
        if (valueB === Operator.unitElement)
            return valueA;
        
        if (valueA instanceof Operand) {
            try {
                return (valueA.constructor as typeof Operand).multiply(valueA, valueB);
            }
            catch (e) {
                if (!(e instanceof Operand.UnsupportOperandError))
                    throw e;
            }
        }
        if (valueB instanceof Operand) {
            try {
                return (valueB.constructor as typeof Operand).multiply(valueA, valueB);
            }
            catch (e) {
                if (!(e instanceof Operand.UnsupportOperandError))
                    throw e;
            }
        }

        return valueA * valueB;
    }
    
    static divide(valueA: any, valueB: any) {
        if (valueA === Operator.unitElement)
            return valueB;
        if (valueB === Operator.unitElement)
            return valueA;
        
        if (valueA instanceof Operand) {
            try {
                return (valueA.constructor as typeof Operand).divide(valueA, valueB);
            }
            catch (e) {
                if (!(e instanceof Operand.UnsupportOperandError))
                    throw e;
            }
        }
        if (valueB instanceof Operand) {
            try {
                return (valueB.constructor as typeof Operand).divide(valueA, valueB);
            }
            catch (e) {
                if (!(e instanceof Operand.UnsupportOperandError))
                    throw e;
            }
        }

        return valueA / valueB;
    }
}