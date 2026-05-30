const TestFramework = require('./test-framework');
const {
    CalculatorTestHelper,
    UnitConverterTestHelper,
    BaseConverterTestHelper,
    AlgebraTestHelper,
    GeometryTestHelper,
    StatisticsTestHelper
} = require('./test-helpers');

const test = new TestFramework();

const calc = new CalculatorTestHelper();
const unitConv = new UnitConverterTestHelper();
const baseConv = new BaseConverterTestHelper();
const algebra = new AlgebraTestHelper();
const geometry = new GeometryTestHelper();
const stats = new StatisticsTestHelper();

test.describe('计算器模块 - 功能测试', () => {
    test.it('应该正确执行加法运算', () => {
        calc.clear();
        calc.inputDigit('5');
        calc.handleOperator('add');
        calc.inputDigit('3');
        const result = calc.calculate();
        test.assertApproxEqual(result, 8, 0.0001, '5 + 3 应该等于 8');
    });

    test.it('应该正确执行减法运算', () => {
        calc.clear();
        calc.inputDigit('1');
        calc.inputDigit('0');
        calc.handleOperator('subtract');
        calc.inputDigit('4');
        const result = calc.calculate();
        test.assertApproxEqual(result, 6, 0.0001, '10 - 4 应该等于 6');
    });

    test.it('应该正确执行乘法运算', () => {
        calc.clear();
        calc.inputDigit('7');
        calc.handleOperator('multiply');
        calc.inputDigit('8');
        const result = calc.calculate();
        test.assertApproxEqual(result, 56, 0.0001, '7 × 8 应该等于 56');
    });

    test.it('应该正确执行除法运算', () => {
        calc.clear();
        calc.inputDigit('1');
        calc.inputDigit('5');
        calc.handleOperator('divide');
        calc.inputDigit('3');
        const result = calc.calculate();
        test.assertApproxEqual(result, 5, 0.0001, '15 ÷ 3 应该等于 5');
    });

    test.it('应该正确执行幂运算', () => {
        calc.clear();
        calc.inputDigit('2');
        calc.handleOperator('power');
        calc.inputDigit('1');
        calc.inputDigit('0');
        const result = calc.calculate();
        test.assertApproxEqual(result, 1024, 0.0001, '2^10 应该等于 1024');
    });

    test.it('应该正确计算正弦值', () => {
        const result = calc.scientificOperation('sin', 30);
        test.assertApproxEqual(result, 0.5, 0.0001, 'sin(30°) 应该等于 0.5');
    });

    test.it('应该正确计算余弦值', () => {
        const result = calc.scientificOperation('cos', 60);
        test.assertApproxEqual(result, 0.5, 0.0001, 'cos(60°) 应该等于 0.5');
    });

    test.it('应该正确计算正切值', () => {
        const result = calc.scientificOperation('tan', 45);
        test.assertApproxEqual(result, 1, 0.0001, 'tan(45°) 应该等于 1');
    });

    test.it('应该正确计算对数值', () => {
        const result = calc.scientificOperation('log', 100);
        test.assertApproxEqual(result, 2, 0.0001, 'log10(100) 应该等于 2');
    });

    test.it('应该正确计算自然对数', () => {
        const result = calc.scientificOperation('ln', Math.E);
        test.assertApproxEqual(result, 1, 0.0001, 'ln(e) 应该等于 1');
    });

    test.it('应该正确计算平方根', () => {
        const result = calc.scientificOperation('sqrt', 16);
        test.assertApproxEqual(result, 4, 0.0001, 'sqrt(16) 应该等于 4');
    });

    test.it('应该正确返回π值', () => {
        const result = calc.scientificOperation('pi');
        test.assertApproxEqual(result, Math.PI, 0.0001, 'π 值应该正确');
    });

    test.it('应该正确返回e值', () => {
        const result = calc.scientificOperation('e');
        test.assertApproxEqual(result, Math.E, 0.0001, 'e 值应该正确');
    });

    test.it('应该正确计算百分比', () => {
        calc.clear();
        calc.inputDigit('5');
        calc.inputDigit('0');
        const result = calc.percent();
        test.assertApproxEqual(result, 0.5, 0.0001, '50% 应该等于 0.5');
    });
});

test.describe('计算器模块 - 边界测试', () => {
    test.it('除以零应该返回错误', () => {
        calc.clear();
        calc.inputDigit('5');
        calc.handleOperator('divide');
        calc.inputDigit('0');
        const result = calc.calculate();
        test.assertEqual(result, 'Error', '除以零应该返回错误');
    });

    test.it('应该正确处理大数运算', () => {
        calc.clear();
        calc.inputDigit('1');
        calc.inputDigit('e');
        calc.inputDigit('1');
        calc.inputDigit('0');
        const num1 = parseFloat(calc.currentValue);
        calc.handleOperator('add');
        calc.inputDigit('1');
        calc.inputDigit('e');
        calc.inputDigit('5');
        const result = calc.calculate();
        test.assertNumber(result, '大数运算结果应该是有效数字');
    });

    test.it('应该正确处理连续运算', () => {
        calc.clear();
        calc.inputDigit('2');
        calc.handleOperator('add');
        calc.inputDigit('3');
        calc.handleOperator('multiply');
        calc.inputDigit('4');
        const result = calc.calculate();
        test.assertApproxEqual(result, 20, 0.0001, '2 + 3 × 4 应该等于 20');
    });

    test.it('应该正确处理退格操作', () => {
        calc.clear();
        calc.inputDigit('1');
        calc.inputDigit('2');
        calc.inputDigit('3');
        calc.backspace();
        test.assertEqual(calc.currentValue, '12', '退格后应该是 12');
    });

    test.it('应该正确处理小数点输入', () => {
        calc.clear();
        calc.inputDigit('3');
        calc.inputDigit('.');
        calc.inputDigit('1');
        calc.inputDigit('4');
        test.assertEqual(calc.currentValue, '3.14', '应该正确处理小数');
    });

    test.it('应该防止重复输入小数点', () => {
        calc.clear();
        calc.inputDigit('3');
        calc.inputDigit('.');
        calc.inputDigit('.');
        calc.inputDigit('1');
        test.assertEqual(calc.currentValue, '3.1', '应该只保留一个小数点');
    });
});

test.describe('计算器模块 - 性能测试', () => {
    test.it('连续计算100次加法应该在合理时间内完成', () => {
        const startTime = Date.now();
        for (let i = 0; i < 100; i++) {
            calc.clear();
            calc.inputDigit('1');
            calc.handleOperator('add');
            calc.inputDigit('1');
            calc.calculate();
        }
        const duration = Date.now() - startTime;
        test.assert(duration < 100, `100次加法运算耗时 ${duration}ms，应该小于 100ms`);
    });

    test.it('科学计算函数应该在合理时间内完成', () => {
        const startTime = Date.now();
        for (let i = 0; i < 100; i++) {
            calc.scientificOperation('sin', i);
            calc.scientificOperation('cos', i);
            calc.scientificOperation('tan', i);
        }
        const duration = Date.now() - startTime;
        test.assert(duration < 50, `300次科学计算耗时 ${duration}ms，应该小于 50ms`);
    });
});

test.describe('单位转换模块 - 功能测试', () => {
    test.it('应该正确转换长度单位 (米到千米)', () => {
        const result = unitConv.convert('length', 1000, 'meter', 'kilometer');
        test.assertApproxEqual(result, 1, 0.0001, '1000米应该等于1千米');
    });

    test.it('应该正确转换长度单位 (米到厘米)', () => {
        const result = unitConv.convert('length', 1, 'meter', 'centimeter');
        test.assertApproxEqual(result, 100, 0.0001, '1米应该等于100厘米');
    });

    test.it('应该正确转换面积单位 (平方米到公顷)', () => {
        const result = unitConv.convert('area', 10000, 'squareMeter', 'hectare');
        test.assertApproxEqual(result, 1, 0.0001, '10000平方米应该等于1公顷');
    });

    test.it('应该正确转换体积单位 (升到毫升)', () => {
        const result = unitConv.convert('volume', 1, 'liter', 'milliliter');
        test.assertApproxEqual(result, 1000, 0.0001, '1升应该等于1000毫升');
    });

    test.it('应该正确转换重量单位 (千克到克)', () => {
        const result = unitConv.convert('weight', 1, 'kilogram', 'gram');
        test.assertApproxEqual(result, 1000, 0.0001, '1千克应该等于1000克');
    });

    test.it('应该正确转换温度 (摄氏度到华氏度)', () => {
        const result = unitConv.convertTemperature(0, 'celsius', 'fahrenheit');
        test.assertApproxEqual(result, 32, 0.01, '0°C 应该等于 32°F');
    });

    test.it('应该正确转换温度 (摄氏度到开尔文)', () => {
        const result = unitConv.convertTemperature(0, 'celsius', 'kelvin');
        test.assertApproxEqual(result, 273.15, 0.01, '0°C 应该等于 273.15K');
    });

    test.it('应该正确转换温度 (华氏度到摄氏度)', () => {
        const result = unitConv.convertTemperature(212, 'fahrenheit', 'celsius');
        test.assertApproxEqual(result, 100, 0.01, '212°F 应该等于 100°C');
    });
});

test.describe('单位转换模块 - 边界测试', () => {
    test.it('应该正确处理零值转换', () => {
        const result = unitConv.convert('length', 0, 'meter', 'kilometer');
        test.assertEqual(result, 0, '0米应该等于0千米');
    });

    test.it('应该正确处理负值转换', () => {
        const result = unitConv.convert('length', -100, 'meter', 'centimeter');
        test.assertApproxEqual(result, -10000, 0.01, '-100米应该等于-10000厘米');
    });

    test.it('应该正确处理极小值转换', () => {
        const result = unitConv.convert('length', 0.001, 'meter', 'millimeter');
        test.assertApproxEqual(result, 1, 0.01, '0.001米应该等于1毫米');
    });

    test.it('应该正确处理极大值转换', () => {
        const result = unitConv.convert('length', 1000000, 'meter', 'kilometer');
        test.assertApproxEqual(result, 1000, 0.01, '1000000米应该等于1000千米');
    });
});

test.describe('进制转换模块 - 功能测试', () => {
    test.it('应该正确转换十进制到二进制', () => {
        const result = baseConv.convert('10', 10);
        test.assertEqual(result.binary, '1010', '10的十进制应该等于1010的二进制');
    });

    test.it('应该正确转换十进制到八进制', () => {
        const result = baseConv.convert('64', 10);
        test.assertEqual(result.octal, '100', '64的十进制应该等于100的八进制');
    });

    test.it('应该正确转换十进制到十六进制', () => {
        const result = baseConv.convert('255', 10);
        test.assertEqual(result.hexadecimal, 'FF', '255的十进制应该等于FF的十六进制');
    });

    test.it('应该正确转换二进制到十进制', () => {
        const result = baseConv.convert('1010', 2);
        test.assertEqual(result.decimal, '10', '1010的二进制应该等于10的十进制');
    });

    test.it('应该正确转换八进制到十进制', () => {
        const result = baseConv.convert('100', 8);
        test.assertEqual(result.decimal, '64', '100的八进制应该等于64的十进制');
    });

    test.it('应该正确转换十六进制到十进制', () => {
        const result = baseConv.convert('FF', 16);
        test.assertEqual(result.decimal, '255', 'FF的十六进制应该等于255的十进制');
    });
});

test.describe('进制转换模块 - 边界测试', () => {
    test.it('应该正确处理零值转换', () => {
        const result = baseConv.convert('0', 10);
        test.assertEqual(result.decimal, '0', '0的转换应该正确');
    });

    test.it('应该正确处理大数转换', () => {
        const result = baseConv.convert('999999', 10);
        test.assertNumber(parseInt(result.decimal), '大数转换结果应该是有效数字');
    });

    test.it('无效输入应该返回null', () => {
        const result = baseConv.convert('ZZZ', 10);
        test.assertEqual(result, null, '无效输入应该返回null');
    });
});

test.describe('代数工具模块 - 功能测试', () => {
    test.it('应该正确求解一元一次方程', () => {
        const result = algebra.solveLinearEquation(2, 4);
        test.assertApproxEqual(result, -2, 0.0001, '2x + 4 = 0 的解应该是 x = -2');
    });

    test.it('应该正确求解一元二次方程 (两个实根)', () => {
        const result = algebra.solveQuadraticEquation(1, -5, 6);
        test.assertArray(result, '结果应该是数组');
        test.assertApproxEqual(result[0], 3, 0.0001);
        test.assertApproxEqual(result[1], 2, 0.0001);
    });

    test.it('应该正确求解一元二次方程 (一个实根)', () => {
        const result = algebra.solveQuadraticEquation(1, -4, 4);
        test.assertArray(result, '结果应该是数组');
        test.assertApproxEqual(result[0], 2, 0.0001);
    });

    test.it('应该正确求解一元二次方程 (复数根)', () => {
        const result = algebra.solveQuadraticEquation(1, 0, 1);
        test.assertObject(result, '结果应该是对象');
        test.assertEqual(result.complex, true, '应该标识为复数解');
    });

    test.it('应该正确求解二元一次方程组', () => {
        const result = algebra.solveSystem(2, 3, 8, 1, 2, 5);
        test.assertObject(result, '结果应该是对象');
        test.assertApproxEqual(result.x, 1, 0.0001);
        test.assertApproxEqual(result.y, 2, 0.0001);
    });

    test.it('应该正确计算矩阵行列式 (2x2)', () => {
        const matrix = [[1, 2], [3, 4]];
        const result = algebra.determinant(matrix);
        test.assertApproxEqual(result, -2, 0.0001, '行列式应该等于 -2');
    });

    test.it('应该正确计算矩阵行列式 (3x3)', () => {
        const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 10]];
        const result = algebra.determinant(matrix);
        test.assertApproxEqual(result, -3, 0.0001, '行列式应该等于 -3');
    });

    test.it('应该正确执行矩阵乘法', () => {
        const A = [[1, 2], [3, 4]];
        const B = [[5, 6], [7, 8]];
        const result = algebra.matrixMultiply(A, B);
        test.assertDeepEqual(result, [[19, 22], [43, 50]], '矩阵乘法结果应该正确');
    });

    test.it('应该正确执行矩阵转置', () => {
        const matrix = [[1, 2, 3], [4, 5, 6]];
        const result = algebra.matrixTranspose(matrix);
        test.assertDeepEqual(result, [[1, 4], [2, 5], [3, 6]], '转置结果应该正确');
    });
});

test.describe('代数工具模块 - 边界测试', () => {
    test.it('一元一次方程 a=0 且 b=0 应该返回无穷多解', () => {
        const result = algebra.solveLinearEquation(0, 0);
        test.assertEqual(result, '无穷多解', '应该返回无穷多解');
    });

    test.it('一元一次方程 a=0 且 b≠0 应该返回无解', () => {
        const result = algebra.solveLinearEquation(0, 5);
        test.assertEqual(result, '无解', '应该返回无解');
    });

    test.it('二元一次方程组无解的情况', () => {
        const result = algebra.solveSystem(1, 1, 1, 1, 1, 2);
        test.assertEqual(result, '无解', '应该返回无解');
    });

    test.it('二元一次方程组无穷多解的情况', () => {
        const result = algebra.solveSystem(1, 1, 1, 2, 2, 2);
        test.assertEqual(result, '无穷多解', '应该返回无穷多解');
    });
});

test.describe('几何工具模块 - 功能测试', () => {
    test.it('应该正确计算三角形面积', () => {
        const result = geometry.calculateTriangleArea(10, 5);
        test.assertApproxEqual(result, 25, 0.0001, '三角形面积应该等于 25');
    });

    test.it('应该正确计算三角形周长', () => {
        const result = geometry.calculateTrianglePerimeter(3, 4, 5);
        test.assertApproxEqual(result, 12, 0.0001, '三角形周长应该等于 12');
    });

    test.it('应该正确计算矩形面积', () => {
        const result = geometry.calculateRectangleArea(5, 3);
        test.assertApproxEqual(result, 15, 0.0001, '矩形面积应该等于 15');
    });

    test.it('应该正确计算矩形周长', () => {
        const result = geometry.calculateRectanglePerimeter(5, 3);
        test.assertApproxEqual(result, 16, 0.0001, '矩形周长应该等于 16');
    });

    test.it('应该正确计算圆面积', () => {
        const result = geometry.calculateCircleArea(5);
        test.assertApproxEqual(result, 78.5398, 0.01, '圆面积应该约等于 78.54');
    });

    test.it('应该正确计算圆周长', () => {
        const result = geometry.calculateCircleCircumference(5);
        test.assertApproxEqual(result, 31.4159, 0.01, '圆周长应该约等于 31.42');
    });

    test.it('应该正确计算立方体体积', () => {
        const result = geometry.calculateCubeVolume(3);
        test.assertApproxEqual(result, 27, 0.0001, '立方体体积应该等于 27');
    });

    test.it('应该正确计算立方体表面积', () => {
        const result = geometry.calculateCubeSurfaceArea(3);
        test.assertApproxEqual(result, 54, 0.0001, '立方体表面积应该等于 54');
    });

    test.it('应该正确计算球体体积', () => {
        const result = geometry.calculateSphereVolume(3);
        test.assertApproxEqual(result, 113.097, 0.01, '球体体积应该约等于 113.10');
    });

    test.it('应该正确计算球体表面积', () => {
        const result = geometry.calculateSphereSurfaceArea(3);
        test.assertApproxEqual(result, 113.097, 0.01, '球体表面积应该约等于 113.10');
    });

    test.it('应该正确计算圆柱体体积', () => {
        const result = geometry.calculateCylinderVolume(3, 5);
        test.assertApproxEqual(result, 141.372, 0.01, '圆柱体体积应该约等于 141.37');
    });

    test.it('应该正确计算圆柱体表面积', () => {
        const result = geometry.calculateCylinderSurfaceArea(3, 5);
        test.assertApproxEqual(result, 150.796, 0.01, '圆柱体表面积应该约等于 150.80');
    });
});

test.describe('几何工具模块 - 坐标转换测试', () => {
    test.it('应该正确转换直角坐标到极坐标', () => {
        const result = geometry.cartesianToPolar(3, 4);
        test.assertApproxEqual(result.r, 5, 0.0001, 'r 应该等于 5');
        test.assertApproxEqual(result.theta, 53.1301, 0.01, 'θ 应该约等于 53.13°');
    });

    test.it('应该正确转换极坐标到直角坐标', () => {
        const result = geometry.polarToCartesian(5, 53.1301);
        test.assertApproxEqual(result.x, 3, 0.01, 'x 应该约等于 3');
        test.assertApproxEqual(result.y, 4, 0.01, 'y 应该约等于 4');
    });

    test.it('应该正确处理原点坐标', () => {
        const result = geometry.cartesianToPolar(0, 0);
        test.assertApproxEqual(result.r, 0, 0.0001, '原点的 r 应该等于 0');
    });
});

test.describe('统计工具模块 - 功能测试', () => {
    test.it('应该正确计算平均值', () => {
        const data = [1, 2, 3, 4, 5];
        const result = stats.calculateMean(data);
        test.assertApproxEqual(result, 3, 0.0001, '平均值应该等于 3');
    });

    test.it('应该正确计算中位数 (奇数个)', () => {
        const data = [1, 3, 5, 7, 9];
        const result = stats.calculateMedian(data);
        test.assertApproxEqual(result, 5, 0.0001, '中位数应该等于 5');
    });

    test.it('应该正确计算中位数 (偶数个)', () => {
        const data = [1, 2, 3, 4];
        const result = stats.calculateMedian(data);
        test.assertApproxEqual(result, 2.5, 0.0001, '中位数应该等于 2.5');
    });

    test.it('应该正确计算众数', () => {
        const data = [1, 2, 2, 3, 3, 3, 4];
        const result = stats.calculateMode(data);
        test.assertDeepEqual(result, [3], '众数应该是 [3]');
    });

    test.it('应该正确计算方差', () => {
        const data = [2, 4, 4, 4, 5, 5, 7, 9];
        const result = stats.calculateVariance(data);
        test.assertApproxEqual(result, 4, 0.01, '方差应该等于 4');
    });

    test.it('应该正确计算标准差', () => {
        const data = [2, 4, 4, 4, 5, 5, 7, 9];
        const result = stats.calculateStdDev(data);
        test.assertApproxEqual(result, 2, 0.01, '标准差应该等于 2');
    });

    test.it('应该正确计算范围', () => {
        const data = [1, 5, 3, 9, 2];
        const result = stats.calculateRange(data);
        test.assertApproxEqual(result, 8, 0.0001, '范围应该等于 8');
    });
});

test.describe('统计工具模块 - 概率计算测试', () => {
    test.it('应该正确计算阶乘', () => {
        const result = stats.factorial(5);
        test.assertEqual(result, 120, '5! 应该等于 120');
    });

    test.it('应该正确计算排列 P(n,r)', () => {
        const result = stats.permutation(5, 3);
        test.assertEqual(result, 60, 'P(5,3) 应该等于 60');
    });

    test.it('应该正确计算组合 C(n,r)', () => {
        const result = stats.combination(5, 3);
        test.assertEqual(result, 10, 'C(5,3) 应该等于 10');
    });

    test.it('应该正确计算正态分布CDF', () => {
        const result = stats.normalCDF(0);
        test.assertApproxEqual(result, 0.5, 0.01, 'N(0) 应该约等于 0.5');
    });

    test.it('应该正确处理无效的排列参数', () => {
        const result = stats.permutation(3, 5);
        test.assertEqual(result, null, 'r > n 时应该返回 null');
    });

    test.it('应该正确处理无效的组合参数', () => {
        const result = stats.combination(-1, 5);
        test.assertEqual(result, null, '负数参数应该返回 null');
    });
});

test.describe('统计工具模块 - 准确性测试', () => {
    test.it('大数据集统计计算应该准确', () => {
        const data = [];
        for (let i = 1; i <= 100; i++) {
            data.push(i);
        }
        const mean = stats.calculateMean(data);
        const median = stats.calculateMedian(data);
        test.assertApproxEqual(mean, 50.5, 0.0001, '大数据集平均值应该准确');
        test.assertApproxEqual(median, 50.5, 0.0001, '大数据集中位数应该准确');
    });

    test.it('浮点数数据统计计算应该准确', () => {
        const data = [1.1, 2.2, 3.3, 4.4, 5.5];
        const mean = stats.calculateMean(data);
        test.assertApproxEqual(mean, 3.3, 0.0001, '浮点数平均值应该准确');
    });

    test.it('负数数据统计计算应该准确', () => {
        const data = [-5, -3, -1, 1, 3, 5];
        const mean = stats.calculateMean(data);
        test.assertApproxEqual(mean, 0, 0.0001, '负数平均值应该准确');
    });
});

test.describe('兼容性测试 - 输入格式', () => {
    test.it('计算器应该处理字符串数字输入', () => {
        calc.clear();
        calc.inputDigit('5');
        test.assertEqual(calc.currentValue, '5', '应该接受字符串数字输入');
    });

    test.it('单位转换应该处理整数和浮点数', () => {
        const result1 = unitConv.convert('length', 100, 'meter', 'centimeter');
        const result2 = unitConv.convert('length', 100.5, 'meter', 'centimeter');
        test.assertNumber(result1, '整数输入应该返回数字');
        test.assertNumber(result2, '浮点数输入应该返回数字');
    });

    test.it('统计计算应该处理不同类型的数据', () => {
        const data1 = [1, 2, 3, 4, 5];
        const data2 = [1.5, 2.5, 3.5, 4.5, 5.5];
        const mean1 = stats.calculateMean(data1);
        const mean2 = stats.calculateMean(data2);
        test.assertNumber(mean1, '整数数组应该返回数字');
        test.assertNumber(mean2, '浮点数数组应该返回数字');
    });
});

test.describe('性能测试 - 大数据量', () => {
    test.it('大数据集统计计算应该在合理时间内完成', () => {
        const data = [];
        for (let i = 0; i < 10000; i++) {
            data.push(Math.random() * 100);
        }
        
        const startTime = Date.now();
        stats.calculateMean(data);
        stats.calculateMedian(data);
        stats.calculateStdDev(data);
        const duration = Date.now() - startTime;
        
        test.assert(duration < 100, `10000个数据统计计算耗时 ${duration}ms，应该小于 100ms`);
    });

    test.it('矩阵运算应该在合理时间内完成', () => {
        const matrix = [];
        for (let i = 0; i < 10; i++) {
            matrix.push([]);
            for (let j = 0; j < 10; j++) {
                matrix[i].push(Math.random() * 10);
            }
        }
        
        const startTime = Date.now();
        algebra.determinant(matrix);
        const duration = Date.now() - startTime;
        
        test.assert(duration < 50, `10x10矩阵行列式计算耗时 ${duration}ms，应该小于 50ms`);
    });

    test.it('大量单位转换应该在合理时间内完成', () => {
        const startTime = Date.now();
        for (let i = 0; i < 1000; i++) {
            unitConv.convert('length', i, 'meter', 'kilometer');
        }
        const duration = Date.now() - startTime;
        
        test.assert(duration < 50, `1000次单位转换耗时 ${duration}ms，应该小于 50ms`);
    });
});

async function runAllTests() {
    const results = await test.run();
    const report = test.generateReport();
    
    console.log('\n\n========================================');
    console.log('   多维度测试分析');
    console.log('========================================\n');
    
    console.log('📊 功能测试:');
    console.log(`   通过: ${report.testDimensions.functional.passed}/${report.testDimensions.functional.total}`);
    
    console.log('\n📊 边界测试:');
    console.log(`   通过: ${report.testDimensions.boundary.passed}/${report.testDimensions.boundary.total}`);
    
    console.log('\n📊 性能测试:');
    console.log(`   通过: ${report.testDimensions.performance.passed}/${report.testDimensions.performance.total}`);
    
    console.log('\n📊 准确性测试:');
    console.log(`   通过: ${report.testDimensions.accuracy.passed}/${report.testDimensions.accuracy.total}`);
    
    console.log('\n📊 兼容性测试:');
    console.log(`   通过: ${report.testDimensions.compatibility.passed}/${report.testDimensions.compatibility.total}`);
    
    if (report.recommendations.length > 0) {
        console.log('\n\n========================================');
        console.log('   改进建议');
        console.log('========================================\n');
        report.recommendations.forEach((rec, i) => {
            console.log(`${i + 1}. ${rec}`);
        });
    }
    
    return report;
}

runAllTests().then(report => {
    const fs = require('fs');
    const reportPath = 'test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n\n📄 详细测试报告已保存到: ${reportPath}`);
}).catch(err => {
    console.error('测试执行出错:', err);
});
