class StatisticsTools {
    constructor() {
        this.statsChart = null;
        this.initStatistics();
        this.initProbability();
        this.initCharts();
    }

    initStatistics() {
        const calcBtn = document.getElementById('calculateStats');

        if (!calcBtn) return;

        calcBtn.addEventListener('click', () => {
            const dataInput = document.getElementById('statsData');
            const data = dataInput.value
                .split(',')
                .map(num => parseFloat(num.trim()))
                .filter(num => !isNaN(num));

            if (data.length === 0) {
                alert(i18n ? i18n.t('invalidInputData') : '请输入有效的数据');
                return;
            }

            this.calculateStatistics(data);
        });
    }

    calculateStatistics(data) {
        data.sort((a, b) => a - b);
        const n = data.length;

        const sum = data.reduce((a, b) => a + b, 0);
        const mean = sum / n;

        let median;
        if (n % 2 === 0) {
            median = (data[n / 2 - 1] + data[n / 2]) / 2;
        } else {
            median = data[Math.floor(n / 2)];
        }

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
        if (mode.length === n) mode = [i18n ? i18n.t('noValue') : '无'];
        if (maxFreq === 1) mode = [i18n ? i18n.t('noValue') : '无'];

        const variance = data.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);

        const range = Math.max(...data) - Math.min(...data);

        document.getElementById('statsMean').textContent = mean.toFixed(4);
        document.getElementById('statsMedian').textContent = median.toFixed(4);
        document.getElementById('statsMode').textContent = mode.join(', ');
        document.getElementById('statsVariance').textContent = variance.toFixed(4);
        document.getElementById('statsStdDev').textContent = stdDev.toFixed(4);
        document.getElementById('statsRange').textContent = range.toFixed(4);

        // 记录数据统计分析操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('statistics', 'dataAnalysis', {
                inputData: data,
                results: {
                    mean: mean.toFixed(4),
                    median: median.toFixed(4),
                    mode: mode.join(', '),
                    variance: variance.toFixed(4),
                    stdDev: stdDev.toFixed(4),
                    range: range.toFixed(4)
                }
            });
        }
    }

    initProbability() {
        const calcBtn = document.getElementById('calculateProb');
        const typeSelect = document.getElementById('probType');
        const inputsDiv = document.getElementById('probInputs');

        if (!calcBtn) return;

        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                this.updateProbInputs(typeSelect.value, inputsDiv);
            });
        }

        this.updateProbInputs('permutation', inputsDiv);

        calcBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : 'permutation';
            this.calculateProbability(type);
        });
    }

    updateProbInputs(type, container) {
        if (!container) return;

        let html = '';

        switch (type) {
            case 'permutation':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="totalN">n (总数)</label>
                            <input type="number" id="probN" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="selectedR">r (选取数)</label>
                            <input type="number" id="probR" class="form-control">
                        </div>
                    </div>
                `;
                break;
            case 'combination':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="totalN">n (总数)</label>
                            <input type="number" id="probN" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="selectedR">r (选取数)</label>
                            <input type="number" id="probR" class="form-control">
                        </div>
                    </div>
                `;
                break;
            case 'normal':
                html = `
                    <div class="mb-3">
                        <label class="form-label" data-i18n="xValue">x 值</label>
                        <input type="number" id="probX" class="form-control">
                    </div>
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="meanMu">均值 (μ)</label>
                            <input type="number" id="probMu" class="form-control" value="0">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="stdDevSigma">标准差 (σ)</label>
                            <input type="number" id="probSigma" class="form-control" value="1">
                        </div>
                    </div>
                `;
                break;
        }

        container.innerHTML = html;
        // 翻译新添加的元素
        if (i18n) {
            i18n.translatePage();
        }
    }

    calculateProbability(type) {
        const resultDiv = document.getElementById('probResult');
        if (!resultDiv) return;

        let result = '';
        let logData = {};

        switch (type) {
            case 'permutation':
                const nP = parseInt(document.getElementById('probN').value) || 0;
                const rP = parseInt(document.getElementById('probR').value) || 0;

                if (nP < 0 || rP < 0 || rP > nP) {
                    result = i18n ? i18n.t('invalidInput') : '无效的输入值';
                } else {
                    const perm = this.factorial(nP) / this.factorial(nP - rP);
                    result = `P(${nP}, ${rP}) = ${this.formatNumber(perm)}`;
                    logData = { type: 'permutation', n: nP, r: rP, result: perm };
                }
                break;

            case 'combination':
                const nC = parseInt(document.getElementById('probN').value) || 0;
                const rC = parseInt(document.getElementById('probR').value) || 0;

                if (nC < 0 || rC < 0 || rC > nC) {
                    result = i18n ? i18n.t('invalidInput') : '无效的输入值';
                } else {
                    const comb = this.factorial(nC) / (this.factorial(rC) * this.factorial(nC - rC));
                    result = `C(${nC}, ${rC}) = ${this.formatNumber(comb)}`;
                    logData = { type: 'combination', n: nC, r: rC, result: comb };
                }
                break;

            case 'normal':
                const x = parseFloat(document.getElementById('probX').value) || 0;
                const mu = parseFloat(document.getElementById('probMu').value) || 0;
                const sigma = parseFloat(document.getElementById('probSigma').value) || 1;

                if (sigma <= 0) {
                    result = i18n ? i18n.t('stdDevMustPositive') : '标准差必须大于0';
                } else {
                    const z = (x - mu) / sigma;
                    const prob = this.normalCDF(z);
                    const probability = i18n ? i18n.t('probability') : '概率';
                    const zValue = i18n ? 'Z' : 'Z值';
                    result = `P(X ≤ ${x}) = ${prob.toFixed(6)}\n${zValue} = ${z.toFixed(4)}`;
                    logData = { type: 'normal', x: x, mu: mu, sigma: sigma, z: z, probability: prob };
                }
                break;
        }

        resultDiv.textContent = result;

        // 记录概率计算操作
        if (typeof logger !== 'undefined' && logger && Object.keys(logData).length > 0) {
            logger.log('statistics', 'probabilityCalc', {
                calculationType: type,
                ...logData
            });
        }
    }

    factorial(n) {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
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

    formatNumber(num) {
        if (num >= 1e10) {
            return num.toExponential(4);
        }
        return num.toLocaleString();
    }

    initCharts() {
        const generateBtn = document.getElementById('generateChart');

        if (!generateBtn) return;

        generateBtn.addEventListener('click', () => {
            this.generateChart();
        });
    }

    generateChart() {
        const chartType = document.getElementById('chartType').value;
        const labelsInput = document.getElementById('chartLabels').value;
        const valuesInput = document.getElementById('chartValues').value;

        const labels = labelsInput.split(',').map(l => l.trim());
        const values = valuesInput.split(',').map(v => parseFloat(v.trim()));

        if (labels.length === 0 || values.length === 0 || labels.length !== values.length) {
            alert(i18n ? i18n.t('enterValidLabelsValues') : '请输入有效的标签和数值');
            return;
        }

        const ctx = document.getElementById('statsChart');
        if (!ctx) return;

        if (this.statsChart) {
            this.statsChart.destroy();
        }

        const colors = [
            'rgba(37, 99, 235, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(6, 182, 212, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(236, 72, 153, 0.7)'
        ];

        const borderColors = colors.map(c => c.replace('0.7', '1'));

        this.statsChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: i18n ? i18n.t('data') : '数据',
                    data: values,
                    backgroundColor: chartType === 'line' ? 'rgba(37, 99, 235, 0.1)' : colors,
                    borderColor: chartType === 'line' ? 'rgba(37, 99, 235, 1)' : borderColors,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw;
                            }
                        }
                    }
                },
                scales: chartType === 'pie' || chartType === 'doughnut' ? {} : {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });

        // 记录统计图表生成操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('statistics', 'chartGenerated', {
                chartType: chartType,
                labels: labels,
                values: values
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.statisticsTools = new StatisticsTools();
});