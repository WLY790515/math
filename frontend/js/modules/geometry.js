class GeometryTools {
    constructor() {
        this.geometryCanvas = null;
        this.geoCtx = null;
        this.currentTool = 'point';
        this.shapes = [];
        this.history = [];
        this.historyIndex = -1;
        this.isDragging = false;
        this.startPoint = null;
        this.tempShape = null;
        this.zoom = 1;
        this.panOffset = { x: 0, y: 0 };
        this.gridSize = 20;
        this.draggedShape = null;
        this.dragStartPos = null;
        this.isDraggingShape = false;

        this.initGeometryCanvas();
        this.initPlaneGeometry();
        this.initSolidGeometry();
        this.initCoordinateTransform();
    }

    initGeometryCanvas() {
        const canvas = document.getElementById('geometryCanvas');
        if (!canvas) return;

        this.geometryCanvas = canvas;
        this.geoCtx = canvas.getContext('2d');

        this.drawGrid();

        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.getAttribute('data-tool');
            });
        });

        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        const zoomIn = document.getElementById('geoZoomIn');
        const zoomOut = document.getElementById('geoZoomOut');
        const reset = document.getElementById('geoReset');
        const clear = document.getElementById('geoClear');
        const undo = document.getElementById('geoUndo');
        const redo = document.getElementById('geoRedo');

        if (zoomIn) zoomIn.addEventListener('click', () => this.zoomIn());
        if (zoomOut) zoomOut.addEventListener('click', () => this.zoomOut());
        if (reset) reset.addEventListener('click', () => this.resetView());
        if (clear) clear.addEventListener('click', () => this.clearCanvas());
        if (undo) undo.addEventListener('click', () => this.undo());
        if (redo) redo.addEventListener('click', () => this.redo());
    }

    getMousePos(e) {
        const rect = this.geometryCanvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / this.zoom - this.panOffset.x;
        let y = (e.clientY - rect.top) / this.zoom - this.panOffset.y;
        
        // 网格吸附
        x = Math.round(x / this.gridSize) * this.gridSize;
        y = Math.round(y / this.gridSize) * this.gridSize;
        
        return { x, y };
    }

    drawGrid() {
        if (!this.geoCtx) return;

        const ctx = this.geoCtx;
        const canvas = this.geometryCanvas;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(this.panOffset.x, this.panOffset.y);

        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;

        const gridSize = 20;
        for (let x = -1000; x < 1000; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, -1000);
            ctx.lineTo(x, 1000);
            ctx.stroke();
        }
        for (let y = -1000; y < 1000; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(-1000, y);
            ctx.lineTo(1000, y);
            ctx.stroke();
        }

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(-1000, 0);
        ctx.lineTo(1000, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -1000);
        ctx.lineTo(0, 1000);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '12px Arial';

        for (let x = -1000; x <= 1000; x += 100) {
            if (x !== 0) {
                ctx.fillText(x.toString(), x - 5, 15);
            }
        }
        for (let y = -1000; y <= 1000; y += 100) {
            if (y !== 0) {
                ctx.fillText(y.toString(), 5, y + 4);
            }
        }

        this.shapes.forEach(shape => this.drawShape(shape));

        if (this.tempShape) {
            this.drawShape(this.tempShape);
        }

        ctx.restore();

        const coordsDisplay = document.getElementById('geoCoords');
        if (coordsDisplay) {
            const pos = this.getMousePos({ clientX: event?.clientX || 0, clientY: event?.clientY || 0 });
            coordsDisplay.textContent = `X: ${Math.round(pos.x)}, Y: ${Math.round(pos.y)}`;
        }
    }

    drawShape(shape) {
        const ctx = this.geoCtx;
        if (!ctx) return;

        ctx.strokeStyle = shape.color || '#2563eb';
        ctx.fillStyle = shape.fillColor || 'rgba(37, 99, 235, 0.1)';
        ctx.lineWidth = shape.lineWidth || 2;

        switch (shape.type) {
            case 'point':
                ctx.fillStyle = shape.color || '#2563eb';
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'line':
                ctx.beginPath();
                ctx.moveTo(shape.x1, shape.y1);
                ctx.lineTo(shape.x2, shape.y2);
                ctx.stroke();
                break;

            case 'circle':
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;

            case 'polygon':
                if (shape.points.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    shape.points.forEach(p => ctx.lineTo(p.x, p.y));
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                break;

            case 'arc':
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle || 0, shape.endAngle || Math.PI * 2);
                ctx.stroke();
                break;
        }
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        
        // 检查是否点击了点
        const clickedPoint = this.findPointAt(pos);
        if (clickedPoint) {
            this.isDraggingShape = true;
            this.draggedShape = clickedPoint;
            this.dragStartPos = pos;
            return;
        }

        this.startPoint = pos;
        this.isDragging = true;

        const infoDiv = document.getElementById('geoInfo');
        if (infoDiv) {
            infoDiv.textContent = `${i18n ? i18n.t('startPoint') : '起点'}: (${Math.round(pos.x)}, ${Math.round(pos.y)})`;
        }

        if (this.currentTool === 'polygon') {
            if (!this.tempShape) {
                this.tempShape = { type: 'polygon', points: [pos], color: '#2563eb', fillColor: 'rgba(37, 99, 235, 0.1)' };
            } else {
                this.tempShape.points.push(pos);
            }
            this.drawGrid();
        }
    }

    findPointAt(pos) {
        for (let shape of this.shapes) {
            if (shape.type === 'point') {
                const distance = Math.sqrt(Math.pow(shape.x - pos.x, 2) + Math.pow(shape.y - pos.y, 2));
                if (distance <= 10) {
                    return shape;
                }
            }
        }
        return null;
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        const coordsDisplay = document.getElementById('geoCoords');
        if (coordsDisplay) {
            coordsDisplay.textContent = `X: ${Math.round(pos.x)}, Y: ${Math.round(pos.y)}`;
        }

        // 处理形状拖动
        if (this.isDraggingShape && this.draggedShape) {
            const dx = pos.x - this.dragStartPos.x;
            const dy = pos.y - this.dragStartPos.y;
            
            this.draggedShape.x = pos.x;
            this.draggedShape.y = pos.y;
            
            // 更新连接到该点的线段
            this.updateConnectedLines(this.draggedShape);
            
            this.dragStartPos = pos;
            this.drawGrid();
            return;
        }

        if (!this.isDragging || !this.startPoint) return;

        const infoDiv = document.getElementById('geoInfo');
        if (infoDiv) {
            infoDiv.textContent = `${i18n ? i18n.t('current') : '当前'}: (${Math.round(pos.x)}, ${Math.round(pos.y)})`;
        }

        if (this.currentTool === 'line') {
            this.tempShape = {
                type: 'line',
                x1: this.startPoint.x,
                y1: this.startPoint.y,
                x2: pos.x,
                y2: pos.y,
                color: '#2563eb'
            };
        } else if (this.currentTool === 'circle') {
            const radius = Math.sqrt(Math.pow(pos.x - this.startPoint.x, 2) + Math.pow(pos.y - this.startPoint.y, 2));
            this.tempShape = {
                type: 'circle',
                x: this.startPoint.x,
                y: this.startPoint.y,
                radius: radius,
                color: '#2563eb',
                fillColor: 'rgba(37, 99, 235, 0.1)'
            };
        } else if (this.currentTool === 'arc') {
            const radius = Math.sqrt(Math.pow(pos.x - this.startPoint.x, 2) + Math.pow(pos.y - this.startPoint.y, 2));
            const startAngle = Math.atan2(this.startPoint.y - pos.y, this.startPoint.x - pos.x);
            this.tempShape = {
                type: 'arc',
                x: this.startPoint.x,
                y: this.startPoint.y,
                radius: radius,
                startAngle: startAngle,
                endAngle: startAngle + Math.PI,
                color: '#10b981'
            };
        }

        this.drawGrid();
    }

    updateConnectedLines(point) {
        for (let shape of this.shapes) {
            if (shape.type === 'line') {
                // 检查线段的两个端点是否与被拖动的点重合
                if (Math.abs(shape.x1 - point.x) < 1 && Math.abs(shape.y1 - point.y) < 1) {
                    shape.x1 = point.x;
                    shape.y1 = point.y;
                }
                if (Math.abs(shape.x2 - point.x) < 1 && Math.abs(shape.y2 - point.y) < 1) {
                    shape.x2 = point.x;
                    shape.y2 = point.y;
                }
            }
        }
    }

    handleMouseUp(e) {
        if (this.isDraggingShape) {
            this.isDraggingShape = false;
            this.draggedShape = null;
            this.dragStartPos = null;
            return;
        }

        if (!this.isDragging) return;

        const pos = this.getMousePos(e);
        this.isDragging = false;

        if (this.tempShape) {
            if (this.currentTool !== 'polygon') {
                this.addShape(this.tempShape);
            }
            this.tempShape = null;
        }

        if (this.currentTool === 'point') {
            this.addShape({
                type: 'point',
                x: pos.x,
                y: pos.y,
                color: '#2563eb'
            });
        }

        this.startPoint = null;
        this.drawGrid();
    }

    addShape(shape) {
        this.shapes.push(shape);
        this.history = this.shapes.slice(0, -1);
        this.historyIndex = this.history.length - 1;
    }

    zoomIn() {
        this.zoom *= 1.2;
        this.drawGrid();
    }

    zoomOut() {
        this.zoom /= 1.2;
        if (this.zoom < 0.1) this.zoom = 0.1;
        this.drawGrid();
    }

    resetView() {
        this.zoom = 1;
        this.panOffset = { x: 0, y: 0 };
        this.drawGrid();
    }

    clearCanvas() {
        this.shapes = [];
        this.tempShape = null;
        this.history = [];
        this.historyIndex = -1;
        this.drawGrid();
    }

    undo() {
        if (this.shapes.length > 0) {
            this.history.push(this.shapes.pop());
            this.historyIndex = this.history.length - 1;
            this.drawGrid();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.shapes.push(this.history[this.historyIndex]);
            this.drawGrid();
        }
    }

    initPlaneGeometry() {
        const calcBtn = document.getElementById('calculatePlane');
        const shapeSelect = document.getElementById('planeShape');
        const inputsDiv = document.getElementById('planeInputs');

        if (!calcBtn) return;

        if (shapeSelect) {
            shapeSelect.addEventListener('change', () => {
                this.updatePlaneInputs(shapeSelect.value, inputsDiv);
            });
        }

        this.updatePlaneInputs('triangle', inputsDiv);

        calcBtn.addEventListener('click', () => {
            const shape = shapeSelect ? shapeSelect.value : 'triangle';
            this.calculatePlaneGeometry(shape);
        });
    }

    updatePlaneInputs(shape, container) {
        if (!container) return;

        let html = '';

        switch (shape) {
            case 'triangle':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="base">${i18n ? i18n.t('base') : '底边'}</label>
                            <input type="number" id="planeA" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="height">${i18n ? i18n.t('height') : '高度'}</label>
                            <input type="number" id="planeH" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="side2">${i18n ? i18n.t('side2') : '边2'}</label>
                            <input type="number" id="planeB" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="side3">${i18n ? i18n.t('side3') : '边3'}</label>
                            <input type="number" id="planeC" class="form-control">
                        </div>
                    </div>
                `;
                break;
            case 'rectangle':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="length">${i18n ? i18n.t('length') : '长度'}</label>
                            <input type="number" id="planeA" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="width">${i18n ? i18n.t('width') : '宽度'}</label>
                            <input type="number" id="planeB" class="form-control">
                        </div>
                    </div>
                `;
                break;
            case 'circle':
                html = `
                    <div class="mb-3">
                        <label class="form-label" data-i18n="radius">${i18n ? i18n.t('radius') : '半径'}</label>
                        <input type="number" id="planeR" class="form-control">
                    </div>
                `;
                break;
            case 'parallelogram':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="base">${i18n ? i18n.t('base') : '底边'}</label>
                            <input type="number" id="planeA" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="height">${i18n ? i18n.t('height') : '高度'}</label>
                            <input type="number" id="planeH" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="hypotenuse">${i18n ? i18n.t('hypotenuse') : '斜边'}</label>
                            <input type="number" id="planeB" class="form-control">
                        </div>
                    </div>
                `;
                break;
            case 'trapezoid':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="topBase">${i18n ? i18n.t('topBase') : '上底'}</label>
                            <input type="number" id="planeA" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="bottomBase">${i18n ? i18n.t('bottomBase') : '下底'}</label>
                            <input type="number" id="planeB" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="height">${i18n ? i18n.t('height') : '高度'}</label>
                            <input type="number" id="planeH" class="form-control">
                        </div>
                    </div>
                `;
                break;
        }

        container.innerHTML = html;
    }

    calculatePlaneGeometry(shape) {
        const resultDiv = document.getElementById('planeResult');
        if (!resultDiv) return;

        let area = 0, perimeter = 0;
        let result = '';
        let logData = {};

        switch (shape) {
            case 'triangle':
                const base = parseFloat(document.getElementById('planeA').value) || 0;
                const height = parseFloat(document.getElementById('planeH').value) || 0;
                const side1 = parseFloat(document.getElementById('planeB').value) || 0;
                const side2 = parseFloat(document.getElementById('planeC').value) || 0;
                area = 0.5 * base * height;
                perimeter = base + side1 + side2;
                result = `三角形: 面积 = ${area.toFixed(2)}, 周长 = ${perimeter.toFixed(2)}`;
                logData = { shape: 'triangle', base, height, side1, side2, area: area.toFixed(2), perimeter: perimeter.toFixed(2) };
                break;

            case 'rectangle':
                const len = parseFloat(document.getElementById('planeA').value) || 0;
                const width = parseFloat(document.getElementById('planeB').value) || 0;
                area = len * width;
                perimeter = 2 * (len + width);
                result = `矩形: 面积 = ${area.toFixed(2)}, 周长 = ${perimeter.toFixed(2)}`;
                logData = { shape: 'rectangle', length: len, width, area: area.toFixed(2), perimeter: perimeter.toFixed(2) };
                break;

            case 'circle':
                const radius = parseFloat(document.getElementById('planeR').value) || 0;
                area = Math.PI * radius * radius;
                perimeter = 2 * Math.PI * radius;
                result = `圆形: 面积 = ${area.toFixed(2)}, 周长 = ${perimeter.toFixed(2)}`;
                logData = { shape: 'circle', radius, area: area.toFixed(2), perimeter: perimeter.toFixed(2) };
                break;

            case 'parallelogram':
                const baseP = parseFloat(document.getElementById('planeA').value) || 0;
                const heightP = parseFloat(document.getElementById('planeH').value) || 0;
                const sideP = parseFloat(document.getElementById('planeB').value) || 0;
                area = baseP * heightP;
                perimeter = 2 * (baseP + sideP);
                result = `平行四边形: 面积 = ${area.toFixed(2)}, 周长 = ${perimeter.toFixed(2)}`;
                logData = { shape: 'parallelogram', base: baseP, height: heightP, side: sideP, area: area.toFixed(2), perimeter: perimeter.toFixed(2) };
                break;

            case 'trapezoid':
                const top = parseFloat(document.getElementById('planeA').value) || 0;
                const bottom = parseFloat(document.getElementById('planeB').value) || 0;
                const heightT = parseFloat(document.getElementById('planeH').value) || 0;
                area = 0.5 * (top + bottom) * heightT;
                perimeter = top + bottom + 2 * Math.sqrt(Math.pow((bottom - top) / 2, 2) + Math.pow(heightT, 2));
                result = `梯形: 面积 = ${area.toFixed(2)}, 周长 = ${perimeter.toFixed(2)}`;
                logData = { shape: 'trapezoid', top, bottom, height: heightT, area: area.toFixed(2), perimeter: perimeter.toFixed(2) };
                break;
        }

        resultDiv.textContent = result;

        // 记录平面几何计算操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('geometry', 'planeGeometryCalc', logData);
        }
    }

    initSolidGeometry() {
        const calcBtn = document.getElementById('calculateSolid');
        const shapeSelect = document.getElementById('solidShape');
        const inputsDiv = document.getElementById('solidInputs');

        if (!calcBtn) return;

        if (shapeSelect) {
            shapeSelect.addEventListener('change', () => {
                this.updateSolidInputs(shapeSelect.value, inputsDiv);
            });
        }

        this.updateSolidInputs('cube', inputsDiv);

        calcBtn.addEventListener('click', () => {
            const shape = shapeSelect ? shapeSelect.value : 'cube';
            this.calculateSolidGeometry(shape);
        });
    }

    updateSolidInputs(shape, container) {
        if (!container) return;

        let html = '';

        switch (shape) {
            case 'cube':
                html = `
                    <div class="mb-3">
                        <label class="form-label" data-i18n="sideLength">${i18n ? i18n.t('sideLength') : '边长'}</label>
                        <input type="number" id="solidA" class="form-control">
                    </div>
                `;
                break;
            case 'sphere':
                html = `
                    <div class="mb-3">
                        <label class="form-label" data-i18n="radius">${i18n ? i18n.t('radius') : '半径'}</label>
                        <input type="number" id="solidR" class="form-control">
                    </div>
                `;
                break;
            case 'cylinder':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="radius">${i18n ? i18n.t('radius') : '半径'}</label>
                            <input type="number" id="solidR" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="height">${i18n ? i18n.t('height') : '高度'}</label>
                            <input type="number" id="solidH" class="form-control">
                        </div>
                    </div>
                `;
                break;
            case 'cone':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="radius">${i18n ? i18n.t('radius') : '半径'}</label>
                            <input type="number" id="solidR" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="height">${i18n ? i18n.t('height') : '高度'}</label>
                            <input type="number" id="solidH" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="slantHeight">${i18n ? i18n.t('slantHeight') : '母线长'}</label>
                            <input type="number" id="solidL" class="form-control">
                        </div>
                    </div>
                `;
                break;
            case 'pyramid':
                html = `
                    <div class="row">
                        <div class="col">
                            <label class="form-label" data-i18n="baseSide">${i18n ? i18n.t('baseSide') : '底边长'}</label>
                            <input type="number" id="solidA" class="form-control">
                        </div>
                        <div class="col">
                            <label class="form-label" data-i18n="height">${i18n ? i18n.t('height') : '高度'}</label>
                            <input type="number" id="solidH" class="form-control">
                        </div>
                    </div>
                `;
                break;
        }

        container.innerHTML = html;
    }

    calculateSolidGeometry(shape) {
        const resultDiv = document.getElementById('solidResult');
        if (!resultDiv) return;

        let volume = 0, surfaceArea = 0;
        let result = '';
        let logData = {};

        switch (shape) {
            case 'cube':
                const a = parseFloat(document.getElementById('solidA').value) || 0;
                volume = Math.pow(a, 3);
                surfaceArea = 6 * Math.pow(a, 2);
                result = `立方体: 体积 = ${volume.toFixed(2)}, 表面积 = ${surfaceArea.toFixed(2)}`;
                logData = { shape: 'cube', side: a, volume: volume.toFixed(2), surfaceArea: surfaceArea.toFixed(2) };
                break;

            case 'sphere':
                const r = parseFloat(document.getElementById('solidR').value) || 0;
                volume = (4 / 3) * Math.PI * Math.pow(r, 3);
                surfaceArea = 4 * Math.PI * Math.pow(r, 2);
                result = `球体: 体积 = ${volume.toFixed(2)}, 表面积 = ${surfaceArea.toFixed(2)}`;
                logData = { shape: 'sphere', radius: r, volume: volume.toFixed(2), surfaceArea: surfaceArea.toFixed(2) };
                break;

            case 'cylinder':
                const rC = parseFloat(document.getElementById('solidR').value) || 0;
                const hC = parseFloat(document.getElementById('solidH').value) || 0;
                volume = Math.PI * Math.pow(rC, 2) * hC;
                surfaceArea = 2 * Math.PI * rC * (rC + hC);
                result = `圆柱体: 体积 = ${volume.toFixed(2)}, 表面积 = ${surfaceArea.toFixed(2)}`;
                logData = { shape: 'cylinder', radius: rC, height: hC, volume: volume.toFixed(2), surfaceArea: surfaceArea.toFixed(2) };
                break;

            case 'cone':
                const rCo = parseFloat(document.getElementById('solidR').value) || 0;
                const hCo = parseFloat(document.getElementById('solidH').value) || 0;
                const lCo = parseFloat(document.getElementById('solidL').value) || Math.sqrt(Math.pow(rCo, 2) + Math.pow(hCo, 2));
                volume = (1 / 3) * Math.PI * Math.pow(rCo, 2) * hCo;
                surfaceArea = Math.PI * rCo * (rCo + lCo);
                result = `圆锥体: 体积 = ${volume.toFixed(2)}, 表面积 = ${surfaceArea.toFixed(2)}`;
                logData = { shape: 'cone', radius: rCo, height: hCo, slantHeight: lCo, volume: volume.toFixed(2), surfaceArea: surfaceArea.toFixed(2) };
                break;

            case 'pyramid':
                const aP = parseFloat(document.getElementById('solidA').value) || 0;
                const hP = parseFloat(document.getElementById('solidH').value) || 0;
                volume = (1 / 3) * Math.pow(aP, 2) * hP;
                surfaceArea = Math.pow(aP, 2) + 2 * aP * Math.sqrt(Math.pow(aP / 2, 2) + Math.pow(hP, 2));
                result = `棱锥: 体积 = ${volume.toFixed(2)}, 表面积 = ${surfaceArea.toFixed(2)}`;
                logData = { shape: 'pyramid', baseSide: aP, height: hP, volume: volume.toFixed(2), surfaceArea: surfaceArea.toFixed(2) };
                break;
        }

        resultDiv.textContent = result;

        // 记录立体几何计算操作
        if (typeof logger !== 'undefined' && logger) {
            logger.log('geometry', 'solidGeometryCalc', logData);
        }
    }

    initCoordinateTransform() {
        const convertBtn = document.getElementById('convertCoord');
        const typeSelect = document.getElementById('coordType');
        const label1 = document.getElementById('coordLabel1');
        const label2 = document.getElementById('coordLabel2');

        if (!convertBtn) return;

        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                if (typeSelect.value === 'cartesian') {
                    if (label1) label1.textContent = i18n ? i18n.t('coordX') : 'X';
                    if (label2) label2.textContent = i18n ? i18n.t('coordY') : 'Y';
                } else {
                    if (label1) label1.textContent = i18n ? i18n.t('coordR') : 'r';
                    if (label2) label2.textContent = i18n ? i18n.t('thetaDegrees') : 'θ (度)';
                }
            });
        }

        convertBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : 'cartesian';
            this.convertCoordinate(type);
        });
    }

    convertCoordinate(type) {
        const resultDiv = document.getElementById('coordResult');
        const val1 = parseFloat(document.getElementById('coordVal1').value) || 0;
        const val2 = parseFloat(document.getElementById('coordVal2').value) || 0;

        if (!resultDiv) return;

        let result = '';

        if (type === 'cartesian') {
            const r = val1;
            const theta = val2 * Math.PI / 180;
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            result = `直角坐标: X = ${x.toFixed(4)}, Y = ${y.toFixed(4)}`;
            
            // 记录坐标转换操作
            if (typeof logger !== 'undefined' && logger) {
                logger.log('geometry', 'coordinateConvert', {
                    type: '极坐标转直角坐标',
                    inputType: 'polar',
                    input: { r: val1, theta: val2 },
                    result: { x: x.toFixed(4), y: y.toFixed(4) }
                });
            }
        } else {
            const x = val1;
            const y = val2;
            const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            const theta = Math.atan2(y, x) * 180 / Math.PI;
            result = `极坐标: r = ${r.toFixed(4)}, θ = ${theta.toFixed(4)}°`;
            
            // 记录坐标转换操作
            if (typeof logger !== 'undefined' && logger) {
                logger.log('geometry', 'coordinateConvert', {
                    type: '直角坐标转极坐标',
                    inputType: 'cartesian',
                    input: { x: val1, y: val2 },
                    result: { r: r.toFixed(4), theta: theta.toFixed(4) }
                });
            }
        }

        resultDiv.textContent = result;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.geometryTools = new GeometryTools();
});