const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3002;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 处理根路径，返回index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 确保logs目录存在
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// 生成按时间命名的文件名
function generateFileName() {
    const now = new Date();
    const timestamp = now.toISOString()
        .replace(/T/g, '_')
        .replace(/:/g, '-')
        .replace(/\..+/, '');
    return `math_toolbox_logs_${timestamp}.json`;
}

// 保存日志到文件
function saveLogsToFile(logs) {
    const fileName = generateFileName();
    const filePath = path.join(logsDir, fileName);
    
    // 只保留最近1000条日志
    if (logs.length > 1000) {
        logs = logs.slice(-1000);
    }
    
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
    return fileName;
}

// 读取所有日志文件
function readAllLogs() {
    const logs = [];
    
    try {
        const files = fs.readdirSync(logsDir);
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(logsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const fileLogs = JSON.parse(content);
                logs.push(...fileLogs);
            }
        });
        
        // 按时间排序
        logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch (error) {
        console.error('Error reading logs:', error);
    }
    
    return logs;
}

// API接口

// 存储日志
app.post('/api/logs', (req, res) => {
    try {
        const logEntry = req.body;
        if (!logEntry) {
            return res.status(400).json({ error: 'No log data provided' });
        }
        
        // 读取现有日志
        const allLogs = readAllLogs();
        
        // 添加新日志
        allLogs.push(logEntry);
        
        // 保存到新文件
        const fileName = saveLogsToFile(allLogs);
        
        res.json({ success: true, fileName, logCount: allLogs.length });
    } catch (error) {
        console.error('Error saving log:', error);
        res.status(500).json({ error: 'Failed to save log' });
    }
});

// 获取所有日志
app.get('/api/logs', (req, res) => {
    try {
        const logs = readAllLogs();
        res.json({ success: true, logs });
    } catch (error) {
        console.error('Error reading logs:', error);
        res.status(500).json({ error: 'Failed to read logs' });
    }
});

// 清空日志
app.delete('/api/logs', (req, res) => {
    try {
        // 删除所有日志文件
        const files = fs.readdirSync(logsDir);
        files.forEach(file => {
            if (file.endsWith('.json')) {
                fs.unlinkSync(path.join(logsDir, file));
            }
        });
        
        res.json({ success: true, message: 'Logs cleared successfully' });
    } catch (error) {
        console.error('Error clearing logs:', error);
        res.status(500).json({ error: 'Failed to clear logs' });
    }
});

// 导出日志
app.get('/api/logs/export', (req, res) => {
    try {
        const logs = readAllLogs();
        const fileName = generateFileName();
        const filePath = path.join(logsDir, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
        
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error downloading logs:', err);
                res.status(500).json({ error: 'Failed to download logs' });
            }
        });
    } catch (error) {
        console.error('Error exporting logs:', error);
        res.status(500).json({ error: 'Failed to export logs' });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Logs directory: ${logsDir}`);
});