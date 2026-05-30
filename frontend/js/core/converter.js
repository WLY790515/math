class UnitConverter {
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

        this.currentCategory = 'length';
        this.init();
    }

    init() {
        const categorySelect = document.getElementById('converterCategory');
        const fromInput = document.getElementById('converterFrom');
        const fromUnitSelect = document.getElementById('converterFromUnit');
        const toUnitSelect = document.getElementById('converterToUnit');
        const swapBtn = document.getElementById('swapUnits');

        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.updateUnitOptions();
                this.convert();
            });
        }

        if (fromInput) {
            fromInput.addEventListener('input', () => this.convert());
        }

        if (fromUnitSelect) {
            fromUnitSelect.addEventListener('change', () => this.convert());
        }

        if (toUnitSelect) {
            toUnitSelect.addEventListener('change', () => this.convert());
        }

        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapUnits());
        }

        // 确保在i18n初始化后更新单位选项
        if (window.i18n) {
            this.updateUnitOptions();
        } else {
            // 如果i18n还没有初始化，等待DOMContentLoaded事件
            document.addEventListener('DOMContentLoaded', () => {
                this.updateUnitOptions();
            });
        }
    }

    updateUnitOptions() {
        const fromUnitSelect = document.getElementById('converterFromUnit');
        const toUnitSelect = document.getElementById('converterToUnit');

        if (!fromUnitSelect || !toUnitSelect) return;

        const units = Object.keys(this.units[this.currentCategory]);
        const unitLabels = this.getUnitLabels(this.currentCategory);

        fromUnitSelect.innerHTML = units.map((unit, i) =>
            `<option value="${unit}">${unitLabels[i]}</option>`
        ).join('');

        toUnitSelect.innerHTML = units.map((unit, i) =>
            `<option value="${unit}">${unitLabels[i]}</option>`
        ).join('');

        if (units.length > 1) {
            toUnitSelect.selectedIndex = 1;
        }
    }

    getUnitLabels(category) {
        const unitKeys = {
            length: ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'],
            area: ['squareMeter', 'squareKilometer', 'squareCentimeter', 'hectare', 'acre', 'squareFoot', 'squareInch'],
            volume: ['cubicMeter', 'liter', 'milliliter', 'gallon', 'quart', 'pint', 'cup', 'cubicFoot'],
            weight: ['kilogram', 'gram', 'milligram', 'pound', 'ounce', 'ton', 'stone'],
            temperature: ['celsius', 'fahrenheit', 'kelvin']
        };
        
        const keys = unitKeys[category] || [];
        return keys.map(key => i18n ? i18n.t(key) : key);
    }

    convert() {
        const fromInput = document.getElementById('converterFrom');
        const fromUnitSelect = document.getElementById('converterFromUnit');
        const toUnitSelect = document.getElementById('converterToUnit');
        const toInput = document.getElementById('converterTo');

        if (!fromInput || !fromUnitSelect || !toUnitSelect || !toInput) return;

        const value = parseFloat(fromInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        if (isNaN(value)) {
            toInput.value = '';
            return;
        }

        let result;

        if (this.currentCategory === 'temperature') {
            result = this.convertTemperature(value, fromUnit, toUnit);
        } else {
            const baseValue = value / this.units[this.currentCategory][fromUnit];
            result = baseValue * this.units[this.currentCategory][toUnit];
        }

        toInput.value = result.toFixed(6).replace(/\.?0+$/, '');

        // 记录单位转换操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('converter', 'unitConvert', {
                category: this.currentCategory,
                value: value,
                fromUnit: fromUnit,
                toUnit: toUnit,
                result: result
            });
        }
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

    swapUnits() {
        const fromUnitSelect = document.getElementById('converterFromUnit');
        const toUnitSelect = document.getElementById('converterToUnit');

        if (!fromUnitSelect || !toUnitSelect) return;

        const temp = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = temp;

        this.convert();
    }
}

class BaseConverter {
    constructor() {
        this.init();
    }

    init() {
        const convertBtn = document.getElementById('convertBase');
        const baseInput = document.getElementById('baseInput');

        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convert());
        }

        if (baseInput) {
            baseInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.convert();
            });
        }

        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-copy');
                const value = document.getElementById(targetId).textContent;
                navigator.clipboard.writeText(value);
            });
        });
    }

    convert() {
        const baseInput = document.getElementById('baseInput');
        const baseFrom = document.getElementById('baseFrom');

        if (!baseInput || !baseFrom) return;

        const inputValue = baseInput.value.trim();
        const fromBase = parseInt(baseFrom.value);

        if (!inputValue) return;

        let decimalValue;
        try {
            decimalValue = parseInt(inputValue, fromBase);
            if (isNaN(decimalValue)) throw new Error('Invalid number');
        } catch (e) {
            alert(i18n ? i18n.t('enterValidNumber') : '请输入有效的数字');
            return;
        }

        const binary = decimalValue.toString(2);
        const octal = decimalValue.toString(8);
        const decimal = decimalValue.toString(10);
        const hexadecimal = decimalValue.toString(16).toUpperCase();

        document.getElementById('baseBin').textContent = binary;
        document.getElementById('baseOct').textContent = octal;
        document.getElementById('baseDec').textContent = decimal;
        document.getElementById('baseHex').textContent = hexadecimal;

        // 记录进制转换操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('converter', 'baseConvert', {
                input: inputValue,
                fromBase: fromBase,
                results: {
                    binary: binary,
                    octal: octal,
                    decimal: decimal,
                    hexadecimal: hexadecimal
                }
            });
        }
    }
}

window.unitConverter = new UnitConverter();
window.baseConverter = new BaseConverter();

// 当i18n初始化后，更新单位标签
document.addEventListener('DOMContentLoaded', function() {
    if (window.i18n) {
        window.unitConverter.updateUnitOptions();
    }
});