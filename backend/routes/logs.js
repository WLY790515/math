const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const logs = db.data.logs || [];
    res.json({ success: true, logs });
  } catch (error) {
    console.error('获取日志失败:', error);
    res.status(500).json({ success: false, message: '获取日志失败' });
  }
});

router.post('/', (req, res) => {
  try {
    const logEntry = {
      ...req.body,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };

    if (!db.data.logs) {
      db.data.logs = [];
    }

    db.data.logs.push(logEntry);
    db.write();

    res.json({ success: true, message: '日志保存成功', log: logEntry });
  } catch (error) {
    console.error('保存日志失败:', error);
    res.status(500).json({ success: false, message: '保存日志失败' });
  }
});

router.delete('/', (req, res) => {
  try {
    db.data.logs = [];
    db.write();
    res.json({ success: true, message: '日志已清空' });
  } catch (error) {
    console.error('清空日志失败:', error);
    res.status(500).json({ success: false, message: '清空日志失败' });
  }
});

module.exports = router;