class Logger {
    constructor() {
        this.apiUrl = '/api';
        this.logs = [];
        this.loadLogs();
    }

    async loadLogs() {
        try {
            const response = await fetch(`${this.apiUrl}/logs`);
            if (response.ok) {
                const data = await response.json();
                this.logs = data.logs || [];
            }
        } catch (error) {
            console.error('Error loading logs from backend:', error);
            this.logs = [];
        }
    }

    async saveLogs() {
        try {
            // 只保留最近1000条日志
            if (this.logs.length > 1000) {
                this.logs = this.logs.slice(-1000);
            }

            // 这里我们每次保存时只发送最新的日志，而不是所有日志
            // 实际项目中可能需要更复杂的同步机制
        } catch (error) {
            console.error('Error saving logs:', error);
        }
    }

    async log(tool, action, data = {}) {
        const logEntry = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            tool: tool,
            action: action,
            data: data,
            userAgent: navigator.userAgent
        };

        this.logs.push(logEntry);
        
        // 发送到后端
        try {
            const response = await fetch(`${this.apiUrl}/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
            });
            
            if (!response.ok) {
                console.error('Failed to save log to backend');
            }
        } catch (error) {
            console.error('Error saving log to backend:', error);
        }

        return logEntry;
    }

    getLogs(limit = 100) {
        return this.logs.slice(-limit).reverse();
    }

    async clearLogs() {
        this.logs = [];
        
        try {
            const response = await fetch(`${this.apiUrl}/logs`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                console.error('Failed to clear logs on backend');
            }
        } catch (error) {
            console.error('Error clearing logs on backend:', error);
        }
    }

    getToolUsage() {
        const usage = {};
        this.logs.forEach(log => {
            if (!usage[log.tool]) {
                usage[log.tool] = 0;
            }
            usage[log.tool]++;
        });
        return usage;
    }

    getRecentActivity(hours = 24) {
        const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
        return this.logs.filter(log => new Date(log.timestamp).getTime() >= cutoffTime);
    }

    }

const logger = new Logger();