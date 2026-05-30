class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.history = [];
        this.display = document.getElementById('calcDisplay');
        this.historyDisplay = document.getElementById('calcHistory');
    }

    init() {
        document.querySelectorAll('.calculator-buttons .btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleAction(action);
            });
        });

        document.querySelectorAll('.scientific-buttons .btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleScientificAction(action);
            });
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
    }

    handleAction(action) {
        if (action === null) return;

        if (!isNaN(action) || action === 'dot') {
            this.inputDigit(action === 'dot' ? '.' : parseInt(action));
        } else {
            switch (action) {
                case 'clear':
                    this.clear();
                    break;
                case 'backspace':
                    this.backspace();
                    break;
                case 'percent':
                    this.percent();
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    this.handleOperator(action);
                    break;
                case 'equals':
                    this.calculate();
                    break;
            }
        }
    }

    handleScientificAction(action) {
        const current = parseFloat(this.currentValue);

        switch (action) {
            case 'sin':
                this.currentValue = String(Math.sin(current * Math.PI / 180));
                break;
            case 'cos':
                this.currentValue = String(Math.cos(current * Math.PI / 180));
                break;
            case 'tan':
                this.currentValue = String(Math.tan(current * Math.PI / 180));
                break;
            case 'log':
                this.currentValue = String(Math.log10(current));
                break;
            case 'ln':
                this.currentValue = String(Math.log(current));
                break;
            case 'sqrt':
                this.currentValue = String(Math.sqrt(current));
                break;
            case 'power':
                this.handleOperator('power');
                return;
            case 'pi':
                this.currentValue = String(Math.PI);
                break;
            case 'e':
                this.currentValue = String(Math.E);
                break;
        }

        this.updateDisplay();
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
        this.updateDisplay();
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
        if (this.operator === null || this.previousValue === '') return;

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
                    this.currentValue = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            case 'power':
                result = Math.pow(prev, current);
                break;
        }

        const expression = `${prev} ${this.getOperatorSymbol(this.operator)} ${current} =`;
        this.history.unshift({ expression, result });
        if (this.history.length > 10) this.history.pop();

        this.currentValue = String(result);
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = true;
        this.updateDisplay();
        this.updateHistory();

        // 记录计算操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('calculator', 'calculate', {
                expression: expression,
                result: result
            });
        }
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

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    percent() {
        const current = parseFloat(this.currentValue);
        this.currentValue = String(current / 100);
        this.updateDisplay();
    }

    updateDisplay() {
        let displayValue = this.currentValue;
        if (displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toExponential(6);
        }
        if (this.display) {
            this.display.value = displayValue;
        }
    }

    updateHistory() {
        if (!this.historyDisplay) return;

        this.historyDisplay.innerHTML = this.history
            .map(item => `<div class="history-item">${item.expression} ${item.result}</div>`)
            .join('');
    }

    handleKeydown(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.inputDigit(parseInt(e.key));
        } else if (e.key === '.') {
            this.inputDigit('.');
        } else if (e.key === '+') {
            this.handleOperator('add');
        } else if (e.key === '-') {
            this.handleOperator('subtract');
        } else if (e.key === '*') {
            this.handleOperator('multiply');
        } else if (e.key === '/') {
            this.handleOperator('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculate();
        } else if (e.key === 'Escape') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.backspace();
        }
    }
}

const calculator = new Calculator();