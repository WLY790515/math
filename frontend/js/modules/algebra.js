class AlgebraTools {
    constructor() {
        this.initEquationSolver();
        this.initFactorization();
        this.initPolynomial();
        this.initFunctionPlotter();
        this.initMatrixCalculator();
    }

    initEquationSolver() {
        const solveBtn = document.getElementById('solveEquation');
        const typeSelect = document.getElementById('equationType');
        const inputsDiv = document.getElementById('equationInputs');

        if (!solveBtn) return;

        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                this.updateEquationInputs(typeSelect.value, inputsDiv);
            });
        }

        this.updateEquationInputs('linear', inputsDiv);

        solveBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : 'linear';
            this.solveEquation(type);
        });
    }

    updateEquationInputs(type, container) {
        if (!container) return;

        let html = '';

        switch (type) {
            case 'linear':
                html = `
                    <div class="mb-3">
                        <label class="form-label">ax + b = 0</label>
                    </div>
                    <div class="row">
                        <div class="col">
                            <input type="number" id="eqA1" class="form-control" placeholder="a">
                        </div>
                        <div class="col">
                            <input type="number" id="eqB1" class="form-control" placeholder="b">
                        </div>
                    </div>
                `;
                break;
            case 'quadratic':
                html = `
                    <div class="mb-3">
                        <label class="form-label">ax² + bx + c = 0</label>
                    </div>
                    <div class="row">
                        <div class="col">
                            <input type="number" id="eqA2" class="form-control" placeholder="a">
                        </div>
                        <div class="col">
                            <input type="number" id="eqB2" class="form-control" placeholder="b">
                        </div>
                        <div class="col">
                            <input type="number" id="eqC2" class="form-control" placeholder="c">
                        </div>
                    </div>
                `;
                break;
            case 'system':
                html = `
                    <div class="mb-3">
                        <label class="form-label">二元一次方程组</label>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">方程 1: a₁x + b₁y = c₁</label>
                    </div>
                    <div class="row">
                        <div class="col">
                            <input type="number" id="eqA3" class="form-control" placeholder="a₁">
                        </div>
                        <div class="col">
                            <input type="number" id="eqB3" class="form-control" placeholder="b₁">
                        </div>
                        <div class="col">
                            <input type="number" id="eqC3" class="form-control" placeholder="c₁">
                        </div>
                    </div>
                    <div class="mb-3 mt-2">
                        <label class="form-label">方程 2: a₂x + b₂y = c₂</label>
                    </div>
                    <div class="row">
                        <div class="col">
                            <input type="number" id="eqA4" class="form-control" placeholder="a₂">
                        </div>
                        <div class="col">
                            <input type="number" id="eqB4" class="form-control" placeholder="b₂">
                        </div>
                        <div class="col">
                            <input type="number" id="eqC4" class="form-control" placeholder="c₂">
                        </div>
                    </div>
                `;
                break;
        }

        container.innerHTML = html;
    }

    solveEquation(type) {
        const resultDiv = document.getElementById('equationResult');
        if (!resultDiv) return;

        let result = '';
        let logData = {};

        switch (type) {
            case 'linear':
                const a1 = parseFloat(document.getElementById('eqA1').value);
                const b1 = parseFloat(document.getElementById('eqB1').value);

                if (a1 === 0) {
                    result = b1 === 0 ? '无穷多解' : '无解';
                } else {
                    const x = -b1 / a1;
                    result = `x = ${x.toFixed(4)}`;
                }
                logData = { type: 'linear', a: a1, b: b1, result: result };
                break;

            case 'quadratic':
                const a2 = parseFloat(document.getElementById('eqA2').value);
                const b2 = parseFloat(document.getElementById('eqB2').value);
                const c2 = parseFloat(document.getElementById('eqC2').value);

                if (a2 === 0) {
                    if (b2 === 0) {
                        result = c2 === 0 ? '无穷多解' : '无解';
                    } else {
                        result = `x = ${(-c2 / b2).toFixed(4)}`;
                    }
                } else {
                    const discriminant = b2 * b2 - 4 * a2 * c2;

                    if (discriminant < 0) {
                        const realPart = (-b2 / (2 * a2)).toFixed(4);
                        const imagPart = (Math.sqrt(-discriminant) / (2 * a2)).toFixed(4);
                        result = `x₁ = ${realPart} + ${imagPart}i, x₂ = ${realPart} - ${imagPart}i`;
                    } else if (discriminant === 0) {
                        result = `x = ${(-b2 / (2 * a2)).toFixed(4)}`;
                    } else {
                        const x1 = (-b2 + Math.sqrt(discriminant)) / (2 * a2);
                        const x2 = (-b2 - Math.sqrt(discriminant)) / (2 * a2);
                        result = `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
                    }
                }
                logData = { type: 'quadratic', a: a2, b: b2, c: c2, result: result };
                break;

            case 'system':
                const a3 = parseFloat(document.getElementById('eqA3').value);
                const b3 = parseFloat(document.getElementById('eqB3').value);
                const c3 = parseFloat(document.getElementById('eqC3').value);
                const a4 = parseFloat(document.getElementById('eqA4').value);
                const b4 = parseFloat(document.getElementById('eqB4').value);
                const c4 = parseFloat(document.getElementById('eqC4').value);

                const det = a3 * b4 - a4 * b3;

                if (det === 0) {
                    result = a3 * c4 === a4 * c3 ? '无穷多解' : '无解';
                } else {
                    const x = (c3 * b4 - c4 * b3) / det;
                    const y = (a3 * c4 - a4 * c3) / det;
                    result = `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`;
                }
                logData = { type: 'system', eq1: {a: a3, b: b3, c: c3}, eq2: {a: a4, b: b4, c: c4}, result: result };
                break;
        }

        resultDiv.textContent = result;

        // 记录方程求解操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('algebra', 'equationSolve', logData);
        }
    }

    initFactorization() {
        const factorBtn = document.getElementById('factorizeBtn');

        if (!factorBtn) return;

        factorBtn.addEventListener('click', () => {
            const expr = document.getElementById('factorExpr').value.trim();
            const resultDiv = document.getElementById('factorResult');

            if (!resultDiv) return;

            if (!expr) {
                resultDiv.textContent = '请输入表达式';
                return;
            }

            const result = this.factorize(expr);
            resultDiv.textContent = result;
        });
    }

    factorize(expr) {
        expr = expr.replace(/\s/g, '').toLowerCase();

        const perfectSquarePattern = /^x\^2([+-]\d+)x?\1$/;
        const diffOfSquaresPattern = /^([+-]?\d*)x\^2?([+-]\d+)?-(\d+)$/;
        let result = '';

        if (expr.match(/^x\^2-(\d+)$/)) {
            const num = parseInt(expr.match(/^x\^2-(\d+)$/)[1]);
            const sqrt = Math.sqrt(num);
            if (Number.isInteger(sqrt)) {
                result = `(x+${sqrt})(x-${sqrt})`;
                
                // 记录因式分解操作
                if (typeof logger !== 'undefined' && logger) {
                    logger.log('algebra', 'factorization', {
                        expression: expr,
                        result: result
                    });
                }
                
                return result;
            }
        }

        if (expr.match(/^(\d+)x\^2([+-]\d+)x([+-]\d+)$/)) {
            const match = expr.match(/^(\d+)x\^2([+-]\d+)x([+-]\d+)$/);
            const a = parseInt(match[1]);
            const b = parseInt(match[2]);
            const c = parseInt(match[3]);

            for (let p = 1; p <= Math.abs(c); p++) {
                for (let q = 1; q <= Math.abs(a); q++) {
                    if (p * q === c && q * b === a * p + c * q) {
                        result = `(${p}x+${q})(${a / q}x+${c / p})`;
                        
                        // 记录因式分解操作
                        if (typeof logger !== 'undefined' && logger) {
                            logger.log('algebra', 'factorization', {
                                expression: expr,
                                result: result
                            });
                        }
                        
                        return result;
                    }
                }
            }
        }

        if (expr.includes('x')) {
            result = '无法因式分解或表达式已是最简形式';
        } else {
            result = '请输入有效的代数表达式';
        }

        // 记录因式分解操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('algebra', 'factorization', {
                expression: expr,
                result: result
            });
        }

        return result;
    }

    initPolynomial() {
        const calcBtn = document.getElementById('calculatePolynomial');

        if (!calcBtn) return;

        calcBtn.addEventListener('click', () => {
            const poly1 = document.getElementById('poly1').value.trim();
            const poly2 = document.getElementById('poly2').value.trim();
            const op = document.getElementById('polyOp').value;
            const resultDiv = document.getElementById('polyResult');

            if (!resultDiv) return;

            if (!poly1 || !poly2) {
                resultDiv.textContent = '请输入两个多项式';
                return;
            }

            const result = this.calculatePolynomial(poly1, poly2, op);
            resultDiv.textContent = result;

            // 记录多项式运算操作
            if (typeof logger !== 'undefined' && logger) {
                logger.log('algebra', 'polynomialCalc', {
                    poly1: poly1,
                    poly2: poly2,
                    operator: op,
                    result: result
                });
            }
        });
    }

    calculatePolynomial(poly1, poly2, op) {
        const parsePoly = (p) => {
            const terms = [];
            const regex = /([+-]?\d*)x?(\^?\d*)?([+-]\d+)?/g;
            let match;

            while ((match = regex.exec(p)) !== null) {
                if (match[0]) {
                    let coef = match[1] ? (match[1] === '+' || match[1] === '-' ? parseInt(match[1] + '1') : parseInt(match[1])) : 1;
                    let exp = match[2] ? (match[2] === '^' ? 1 : parseInt(match[2])) : (match[0].includes('x') ? 1 : 0);

                    if (match[0].includes('x') && !match[2]) {
                        exp = 1;
                    } else if (!match[0].includes('x')) {
                        exp = 0;
                    } else if (match[2] && match[2].startsWith('^')) {
                        exp = parseInt(match[2].substring(1));
                    }

                    if (!isNaN(coef) || match[0].includes('x')) {
                        terms.push({ coef, exp });
                    }
                }
            }

            return terms;
        };

        const terms1 = parsePoly(poly1);
        const terms2 = parsePoly(poly2);

        let result = [];

        switch (op) {
            case 'add':
                result = [...terms1];
                terms2.forEach(term => {
                    const existing = result.find(t => t.exp === term.exp);
                    if (existing) {
                        existing.coef += term.coef;
                    } else {
                        result.push({ ...term });
                    }
                });
                break;
            case 'subtract':
                result = [...terms1];
                terms2.forEach(term => {
                    const existing = result.find(t => t.exp === term.exp);
                    if (existing) {
                        existing.coef -= term.coef;
                    } else {
                        result.push({ coef: -term.coef, exp: term.exp });
                    }
                });
                break;
            case 'multiply':
                terms1.forEach(t1 => {
                    terms2.forEach(t2 => {
                        result.push({ coef: t1.coef * t2.coef, exp: t1.exp + t2.exp });
                    });
                });
                break;
            case 'divide':
                return '多项式除法需要更复杂的实现';
        }

        result = result.filter(t => t.coef !== 0);
        result.sort((a, b) => b.exp - a.exp);

        if (result.length === 0) return '0';

        return result.map((t, i) => {
            if (i === 0) {
                if (t.exp === 0) return `${t.coef}`;
                if (t.exp === 1) return `${t.coef === 1 ? '' : t.coef}x`;
                return `${t.coef === 1 ? '' : t.coef}x^${t.exp}`;
            } else {
                const sign = t.coef >= 0 ? '+' : '';
                if (t.exp === 0) return `${sign}${t.coef}`;
                if (t.exp === 1) return `${sign}${t.coef === 1 ? '' : t.coef}x`;
                return `${sign}${t.coef === 1 ? '' : t.coef}x^${t.exp}`;
            }
        }).join('').replace(/^\+/, '');
    }

    initFunctionPlotter() {
        const plotBtn = document.getElementById('plotFunction');
        const clearBtn = document.getElementById('clearPlot');
        const canvas = document.getElementById('functionCanvas');

        if (!canvas) return;

        this.plotCtx = canvas.getContext('2d');
        this.plotFunctions = [];

        this.drawPlotAxes();

        if (plotBtn) {
            plotBtn.addEventListener('click', () => this.plotFunction());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.plotFunctions = [];
                this.drawPlotAxes();
            });
        }
    }

    drawPlotAxes() {
        if (!this.plotCtx) return;

        const canvas = this.plotCtx.canvas;
        const ctx = this.plotCtx;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;

        const gridSize = 50;
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.font = '12px Arial';
        ctx.fillText('x', canvas.width - 15, canvas.height / 2 - 10);
        ctx.fillText('y', canvas.width / 2 + 10, 15);
    }

    plotFunction() {
        const input = document.getElementById('functionInput');
        if (!input || !this.plotCtx) return;

        const expr = input.value.trim();
        if (!expr) return;

        this.plotFunctions.push(expr);
        this.drawPlotAxes();

        const canvas = this.plotCtx.canvas;
        const ctx = this.plotCtx;
        const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

        this.plotFunctions.forEach((func, index) => {
            ctx.strokeStyle = colors[index % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();

            const parseFunc = (x) => {
                try {
                    let expression = func.toLowerCase()
                        .replace(/x/g, `(${x})`)
                        .replace(/\^/g, '**')
                        .replace(/sin/g, 'Math.sin')
                        .replace(/cos/g, 'Math.cos')
                        .replace(/tan/g, 'Math.tan')
                        .replace(/log/g, 'Math.log10')
                        .replace(/ln/g, 'Math.log')
                        .replace(/sqrt/g, 'Math.sqrt')
                        .replace(/abs\(/g, 'Math.abs(')
                        .replace(/exp/g, 'Math.exp')
                        .replace(/pi/g, String(Math.PI))
                        .replace(/e(?![xp])/g, String(Math.E));

                    return eval(expression);
                } catch {
                    return NaN;
                }
            };

            let started = false;
            let lastY = null;
            let lastValidY = null;
            const scaleX = canvas.width / 10;
            const scaleY = canvas.height / 10;
            const offsetX = canvas.width / 2;
            const offsetY = canvas.height / 2;
            const maxY = canvas.height * 2;
            const minY = -canvas.height * 2;

            for (let px = 0; px <= canvas.width; px++) {
                const x = (px - offsetX) / scaleX;
                const y = parseFunc(x);

                if (!isNaN(y) && isFinite(y) && y >= minY && y <= maxY) {
                    const py = offsetY - y * scaleY;

                    if (py >= -canvas.height && py <= canvas.height * 2) {
                        if (lastY !== null) {
                            const yDiff = Math.abs(y - lastY);
                            if (yDiff > canvas.height * 0.5) {
                                started = false;
                            }
                        }

                        if (!started) {
                            ctx.moveTo(px, py);
                            started = true;
                        } else {
                            ctx.lineTo(px, py);
                        }
                        lastValidY = py;
                    } else {
                        started = false;
                    }
                    lastY = y;
                } else {
                    started = false;
                    lastY = null;
                }
            }

            ctx.stroke();
        });

        if (typeof logger !== 'undefined' && logger) {
            logger.log('algebra', 'functionPlot', {
                function: expr,
                totalFunctions: this.plotFunctions.length
            });
        }
    }

    initMatrixCalculator() {
        const calcBtn = document.getElementById('calculateMatrix');

        if (!calcBtn) return;

        calcBtn.addEventListener('click', () => {
            const op = document.getElementById('matrixOp').value;
            const matrixAInput = document.getElementById('matrixA');
            const matrixBInput = document.getElementById('matrixB');
            const resultDiv = document.getElementById('matrixResult');

            if (!resultDiv) return;

            const parseMatrix = (input) => {
                const rows = input.trim().split(';');
                return rows.map(row =>
                    row.split(',').map(num => parseFloat(num.trim()))
                );
            };

            try {
                const matrixA = parseMatrix(matrixAInput.value);
                let result;

                if (op !== 'determinant' && op !== 'inverse' && op !== 'transpose') {
                    const matrixB = parseMatrix(matrixBInput.value);
                    result = this.matrixOperation(matrixA, matrixB, op);
                } else {
                    result = this.matrixOperation(matrixA, null, op);
                }

                const resultText = Array.isArray(result)
                    ? result.map(row => row.join('\t')).join('\n')
                    : result;

                resultDiv.textContent = resultText;

                // 记录矩阵运算操作
                if (typeof logger !== 'undefined' && logger) {
                    logger.log('algebra', 'matrixCalc', {
                        operation: op,
                        matrixA: matrixAInput.value,
                        matrixB: op !== 'determinant' && op !== 'inverse' && op !== 'transpose' ? matrixBInput.value : null,
                        result: resultText
                    });
                }
            } catch (e) {
                resultDiv.textContent = '输入格式错误，请使用格式: 1,2;3,4';
            }
        });
    }

    matrixOperation(A, B, op) {
        switch (op) {
            case 'add':
                return A.map((row, i) => row.map((val, j) => val + B[i][j]));
            case 'subtract':
                return A.map((row, i) => row.map((val, j) => val - B[i][j]));
            case 'multiply':
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
            case 'determinant':
                if (A.length !== A[0].length) return '必须是方阵';
                return this.determinant(A);
            case 'inverse':
                if (A.length !== A[0].length) return '必须是方阵';
                return this.inverseMatrix(A);
            case 'transpose':
                return A[0].map((_, i) => A.map(row => row[i]));
            default:
                return '未知操作';
        }
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

    inverseMatrix(matrix) {
        const n = matrix.length;
        const det = this.determinant(matrix);
        if (det === 0) return '矩阵不可逆';

        if (n === 2) {
            return [[matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]];
        }

        return '高阶矩阵逆运算较复杂';
    }
}

const algebraTools = new AlgebraTools();