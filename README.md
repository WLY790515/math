# 数学工具箱 (Math Toolbox)

一个功能强大的在线数学工具箱，支持基础计算、代数工具、几何计算和统计分析。

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tests](https://img.shields.io/badge/tests-93%20passed-brightgreen.svg)

## 📥 下载

| 版本 | 文件 | 说明 |
|------|------|------|
| v1.0.1 | [math-toolbox-v1.0.1.zip](./release/math-toolbox-v1.0.1.zip) | 最新版本 |
| v1.0.0 | [math-toolbox-v1.0.0.zip](./release/math-toolbox-v1.0.0.zip) | 初始版本 |

## ✨ 功能特点

### 🔢 基础计算
- **科学计算器** - 支持基本运算、三角函数、对数等
- **单位转换** - 长度、面积、体积、重量、温度等
- **进制转换** - 二进制、八进制、十进制、十六进制互转
- **百分比计算** - 百分比增减、占比计算
- **分数计算** - 分数加减乘除、化简

### 📐 代数工具
- **方程求解** - 一元一次、一元二次、二元一次方程组
- **因式分解** - 常见多项式因式分解
- **多项式运算** - 加减乘除运算
- **函数绘图** - 绘制各种函数图像
- **矩阵运算** - 加减乘、行列式、转置、逆矩阵

### 📏 几何工具
- **平面几何** - 三角形、矩形、圆等图形计算
- **立体几何** - 立方体、球体、圆柱体等体积和表面积
- **坐标转换** - 直角坐标与极坐标互转

### 📊 统计与概率
- **数据统计** - 平均值、中位数、众数、方差、标准差
- **概率计算** - 排列、组合、正态分布
- **统计图表** - 柱状图、折线图、饼图、散点图

### 🌐 多语言支持
- 中文
- English

### 📝 操作记录
- 记录所有操作历史
- 支持筛选功能
- 网格和列表视图切换

## 🚀 快速开始

### 前置要求
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/yourusername/math-toolbox.git
cd math-toolbox
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务器**
```bash
npm start
```

4. **访问应用**
打开浏览器访问 `http://localhost:3002`

### 开发模式

```bash
# 启动开发服务器（自动重启）
npm run dev
```

## 🧪 测试

项目包含完整的测试套件，覆盖功能测试、边界测试、性能测试等。

### 运行测试
```bash
cd tests
node run-tests.js
```

### 测试覆盖
- **功能测试**: 56 个测试
- **边界测试**: 17 个测试
- **性能测试**: 5 个测试
- **准确性测试**: 3 个测试
- **兼容性测试**: 3 个测试

### 查看测试报告
测试完成后，会生成HTML格式的测试报告：
```
tests/test-report.html
```

## 📁 项目结构

```
math-toolbox/
├── index.html              # 主页面
├── server.js               # Express服务器
├── package.json            # 项目配置
├── .gitignore             # Git忽略文件
├── README.md              # 项目文档
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── main.js            # 主入口文件
│   ├── core/              # 核心功能
│   │   ├── calculator.js  # 计算器核心
│   │   ├── converter.js   # 转换器核心
│   │   ├── i18n.js        # 多语言支持
│   │   └── logger.js      # 日志记录
│   └── modules/           # 功能模块
│       ├── basic-calc.js  # 基础计算
│       ├── algebra.js     # 代数工具
│       ├── geometry.js    # 几何工具
│       └── statistics.js  # 统计工具
└── tests/                 # 测试文件
    ├── run-tests.js       # 测试运行器
    ├── test-framework.js  # 测试框架
    ├── test-helpers.js    # 测试助手
    └── test-report.html   # 测试报告
```

## 🛠️ 技术栈

### 前端
- **HTML5** - 语义化标签
- **CSS3** - 现代样式、动画效果
- **JavaScript ES6+** - 模块化、异步编程
- **Bootstrap 5** - 响应式UI框架

### 库和工具
- **MathJax 3** - 数学公式渲染
- **Chart.js 4** - 图表绘制
- **D3.js 7** - 数据可视化

### 后端
- **Node.js** - 运行环境
- **Express** - Web服务器

## 📊 性能优化

### 矩阵运算优化
- 使用LU分解算法计算行列式
- 时间复杂度从O(n!)降低到O(n³)
- 10x10矩阵计算时间从348ms降至0ms

## 🌐 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 更新日志

### v1.0.1 (2026-05-30)
- ✅ 完成所有核心功能
- ✅ 优化矩阵运算性能
- ✅ 完善多语言支持
- ✅ 添加操作记录功能
- ✅ 通过所有93个测试
- ✅ 移除移动端支持，专注Web应用
- 🐛 修复：语法错误 - 删除多余的闭合大括号
- 🐛 修复：引用未定义的 event 变量
- 🔒 安全：JWT_SECRET 改为从环境变量读取，增强安全性
- 🐛 修复：power 操作符处理不一致问题

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

Math Toolbox Team

## 🙏 致谢

感谢所有开源项目的贡献者，特别是：
- Bootstrap 团队
- Chart.js 团队
- MathJax 团队
- D3.js 团队

---

⭐ 如果这个项目对您有帮助，请给一个星标！
