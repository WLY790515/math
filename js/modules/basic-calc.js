class BasicCalculators {
    constructor() {
        this.initPercentageCalculator();
        this.initFractionCalculator();
    }

    initPercentageCalculator() {
        const calcBtn = document.getElementById('calculatePercentage');
        const typeSelect = document.getElementById('percentageType');
        const val1Input = document.getElementById('percentageVal1');
        const val2Input = document.getElementById('percentageVal2');
        const resultDisplay = document.getElementById('percentageResult');
        const label1 = document.getElementById('percentageLabel1');
        const label2 = document.getElementById('percentageLabel2');

        if (!calcBtn) return;

        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                this.updatePercentageLabels(typeSelect.value, label1, label2);
            });
            // 页面加载时初始化标签
            this.updatePercentageLabels(typeSelect.value, label1, label2);
        }

        calcBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : 'of';
            const val1 = parseFloat(val1Input ? val1Input.value : 0);
            const val2 = parseFloat(val2Input ? val2Input.value : 0);

            let result;
            let resultText = '';

            switch (type) {
                case 'of':
                    result = (val2 * val1 / 100);
                    resultText = `${val1}% of ${val2} = ${result.toFixed(2)}`;
                    resultDisplay.textContent = resultText;
                    break;
                case 'is':
                    result = (val1 / val2 * 100);
                    resultText = `${val1} is ${result.toFixed(2)}% of ${val2}`;
                    resultDisplay.textContent = resultText;
                    break;
                case 'ofNumber':
                    result = (val1 * val2 / 100);
                    resultText = `${val1}% of ${val2} = ${result.toFixed(2)}`;
                    resultDisplay.textContent = resultText;
                    break;
                case 'increase':
                    if (val2 === 0) {
                        resultDisplay.textContent = 'Error: Base value cannot be 0';
                        return;
                    }
                    result = ((val1 - val2) / val2 * 100);
                    resultText = `Increase: ${result.toFixed(2)}% (from ${val2} to ${val1})`;
                    resultDisplay.textContent = resultText;
                    break;
            }

            // 记录百分比计算操作
            if (typeof logger !== 'undefined' && logger && resultText) {
                logger.log('calculator', 'percentageCalc', {
                    type: type,
                    val1: val1,
                    val2: val2,
                    result: result,
                    display: resultText
                });
            }
        });
    }

    updatePercentageLabels(type, label1, label2) {
        const labels = {
            'of': ['percentage', 'value'],
            'is': ['value', 'total'],
            'ofNumber': ['percentage', 'value'],
            'increase': ['newValue', 'originalValue']
        };

        if (label1 && label2 && labels[type]) {
            label1.textContent = i18n ? i18n.t(labels[type][0]) : labels[type][0];
            label2.textContent = i18n ? i18n.t(labels[type][1]) : labels[type][1];
        }
    }

    initFractionCalculator() {
        const calcBtn = document.getElementById('calculateFraction');
        const resultDisplay = document.getElementById('fractionResult');

        if (!calcBtn) return;

        calcBtn.addEventListener('click', () => {
            const num1 = parseInt(document.getElementById('fractionNum1').value) || 0;
            const den1 = parseInt(document.getElementById('fractionDen1').value) || 1;
            const num2 = parseInt(document.getElementById('fractionNum2').value) || 0;
            const den2 = parseInt(document.getElementById('fractionDen2').value) || 1;
            const op = document.getElementById('fractionOp').value;

            if (den1 === 0 || den2 === 0) {
                resultDisplay.textContent = 'Error: Denominator cannot be 0';
                return;
            }

            let resultNum, resultDen;
            let displayOp = op;

            switch (op) {
                case '+':
                    resultNum = num1 * den2 + num2 * den1;
                    resultDen = den1 * den2;
                    displayOp = '+';
                    break;
                case '-':
                    resultNum = num1 * den2 - num2 * den1;
                    resultDen = den1 * den2;
                    displayOp = '−';
                    break;
                case '*':
                    resultNum = num1 * num2;
                    resultDen = den1 * den2;
                    displayOp = '×';
                    break;
                case '/':
                    if (num2 === 0) {
                        resultDisplay.textContent = 'Error: Cannot divide by zero';
                        return;
                    }
                    resultNum = num1 * den2;
                    resultDen = den1 * num2;
                    displayOp = '÷';
                    break;
            }

            const gcd = this.gcd(Math.abs(resultNum), Math.abs(resultDen));
            resultNum /= gcd;
            resultDen /= gcd;

            if (resultDen < 0) {
                resultNum = -resultNum;
                resultDen = -resultDen;
            }

            const wholePart = Math.floor(Math.abs(resultNum) / resultDen);
            const fracPart = Math.abs(resultNum) % resultDen;

            let resultText;
            if (wholePart === 0 && fracPart === 0) {
                resultText = '0';
            } else if (fracPart === 0) {
                resultText = String(wholePart);
            } else if (wholePart === 0) {
                resultText = `${resultNum < 0 ? '-' : ''}${fracPart}/${resultDen}`;
            } else {
                resultText = `${resultNum < 0 ? '-' : ''}${wholePart} ${fracPart}/${resultDen}`;
            }

            resultDisplay.textContent = `${num1}/${den1} ${displayOp} ${num2}/${den2} = ${resultText}`;

            // 记录分数计算操作
            if (typeof logger !== 'undefined' && logger) {
                logger.log('calculator', 'fractionCalc', {
                    num1: num1,
                    den1: den1,
                    num2: num2,
                    den2: den2,
                    operator: displayOp,
                    result: resultText
                });
            }
        });
    }

    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const basicCalculators = new BasicCalculators();
});