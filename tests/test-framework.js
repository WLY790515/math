class TestFramework {
    constructor() {
        this.testSuites = [];
        this.currentSuite = null;
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            errors: [],
            suites: {}
        };
        this.startTime = null;
    }

    describe(name, fn) {
        this.currentSuite = {
            name: name,
            tests: [],
            beforeEach: null,
            afterEach: null
        };
        fn();
        this.testSuites.push(this.currentSuite);
        this.currentSuite = null;
    }

    it(name, fn) {
        if (this.currentSuite) {
            this.currentSuite.tests.push({ name, fn, skipped: false });
        }
    }

    itSkip(name, fn) {
        if (this.currentSuite) {
            this.currentSuite.tests.push({ name, fn, skipped: true });
        }
    }

    beforeEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.beforeEach = fn;
        }
    }

    afterEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.afterEach = fn;
        }
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, but got ${actual}`);
        }
    }

    assertDeepEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(message || `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
        }
    }

    assertApproxEqual(actual, expected, tolerance = 0.0001, message) {
        if (Math.abs(actual - expected) > tolerance) {
            throw new Error(message || `Expected ${expected} (±${tolerance}), but got ${actual}`);
        }
    }

    assertThrows(fn, expectedError, message) {
        try {
            fn();
            throw new Error(message || 'Expected function to throw, but it did not');
        } catch (error) {
            if (expectedError && !error.message.includes(expectedError)) {
                throw new Error(message || `Expected error containing "${expectedError}", but got "${error.message}"`);
            }
        }
    }

    assertType(value, expectedType, message) {
        if (typeof value !== expectedType) {
            throw new Error(message || `Expected type ${expectedType}, but got ${typeof value}`);
        }
    }

    assertArray(value, message) {
        if (!Array.isArray(value)) {
            throw new Error(message || 'Expected an array');
        }
    }

    assertObject(value, message) {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw new Error(message || 'Expected an object');
        }
    }

    assertNumber(value, message) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(message || 'Expected a valid number');
        }
    }

    assertString(value, message) {
        if (typeof value !== 'string') {
            throw new Error(message || 'Expected a string');
        }
    }

    assertContains(str, substring, message) {
        if (!str.includes(substring)) {
            throw new Error(message || `Expected "${str}" to contain "${substring}"`);
        }
    }

    async run() {
        this.startTime = Date.now();
        console.log('\n========================================');
        console.log('   数学工具箱 - 多维度测试系统');
        console.log('========================================\n');

        for (const suite of this.testSuites) {
            console.log(`\n📦 测试套件: ${suite.name}`);
            console.log('─'.repeat(50));
            
            this.results.suites[suite.name] = {
                total: suite.tests.length,
                passed: 0,
                failed: 0,
                skipped: 0,
                tests: []
            };

            for (const test of suite.tests) {
                this.results.total++;
                
                if (test.skipped) {
                    this.results.skipped++;
                    this.results.suites[suite.name].skipped++;
                    this.results.suites[suite.name].tests.push({
                        name: test.name,
                        status: 'skipped',
                        duration: 0
                    });
                    console.log(`  ⏭️  ${test.name} (跳过)`);
                    continue;
                }

                const testStartTime = Date.now();
                
                try {
                    if (suite.beforeEach) {
                        await suite.beforeEach();
                    }
                    
                    await test.fn();
                    
                    if (suite.afterEach) {
                        await suite.afterEach();
                    }
                    
                    const duration = Date.now() - testStartTime;
                    this.results.passed++;
                    this.results.suites[suite.name].passed++;
                    this.results.suites[suite.name].tests.push({
                        name: test.name,
                        status: 'passed',
                        duration: duration
                    });
                    console.log(`  ✅ ${test.name} (${duration}ms)`);
                    
                } catch (error) {
                    const duration = Date.now() - testStartTime;
                    this.results.failed++;
                    this.results.suites[suite.name].failed++;
                    this.results.suites[suite.name].tests.push({
                        name: test.name,
                        status: 'failed',
                        duration: duration,
                        error: error.message
                    });
                    this.results.errors.push({
                        suite: suite.name,
                        test: test.name,
                        error: error.message
                    });
                    console.log(`  ❌ ${test.name} (${duration}ms)`);
                    console.log(`     错误: ${error.message}`);
                }
            }
        }

        const totalDuration = Date.now() - this.startTime;
        console.log('\n========================================');
        console.log('   测试结果汇总');
        console.log('========================================');
        console.log(`总计测试: ${this.results.total}`);
        console.log(`通过: ${this.results.passed} ✅`);
        console.log(`失败: ${this.results.failed} ❌`);
        console.log(`跳过: ${this.results.skipped} ⏭️`);
        console.log(`总耗时: ${totalDuration}ms`);
        console.log(`通过率: ${((this.results.passed / (this.results.total - this.results.skipped)) * 100).toFixed(2)}%`);
        
        return this.results;
    }

    generateReport() {
        const report = {
            title: '数学工具箱 - 多维度测试报告',
            generatedAt: new Date().toISOString(),
            summary: {
                total: this.results.total,
                passed: this.results.passed,
                failed: this.results.failed,
                skipped: this.results.skipped,
                passRate: ((this.results.passed / (this.results.total - this.results.skipped)) * 100).toFixed(2) + '%',
                duration: Date.now() - this.startTime + 'ms'
            },
            testDimensions: {
                functional: { passed: 0, failed: 0, total: 0 },
                boundary: { passed: 0, failed: 0, total: 0 },
                performance: { passed: 0, failed: 0, total: 0 },
                accuracy: { passed: 0, failed: 0, total: 0 },
                compatibility: { passed: 0, failed: 0, total: 0 }
            },
            suites: this.results.suites,
            errors: this.results.errors,
            recommendations: []
        };

        for (const suiteName in this.results.suites) {
            const suite = this.results.suites[suiteName];
            if (suiteName.includes('功能测试')) {
                report.testDimensions.functional.passed += suite.passed;
                report.testDimensions.functional.failed += suite.failed;
                report.testDimensions.functional.total += suite.total - suite.skipped;
            } else if (suiteName.includes('边界测试')) {
                report.testDimensions.boundary.passed += suite.passed;
                report.testDimensions.boundary.failed += suite.failed;
                report.testDimensions.boundary.total += suite.total - suite.skipped;
            } else if (suiteName.includes('性能测试')) {
                report.testDimensions.performance.passed += suite.passed;
                report.testDimensions.performance.failed += suite.failed;
                report.testDimensions.performance.total += suite.total - suite.skipped;
            } else if (suiteName.includes('准确性测试')) {
                report.testDimensions.accuracy.passed += suite.passed;
                report.testDimensions.accuracy.failed += suite.failed;
                report.testDimensions.accuracy.total += suite.total - suite.skipped;
            } else if (suiteName.includes('兼容性测试')) {
                report.testDimensions.compatibility.passed += suite.passed;
                report.testDimensions.compatibility.failed += suite.failed;
                report.testDimensions.compatibility.total += suite.total - suite.skipped;
            }
        }

        if (report.summary.failed > 0) {
            report.recommendations.push('存在失败的测试用例，建议检查错误日志并修复相关问题');
        }
        if (report.testDimensions.accuracy.failed > 0) {
            report.recommendations.push('准确性测试存在失败，建议检查计算算法的精度问题');
        }
        if (report.testDimensions.boundary.failed > 0) {
            report.recommendations.push('边界测试存在失败，建议增强异常处理和边界条件检查');
        }
        if (report.testDimensions.performance.failed > 0) {
            report.recommendations.push('性能测试存在失败，建议优化算法效率');
        }

        return report;
    }
}

module.exports = TestFramework;
