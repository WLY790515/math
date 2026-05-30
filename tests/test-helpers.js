class CalculatorTestHelper {
    constructor() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.history = [];
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
    }

    inputDigit(digit) {
        if (this.waitingForOperand) {
            this.currentValue = digit === '.' ? '0.' : String(digit);
            this.waitingForOperand = false;
        } else {
            if (digit === '.' && this.currentValue.includes('.')) return;
            this.currentValue = this.currentValue === '0' && digit !== '.'
                ? String(digit)
                : this.currentValue + digit;
        }
    }

    handleOperator(op) {
        const current = parseFloat(this.currentValue);

        if (this.previousValue !== '' && !this.waitingForOperand) {
            this.calculate();
        }

        this.operator = op;
        this.previousValue = this.currentValue;
        this.waitingForOperand = true;
    }

    calculate() {
        if (this.operator === null || this.previousValue === '') return null;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operator) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    return 'Error';
                }
                result = prev / current;
                break;
            case 'power':
                result = Math.pow(prev, current);
                break;
        }

        const expression = `${prev} ${this.getOperatorSymbol(this.operator)} ${current} =`;
        this.history.unshift({ expression, result });

        this.currentValue = String(result);
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = true;

        return result;
    }

    getOperatorSymbol(op) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[op] || op;
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
    }

    percent() {
        const current = parseFloat(this.currentValue);
        this.currentValue = String(current / 100);
        return parseFloat(this.currentValue);
    }

    scientificOperation(action, value) {
        const current = value !== undefined ? value : parseFloat(this.currentValue);

        switch (action) {
            case 'sin':
                return Math.sin(current * Math.PI / 180);
            case 'cos':
                return Math.cos(current * Math.PI / 180);
            case 'tan':
                return Math.tan(current * Math.PI / 180);
            case 'log':
                return Math.log10(current);
            case 'ln':
                return Math.log(current);
            case 'sqrt':
                return Math.sqrt(current);
            case 'pi':
                return Math.PI;
            case 'e':
                return Math.E;
        }
    }

    performCalculation(expression) {
        this.clear();
        const tokens = expression.split(' ');
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            if (!isNaN(token) || token === '.') {
                this.inputDigit(token);
            } else if (['+', '-', '*', '/', '^'].includes(token)) {
                const opMap = {
                    '+': 'add',
                    '-': 'subtract',
                    '*': 'multiply',
                    '/': 'divide',
                    '^': 'power'
                };
                this.handleOperator(opMap[token]);
            }
        }
        
        return this.calculate();
    }
}

class UnitConverterTestHelper {
    constructor() {
        this.units = {
            length: {
                meter: 1,
                kilometer: 0.001,
                centimeter: 100,
                millimeter: 1000,
                mile: 0.000621371,
                yard: 1.09361,
                foot: 3.28084,
                inch: 39.3701
            },
            area: {
                squareMeter: 1,
                squareKilometer: 0.000001,
                squareCentimeter: 10000,
                hectare: 0.0001,
                acre: 0.000247105,
                squareFoot: 10.7639,
                squareInch: 1550.0031
            },
            volume: {
                cubicMeter: 1,
                liter: 1000,
                milliliter: 1000000,
                gallon: 264.172,
                quart: 1056.688,
                pint: 2113.376,
                cup: 4226.752,
                cubicFoot: 35.3147
            },
            weight: {
                kilogram: 1,
                gram: 1000,
                milligram: 1000000,
                pound: 2.20462,
                ounce: 35.274,
                ton: 0.001,
                stone: 0.157473
            },
            temperature: {
                celsius: 'celsius',
                fahrenheit: 'fahrenheit',
                kelvin: 'kelvin'
            }
        };
    }

    convert(category, value, fromUnit, toUnit) {
        if (category === 'temperature') {
            return this.convertTemperature(value, fromUnit, toUnit);
        }

        const baseValue = value / this.units[category][fromUnit];
        return baseValue * this.units[category][toUnit];
    }

    convertTemperature(value, from, to) {
        let celsius;

        switch (from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5 / 9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }

        switch (to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return celsius * 9 / 5 + 32;
            case 'kelvin':
                return celsius + 273.15;
        }
    }
}

class BaseConverterTestHelper {
    convert(inputValue, fromBase) {
        let decimalValue;
        try {
            decimalValue = parseInt(inputValue, fromBase);
            if (isNaN(decimalValue)) throw new Error('Invalid number');
        } catch (e) {
            return null;
        }

        return {
            binary: decimalValue.toString(2),
            octal: decimalValue.toString(8),
            decimal: decimalValue.toString(10),
            hexadecimal: decimalValue.toString(16).toUpperCase()
        };
    }
}

class AlgebraTestHelper {
    solveLinearEquation(a, b) {
        if (a === 0) {
            return b === 0 ? '无穷多解' : '无解';
        }
        return -b / a;
    }

    solveQuadraticEquation(a, b, c) {
        if (a === 0) {
            if (b === 0) {
                return c === 0 ? '无穷多解' : '无解';
            }
            return [-c / b];
        }

        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);
            return { complex: true, realPart, imagPart };
        } else if (discriminant === 0) {
            return [-b / (2 * a)];
        } else {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            return [x1, x2];
        }
    }

    solveSystem(a1, b1, c1, a2, b2, c2) {
        const det = a1 * b2 - a2 * b1;

        if (det === 0) {
            return a1 * c2 === a2 * c1 ? '无穷多解' : '无解';
        }

        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;
        return { x, y };
    }

    determinant(matrix) {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        
        // 使用LU分解计算行列式，时间复杂度O(n³)
        const copy = matrix.map(row => [...row]);
        let sign = 1;
        let det = 1;
        
        for (let i = 0; i < n; i++) {
            // 寻找主元
            let pivot = i;
            for (let j = i; j < n; j++) {
                if (Math.abs(copy[j][i]) > Math.abs(copy[pivot][i])) {
                    pivot = j;
                }
            }
            
            // 交换行
            if (pivot !== i) {
                [copy[i], copy[pivot]] = [copy[pivot], copy[i]];
                sign *= -1;
            }
            
            // 如果主元为0，行列式为0
            if (Math.abs(copy[i][i]) < 1e-10) {
                return 0;
            }
            
            det *= copy[i][i];
            
            // 消元
            for (let j = i + 1; j < n; j++) {
                const factor = copy[j][i] / copy[i][i];
                for (let k = i; k < n; k++) {
                    copy[j][k] -= factor * copy[i][k];
                }
            }
        }
        
        return det * sign;
    }

    matrixMultiply(A, B) {
        const rowsA = A.length, colsA = A[0].length, colsB = B[0].length;
        const result = [];
        for (let i = 0; i < rowsA; i++) {
            result[i] = [];
            for (let j = 0; j < colsB; j++) {
                let sum = 0;
                for (let k = 0; k < colsA; k++) {
                    sum += A[i][k] * B[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    matrixTranspose(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]));
    }
}

class GeometryTestHelper {
    calculateTriangleArea(base, height) {
        return 0.5 * base * height;
    }

    calculateTrianglePerimeter(side1, side2, side3) {
        return side1 + side2 + side3;
    }

    calculateRectangleArea(length, width) {
        return length * width;
    }

    calculateRectanglePerimeter(length, width) {
        return 2 * (length + width);
    }

    calculateCircleArea(radius) {
        return Math.PI * radius * radius;
    }

    calculateCircleCircumference(radius) {
        return 2 * Math.PI * radius;
    }

    calculateCubeVolume(side) {
        return Math.pow(side, 3);
    }

    calculateCubeSurfaceArea(side) {
        return 6 * Math.pow(side, 2);
    }

    calculateSphereVolume(radius) {
        return (4 / 3) * Math.PI * Math.pow(radius, 3);
    }

    calculateSphereSurfaceArea(radius) {
        return 4 * Math.PI * Math.pow(radius, 2);
    }

    calculateCylinderVolume(radius, height) {
        return Math.PI * Math.pow(radius, 2) * height;
    }

    calculateCylinderSurfaceArea(radius, height) {
        return 2 * Math.PI * radius * (radius + height);
    }

    cartesianToPolar(x, y) {
        const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        const theta = Math.atan2(y, x) * 180 / Math.PI;
        return { r, theta };
    }

    polarToCartesian(r, theta) {
        const thetaRad = theta * Math.PI / 180;
        const x = r * Math.cos(thetaRad);
        const y = r * Math.sin(thetaRad);
        return { x, y };
    }
}

class StatisticsTestHelper {
    calculateMean(data) {
        return data.reduce((a, b) => a + b, 0) / data.length;
    }

    calculateMedian(data) {
        const sorted = [...data].sort((a, b) => a - b);
        const n = sorted.length;
        if (n % 2 === 0) {
            return (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        }
        return sorted[Math.floor(n / 2)];
    }

    calculateMode(data) {
        const frequency = {};
        data.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
        });
        
        let maxFreq = 0;
        let mode = [];
        for (const num in frequency) {
            if (frequency[num] > maxFreq) {
                maxFreq = frequency[num];
                mode = [parseFloat(num)];
            } else if (frequency[num] === maxFreq) {
                mode.push(parseFloat(num));
            }
        }
        
        if (mode.length === data.length || maxFreq === 1) {
            return [];
        }
        return mode;
    }

    calculateVariance(data) {
        const mean = this.calculateMean(data);
        return data.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / data.length;
    }

    calculateStdDev(data) {
        return Math.sqrt(this.calculateVariance(data));
    }

    calculateRange(data) {
        return Math.max(...data) - Math.min(...data);
    }

    factorial(n) {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    permutation(n, r) {
        if (n < 0 || r < 0 || r > n) return null;
        return this.factorial(n) / this.factorial(n - r);
    }

    combination(n, r) {
        if (n < 0 || r < 0 || r > n) return null;
        return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
    }

    normalCDF(z) {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = z < 0 ? -1 : 1;
        z = Math.abs(z) / Math.sqrt(2);

        const t = 1.0 / (1.0 + p * z);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

        return 0.5 * (1.0 + sign * y);
    }
}

module.exports = {
    CalculatorTestHelper,
    UnitConverterTestHelper,
    BaseConverterTestHelper,
    AlgebraTestHelper,
    GeometryTestHelper,
    StatisticsTestHelper
};
