document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuModal = document.getElementById('menuModal');
    const navLinks = document.querySelectorAll('.menu-item');
    const moduleContainers = document.querySelectorAll('.module-container');
    const currentModuleTitle = document.querySelector('#currentModule h1');

    function initApp() {
        calculator.init();
        initActivityLogs();

        // 菜单按钮点击事件
        if (menuToggle) {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = new bootstrap.Modal(menuModal);
                modal.show();
            });
        }

        // 菜单项点击事件
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const moduleName = this.getAttribute('data-module');
                const titleKey = this.getAttribute('data-i18n');

                // 添加点击动画
                this.classList.add('menu-item-clicked');
                setTimeout(() => {
                    this.classList.remove('menu-item-clicked');
                }, 300);

                // 关闭菜单弹窗
                const modal = bootstrap.Modal.getInstance(menuModal);
                if (modal) {
                    modal.hide();
                }

                // 移除其他导航的active状态
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // 隐藏所有模块
                moduleContainers.forEach(container => {
                    container.classList.remove('active');
                    container.style.display = 'none';
                });

                // 显示目标模块
                const targetModule = document.getElementById(`module-${moduleName}`);
                if (targetModule) {
                    targetModule.style.opacity = '0';
                    targetModule.style.transform = 'translateY(20px)';
                    targetModule.style.transition = 'all 0.3s ease';
                    setTimeout(() => {
                        targetModule.classList.add('active');
                        targetModule.style.display = 'block';
                        targetModule.style.opacity = '1';
                        targetModule.style.transform = 'translateY(0)';
                    }, 100);
                }

                // 更新标题
                if (currentModuleTitle && titleKey && i18n) {
                    currentModuleTitle.style.opacity = '0';
                    currentModuleTitle.style.transition = 'all 0.3s ease';
                    setTimeout(() => {
                        currentModuleTitle.textContent = i18n.t(titleKey);
                        currentModuleTitle.setAttribute('data-i18n', titleKey);
                        currentModuleTitle.style.opacity = '1';
                    }, 200);
                }

                if (moduleName === 'activity-logs') {
                    refreshActivityLogs();
                }
            });
        });

        initFooterLinks();
    }

    function initFooterLinks() {
        const helpLink = document.querySelector('.footer-links a[data-i18n="help"]');
        const aboutLink = document.querySelector('.footer-links a[data-i18n="about"]');

        if (helpLink) {
            helpLink.addEventListener('click', function(e) {
                e.preventDefault();
                showHelpModal();
            });
        }

        if (aboutLink) {
            aboutLink.addEventListener('click', function(e) {
                e.preventDefault();
                showAboutModal();
            });
        }
    }

    function showHelpModal() {
        const modalContent = `
            <div class="modal fade" id="helpModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">帮助</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h6>基础计算</h6>
                            <p>使用科学计算器进行基本数学运算，支持三角函数、对数、指数等功能。</p>
                            
                            <h6>单位转换</h6>
                            <p>在长度、面积、体积、重量、温度等单位之间进行转换。</p>
                            
                            <h6>进制转换</h6>
                            <p>在不同进制（二进制、八进制、十进制、十六进制）之间转换数字。</p>
                            
                            <h6>方程求解</h6>
                            <p>求解一元一次方程、一元二次方程和二元一次方程组。</p>
                            
                            <h6>几何画板</h6>
                            <p>使用绘图工具在画布上绘制点、线、圆、多边形等图形。</p>
                            
                            <h6>统计图表</h6>
                            <p>输入数据生成柱状图、折线图、饼图等统计图表。</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('helpModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalContent);
        const modal = new bootstrap.Modal(document.getElementById('helpModal'));
        modal.show();
    }

    function showAboutModal() {
        const modalContent = `
            <div class="modal fade" id="aboutModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">关于</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h4>数学工具箱 v1.0.1</h4>
                            <p>一个功能强大的在线数学工具箱，支持基础计算、代数工具、几何绘图和统计分析。</p>
                            <hr>
                            <h6>主要功能</h6>
                            <ul>
                                <li>科学计算器</li>
                                <li>单位转换和进制转换</li>
                                <li>方程求解和因式分解</li>
                                <li>函数绘图</li>
                                <li>矩阵运算</li>
                                <li>几何画板</li>
                                <li>平面和立体几何计算</li>
                                <li>统计分析和图表生成</li>
                            </ul>
                            <hr>
                            <p class="text-muted">使用 Bootstrap 5, Chart.js 和原生 JavaScript 构建</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('aboutModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalContent);
        const modal = new bootstrap.Modal(document.getElementById('aboutModal'));
        modal.show();
    }

    function initActivityLogs() {
        // 初始化活动日志模块
        const refreshBtn = document.getElementById('refreshLogs');
        const clearBtn = document.getElementById('clearLogs');
        const toolFilter = document.getElementById('toolFilter');
        const timeFilter = document.getElementById('timeFilter');
        const gridLayoutBtn = document.getElementById('gridLayout');
        const listLayoutBtn = document.getElementById('listLayout');
        const smallSizeBtn = document.getElementById('smallSize');
        const mediumSizeBtn = document.getElementById('mediumSize');
        const largeSizeBtn = document.getElementById('largeSize');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshActivityLogs);
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                if (confirm('确定要清空所有操作记录吗？')) {
                    if (logger) {
                        logger.clearLogs();
                        refreshActivityLogs();
                    }
                }
            });
        }

        if (toolFilter) {
            toolFilter.addEventListener('change', refreshActivityLogs);
        }

        if (timeFilter) {
            timeFilter.addEventListener('change', refreshActivityLogs);
        }

        if (gridLayoutBtn) {
            gridLayoutBtn.addEventListener('click', function() {
                currentLayout = 'grid';
                gridLayoutBtn.classList.remove('btn-outline-primary');
                gridLayoutBtn.classList.add('btn-primary');
                listLayoutBtn.classList.remove('btn-primary');
                listLayoutBtn.classList.add('btn-outline-primary');
                refreshActivityLogs();
            });
        }

        if (listLayoutBtn) {
            listLayoutBtn.addEventListener('click', function() {
                currentLayout = 'list';
                listLayoutBtn.classList.remove('btn-outline-primary');
                listLayoutBtn.classList.add('btn-primary');
                gridLayoutBtn.classList.remove('btn-primary');
                gridLayoutBtn.classList.add('btn-outline-primary');
                refreshActivityLogs();
            });
        }

        if (smallSizeBtn) {
            smallSizeBtn.addEventListener('click', function() {
                currentSize = 'small';
                smallSizeBtn.classList.remove('btn-outline-secondary');
                smallSizeBtn.classList.add('btn-primary');
                mediumSizeBtn.classList.remove('btn-primary');
                mediumSizeBtn.classList.add('btn-outline-secondary');
                largeSizeBtn.classList.remove('btn-primary');
                largeSizeBtn.classList.add('btn-outline-secondary');
                refreshActivityLogs();
            });
        }

        if (mediumSizeBtn) {
            mediumSizeBtn.addEventListener('click', function() {
                currentSize = 'medium';
                mediumSizeBtn.classList.remove('btn-outline-primary');
                mediumSizeBtn.classList.add('btn-primary');
                smallSizeBtn.classList.remove('btn-primary');
                smallSizeBtn.classList.add('btn-outline-secondary');
                largeSizeBtn.classList.remove('btn-primary');
                largeSizeBtn.classList.add('btn-outline-secondary');
                refreshActivityLogs();
            });
        }

        if (largeSizeBtn) {
            largeSizeBtn.addEventListener('click', function() {
                currentSize = 'large';
                largeSizeBtn.classList.remove('btn-outline-secondary');
                largeSizeBtn.classList.add('btn-primary');
                smallSizeBtn.classList.remove('btn-primary');
                smallSizeBtn.classList.add('btn-outline-secondary');
                mediumSizeBtn.classList.remove('btn-primary');
                mediumSizeBtn.classList.add('btn-outline-secondary');
                refreshActivityLogs();
            });
        }
    }

    let currentLayout = 'grid';
    let currentSize = 'medium';

    function refreshActivityLogs() {
        if (!logger) return;

        const logsList = document.getElementById('logsList');
        const logsGrid = document.getElementById('logsGrid');
        const totalActions = document.getElementById('totalActions');
        const mostUsedTool = document.getElementById('mostUsedTool');
        const recentActions = document.getElementById('recentActions');
        const toolFilter = document.getElementById('toolFilter');
        const timeFilter = document.getElementById('timeFilter');

        if (!logsGrid) return;

        // 获取过滤条件
        const selectedTool = toolFilter ? toolFilter.value : 'all';
        const selectedTime = timeFilter ? timeFilter.value : 'all';

        // 获取日志
        let logs = logger.getLogs(100);

        // 时间过滤
        if (selectedTime !== 'all') {
            const now = Date.now();
            let cutoffTime;
            switch (selectedTime) {
                case '24h':
                    cutoffTime = now - (24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    cutoffTime = 0;
            }
            logs = logs.filter(log => new Date(log.timestamp).getTime() >= cutoffTime);
        }

        // 工具过滤
        if (selectedTool !== 'all') {
            logs = logs.filter(log => log.tool === selectedTool);
        } else {
            // 排除navigation工具
            logs = logs.filter(log => log.tool !== 'navigation');
        }

        // 再次排除navigation工具，确保不显示导航操作记录
        logs = logs.filter(log => log.tool !== 'navigation');

        // 更新统计信息
        if (totalActions) {
            totalActions.textContent = logger.logs.length;
        }

        if (mostUsedTool) {
            const usage = logger.getToolUsage();
            let mostUsed = '-';
            let maxCount = 0;
            for (const [tool, count] of Object.entries(usage)) {
                // 排除navigation工具
                if (tool !== 'navigation' && count > maxCount) {
                    maxCount = count;
                    mostUsed = tool;
                }
            }
            // 翻译工具名称
            if (i18n) {
                const toolNameMap = {
                    'calculator': 'calculator',
                    'converter': 'converter',
                    'algebra': 'algebra',
                    'geometry': 'geometry',
                    'statistics': 'statistics'
                };
                const translationKey = toolNameMap[mostUsed] || mostUsed;
                mostUsedTool.textContent = i18n.t(translationKey);
            } else {
                mostUsedTool.textContent = mostUsed;
            }
        }

        if (recentActions) {
            const recent = logger.getRecentActivity(24);
            recentActions.textContent = recent.length;
        }

        // 更新日志列表或网格
        if (logs.length === 0) {
            if (currentLayout === 'grid') {
                logsGrid.innerHTML = `
                    <div class="grid-item text-center" data-i18n="noLogs">
                        暂无操作记录
                    </div>
                `;
                logsList.style.display = 'none';
                logsGrid.style.display = 'grid';
            } else {
                logsList.innerHTML = `
                    <div class="list-group-item list-group-item-light text-center" data-i18n="noLogs">
                        暂无操作记录
                    </div>
                `;
                logsGrid.style.display = 'none';
                logsList.style.display = 'block';
            }
        } else {
            if (currentLayout === 'grid') {
                logsGrid.innerHTML = logs.map(log => {
                    let dataDisplay = '';
                    if (log.data && Object.keys(log.data).length > 0) {
                        dataDisplay = formatLogDataCompact(log.tool, log.action, log.data);
                    }
                    
                    let toolClass = '';
                    switch (log.tool) {
                        case 'calculator': toolClass = 'border-primary'; break;
                        case 'converter': toolClass = 'border-secondary'; break;
                        case 'gobang': toolClass = 'border-success'; break;
                        case 'navigation': toolClass = 'border-info'; break;
                        default: toolClass = 'border-secondary';
                    }
                    
                    return `
                        <div class="grid-item ${currentSize} ${toolClass}" data-log='${JSON.stringify(log)}'>
                            <div class="log-time small text-muted">${new Date(log.timestamp).toLocaleString()}</div>
                            <div class="log-tool fw-bold text-primary">${getToolDisplayName(log.tool)}</div>
                            <div class="log-action text-dark">${getActionDisplayName(log.action)}</div>
                            ${dataDisplay}
                            <div class="mt-2 text-right">
                                <button class="btn btn-sm btn-outline-primary view-details" data-log='${JSON.stringify(log)}'>
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
                logsList.style.display = 'none';
                logsGrid.style.display = 'grid';
            } else {
                logsList.innerHTML = logs.map(log => {
                    let dataDisplay = '';
                    if (log.data && Object.keys(log.data).length > 0) {
                        dataDisplay = formatLogData(log.tool, log.action, log.data);
                    }
                    
                    let toolClass = '';
                    switch (log.tool) {
                        case 'calculator': toolClass = 'bg-primary bg-opacity-10 border-left-primary'; break;
                        case 'converter': toolClass = 'bg-secondary bg-opacity-10 border-left-secondary'; break;
                        case 'gobang': toolClass = 'bg-success bg-opacity-10 border-left-success'; break;
                        case 'navigation': toolClass = 'bg-info bg-opacity-10 border-left-info'; break;
                        default: toolClass = 'bg-light border-left-secondary';
                    }
                    
                    return `
                        <div class="list-group-item ${toolClass} mb-2 rounded" data-log='${JSON.stringify(log)}'>
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <div class="log-time">${new Date(log.timestamp).toLocaleString()}</div>
                                    <div class="log-tool fw-bold text-primary">${getToolDisplayName(log.tool)}</div>
                                    <div class="log-action text-dark">${getActionDisplayName(log.action)}</div>
                                    ${dataDisplay}
                                </div>
                                <button class="btn btn-sm btn-outline-primary view-details ms-2" data-log='${JSON.stringify(log)}'>
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
                logsGrid.style.display = 'none';
                logsList.style.display = 'block';
            }
        }

        // 添加查看详情事件监听器
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const log = JSON.parse(this.getAttribute('data-log'));
                showLogDetail(log);
            });
        });

        // 点击网格项查看详情
        document.querySelectorAll('.grid-item').forEach(item => {
            item.addEventListener('click', function() {
                const log = JSON.parse(this.getAttribute('data-log'));
                showLogDetail(log);
            });
        });

        // 应用翻译
        if (i18n) {
            i18n.translatePage();
        }
    }

    function formatLogDataCompact(tool, action, data) {
        switch (tool) {
            case 'calculator':
                if (action === 'calculate') {
                    return `
                        <div class="log-data mt-2 small">
                            <strong>表达式:</strong> ${data.expression.substring(0, 20)}${data.expression.length > 20 ? '...' : ''}<br>
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                } else if (action === 'percentageCalc') {
                    const typeNames = { 'of': '百分比', 'is': '占比', 'ofNumber': '数值百分比', 'increase': '增长率' };
                    return `
                        <div class="log-data mt-2 small">
                            <strong>类型:</strong> ${typeNames[data.type] || data.type}<br>
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                }
                break;
            case 'converter':
                if (action === 'convert') {
                    return `
                        <div class="log-data mt-2 small">
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                }
                break;
            case 'algebra':
                if (action === 'solveEquation') {
                    return `
                        <div class="log-data mt-2 small">
                            <strong>方程:</strong> ${data.equation.substring(0, 20)}${data.equation.length > 20 ? '...' : ''}<br>
                            <strong>根:</strong> ${data.roots.join(', ')}
                        </div>
                    `;
                } else if (action === 'factorize') {
                    return `
                        <div class="log-data mt-2 small">
                            <strong>表达式:</strong> ${data.expression.substring(0, 20)}${data.expression.length > 20 ? '...' : ''}<br>
                            <strong>结果:</strong> ${data.result.substring(0, 20)}${data.result.length > 20 ? '...' : ''}
                        </div>
                    `;
                }
                break;
            case 'geometry':
                if (action === 'calculate') {
                    return `
                        <div class="log-data mt-2 small">
                            <strong>图形:</strong> ${data.shape}<br>
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                }
                break;

            case 'statistics':
                if (action === 'dataAnalysis') {
                    return `
                        <div class="log-data mt-2 small">
                            <strong>数据:</strong> ${data.inputData.length} 个值
                        </div>
                    `;
                } else if (action === 'chartGenerated') {
                    return `
                        <div class="log-data mt-2 small">
                            <strong>图表类型:</strong> ${data.chartType}
                        </div>
                    `;
                }
                break;
        }
        return '';
    }

    function showLogDetail(log) {
        const modal = new bootstrap.Modal(document.getElementById('logDetailModal'));
        const content = document.getElementById('logDetailContent');
        
        let dataDisplay = '';
        if (log.data && Object.keys(log.data).length > 0) {
            dataDisplay = formatLogData(log.tool, log.action, log.data);
        }
        
        content.innerHTML = `
            <div class="log-detail">
                <div class="mb-3">
                    <strong>时间:</strong> ${new Date(log.timestamp).toLocaleString()}
                </div>
                <div class="mb-3">
                    <strong>工具:</strong> ${getToolDisplayName(log.tool)}
                </div>
                <div class="mb-3">
                    <strong>操作:</strong> ${getActionDisplayName(log.action)}
                </div>
                ${dataDisplay}
            </div>
        `;
        
        modal.show();
    }

    function formatLogData(tool, action, data) {
        switch (tool) {
            case 'calculator':
                if (action === 'calculate') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>计算表达式:</strong> ${data.expression}<br>
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                } else if (action === 'percentageCalc') {
                    const typeNames = { 'of': '百分比', 'is': '占比', 'ofNumber': '数值百分比', 'increase': '增长率' };
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 百分比计算<br>
                            <strong>类型:</strong> ${typeNames[data.type] || data.type}<br>
                            <strong>输入:</strong> ${data.val1}, ${data.val2}<br>
                            <strong>结果:</strong> ${data.display}
                        </div>
                    `;
                } else if (action === 'fractionCalc') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 分数计算<br>
                            <strong>表达式:</strong> ${data.num1}/${data.den1} ${data.operator} ${data.num2}/${data.den2}<br>
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                }
                break;
            case 'converter':
                if (action === 'unitConvert') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>类别:</strong> ${data.category}<br>
                            <strong>输入:</strong> ${data.value} ${data.fromUnit}<br>
                            <strong>转换为:</strong> ${data.toUnit}<br>
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                } else if (action === 'baseConvert') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>输入:</strong> ${data.input} (${data.fromBase}进制)<br>
                            <strong>二进制:</strong> ${data.results.binary}<br>
                            <strong>八进制:</strong> ${data.results.octal}<br>
                            <strong>十进制:</strong> ${data.results.decimal}<br>
                            <strong>十六进制:</strong> ${data.results.hexadecimal}
                        </div>
                    `;
                }
                break;
            case 'algebra':
                if (action === 'equationSolve') {
                    let eqType = { 'linear': '一元一次', 'quadratic': '一元二次', 'system': '二元一次方程组' };
                    let eqInfo = '';
                    if (data.type === 'linear') {
                        eqInfo = `<strong>方程:</strong> ${data.a}x + ${data.b} = 0`;
                    } else if (data.type === 'quadratic') {
                        eqInfo = `<strong>方程:</strong> ${data.a}x² + ${data.b}x + ${data.c} = 0`;
                    } else if (data.type === 'system') {
                        eqInfo = `<strong>方程组:</strong><br>
                                  ${data.eq1.a}x + ${data.eq1.b}y = ${data.eq1.c}<br>
                                  ${data.eq2.a}x + ${data.eq2.b}y = ${data.eq2.c}`;
                    }
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 方程求解<br>
                            <strong>类型:</strong> ${eqType[data.type] || data.type}<br>
                            ${eqInfo}<br>
                            <strong>解:</strong> ${data.result}
                        </div>
                    `;
                } else if (action === 'factorization') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 因式分解<br>
                            <strong>表达式:</strong> ${data.expression}<br>
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                } else if (action === 'polynomialCalc') {
                    const opNames = { 'add': '加', 'subtract': '减', 'multiply': '乘', 'divide': '除' };
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 多项式运算<br>
                            <strong>多项式1:</strong> ${data.poly1}<br>
                            <strong>运算:</strong> ${opNames[data.operator] || data.operator}<br>
                            <strong>多项式2:</strong> ${data.poly2}<br>
                            <strong>结果:</strong> ${data.result}
                        </div>
                    `;
                } else if (action === 'functionPlot') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 函数绘图<br>
                            <strong>函数:</strong> y = ${data.function}<br>
                            <strong>已绘制函数数:</strong> ${data.totalFunctions}
                        </div>
                    `;
                } else if (action === 'matrixCalc') {
                    const opNames = { 'add': '加法', 'subtract': '减法', 'multiply': '乘法', 'determinant': '行列式', 'inverse': '逆矩阵', 'transpose': '转置' };
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 矩阵运算<br>
                            <strong>运算:</strong> ${opNames[data.operation] || data.operation}<br>
                            <strong>矩阵A:</strong> ${data.matrixA}<br>
                            ${data.matrixB ? `<strong>矩阵B:</strong> ${data.matrixB}<br>` : ''}
                            <strong>结果:</strong><br>${data.result.replace(/\t/g, ' ')}
                        </div>
                    `;
                }
                break;

            case 'navigation':
                if (action === 'openModule') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>模块:</strong> ${data.module}<br>
                            <strong>标题:</strong> ${data.title}
                        </div>
                    `;
                }
                break;
            case 'statistics':
                if (action === 'dataAnalysis') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 数据统计分析<br>
                            <strong>输入数据:</strong> ${data.inputData.join(', ')}<br>
                            <strong>均值:</strong> ${data.results.mean}<br>
                            <strong>中位数:</strong> ${data.results.median}<br>
                            <strong>众数:</strong> ${data.results.mode}<br>
                            <strong>方差:</strong> ${data.results.variance}<br>
                            <strong>标准差:</strong> ${data.results.stdDev}<br>
                            <strong>范围:</strong> ${data.results.range}
                        </div>
                    `;
                } else if (action === 'probabilityCalc') {
                    let probDetails = '';
                    if (data.calculationType === 'permutation') {
                        probDetails = `<strong>排列 P(${data.n}, ${data.r}):</strong> ${data.result}`;
                    } else if (data.calculationType === 'combination') {
                        probDetails = `<strong>组合 C(${data.n}, ${data.r}):</strong> ${data.result}`;
                    } else if (data.calculationType === 'normal') {
                        probDetails = `<strong>正态分布 P(X ≤ ${data.x}):</strong> ${data.probability}<br>
                                       <strong>Z值:</strong> ${data.z}`;
                    }
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 概率计算<br>
                            <strong>类型:</strong> ${data.calculationType === 'permutation' ? '排列' : data.calculationType === 'combination' ? '组合' : '正态分布'}<br>
                            ${probDetails}
                        </div>
                    `;
                } else if (action === 'chartGenerated') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 统计图表生成<br>
                            <strong>图表类型:</strong> ${data.chartType}<br>
                            <strong>标签:</strong> ${data.labels.join(', ')}<br>
                            <strong>数值:</strong> ${data.values.join(', ')}
                        </div>
                    `;
                }
                break;
            case 'geometry':
                if (action === 'planeGeometryCalc') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 平面几何计算<br>
                            <strong>图形:</strong> ${data.shape}<br>
                            <strong>结果:</strong> 面积 = ${data.area}, 周长 = ${data.perimeter}
                        </div>
                    `;
                } else if (action === 'solidGeometryCalc') {
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 立体几何计算<br>
                            <strong>图形:</strong> ${data.shape}<br>
                            <strong>结果:</strong> 体积 = ${data.volume}, 表面积 = ${data.surfaceArea}
                        </div>
                    `;
                } else if (action === 'coordinateConvert') {
                    let inputStr = '';
                    let resultStr = '';
                    if (data.inputType === 'polar') {
                        inputStr = `r = ${data.input.r}, θ = ${data.input.theta}°`;
                        resultStr = `X = ${data.result.x}, Y = ${data.result.y}`;
                    } else {
                        inputStr = `X = ${data.input.x}, Y = ${data.input.y}`;
                        resultStr = `r = ${data.result.r}, θ = ${data.result.theta}°`;
                    }
                    return `
                        <div class="log-data mt-2 p-2 bg-light rounded">
                            <strong>操作:</strong> 坐标转换<br>
                            <strong>类型:</strong> ${data.type}<br>
                            <strong>输入:</strong> ${inputStr}<br>
                            <strong>结果:</strong> ${resultStr}
                        </div>
                    `;
                }
                break;
        }
        return `
            <div class="log-data mt-2 p-2 bg-light rounded">
                ${JSON.stringify(data, null, 2)}
            </div>
        `;
    }

    function getToolDisplayName(tool) {
        const toolNames = {
            'calculator': '计算器',
            'converter': '转换器',
            'gobang': '五子棋',
            'navigation': '导航',
            'algebra': '代数工具',
            'geometry': '几何工具',
            'statistics': '统计与概率'
        };
        return toolNames[tool] || tool;
    }

    function getActionDisplayName(action) {
        const actionNames = {
            'calculate': '计算',
            'unitConvert': '单位转换',
            'baseConvert': '进制转换',
            'playerMove': '玩家落子',
            'aiMove': 'AI落子',
            'gameOver': '游戏结束',
            'openModule': '打开模块'
        };
        return actionNames[action] || action;
    }

    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.classList.add('page-loaded');
    });

    initAuth();
    initApp();
});

function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const authModal = document.getElementById('authModal');
    const authModalTitle = document.getElementById('authModalTitle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const switchToLoginDiv = document.getElementById('switchToLoginDiv');
    const authError = document.getElementById('authError');

    function showError(message) {
        authError.textContent = message;
        authError.classList.remove('d-none');
        authError.classList.remove('alert-success');
        authError.classList.add('alert-danger');
        setTimeout(() => {
            authError.classList.add('d-none');
        }, 3000);
    }

    function showSuccess(message) {
        authError.textContent = message;
        authError.classList.remove('d-none');
        authError.classList.remove('alert-danger');
        authError.classList.add('alert-success');
        setTimeout(() => {
            authError.classList.add('d-none');
        }, 3000);
    }

    function setLoggedIn(user) {
        userName.textContent = user.username;
        userInfo.classList.remove('d-none');
        loginBtn.classList.add('d-none');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', user.token);
    }

    function setLoggedOut() {
        userInfo.classList.add('d-none');
        loginBtn.classList.remove('d-none');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    }

    async function checkAuth() {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await fetch('/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                if (result.success) {
                    result.user.token = token;
                    setLoggedIn(result.user);
                } else {
                    setLoggedOut();
                }
            } catch {
                setLoggedOut();
            }
        }
    }

    loginBtn?.addEventListener('click', () => {
        const modal = new bootstrap.Modal(authModal);
        modal.show();
    });

    logoutBtn?.addEventListener('click', () => {
        setLoggedOut();
    });

    switchToRegister?.addEventListener('click', () => {
        authModalTitle.textContent = i18n.t('register');
        loginForm.classList.add('d-none');
        registerForm.classList.remove('d-none');
        switchToLoginDiv.classList.remove('d-none');
    });

    switchToLogin?.addEventListener('click', () => {
        authModalTitle.textContent = i18n.t('login');
        registerForm.classList.add('d-none');
        loginForm.classList.remove('d-none');
        switchToLoginDiv.classList.add('d-none');
    });

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginField = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loginField, password })
            });
            const result = await response.json();

            if (result.success) {
                setLoggedIn({ ...result.user, token: result.token });
                const modal = bootstrap.Modal.getInstance(authModal);
                modal.hide();
                loginForm.reset();
                showSuccess('登录成功');
            } else {
                showError(result.message);
            }
        } catch (error) {
            showError('登录失败，请稍后重试');
        }
    });

    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            const result = await response.json();

            if (result.success) {
                setLoggedIn({ ...result.user, token: result.token });
                const modal = bootstrap.Modal.getInstance(authModal);
                modal.hide();
                registerForm.reset();
            } else {
                showError(result.message);
            }
        } catch (error) {
            showError('注册失败，请稍后重试');
        }
    });

    checkAuth();
}

