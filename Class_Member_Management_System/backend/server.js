const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 导入路由
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 8080;  // 修改端口为8080

// 中间件
app.use(cors());
app.use(express.json());

// 数据库设置
const dbDir = path.resolve(__dirname, './database');
const dbPath = path.resolve(dbDir, 'classSystem.db');

// 确保数据库目录存在
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('数据库连接错误:', err.message);
    } else {
        console.log('成功连接到SQLite数据库');
        
        // 创建用户表
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )`);
        
        // 创建学生表
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            idNumber TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            className TEXT NOT NULL,
            gender TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            address TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
        )`);
        
        // 添加默认管理员用户
        db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
            if (!row) {
                const defaultAdmin = {
                    id: Date.now().toString(36),
                    username: 'admin',
                    password: 'admin123', // 实际应用中应该加密存储
                    role: 'admin',
                    createdAt: new Date().toISOString()
                };
                
                db.run(`INSERT INTO users (id, username, password, role, createdAt) 
                        VALUES (?, ?, ?, ?, ?)`,
                    [defaultAdmin.id, defaultAdmin.username, defaultAdmin.password, 
                     defaultAdmin.role, defaultAdmin.createdAt],
                    (err) => {
                        if (err) {
                            console.error('添加默认管理员失败:', err.message);
                        } else {
                            console.log('默认管理员创建成功: 用户名admin, 密码admin123');
                        }
                    }
                );
            }
        });
    }
});

// 使数据库实例在路由中可用
app.use((req, res, next) => {
    req.db = db;
    next();
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// 提供前端静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));

// 特殊处理：为不存在的dashboard.js返回空响应而不是HTML页面
app.get('/js/dashboard.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send('// 兼容性空文件');
});

// 定义特定路由，替代之前的通配符路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/register.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

app.get('/students.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/students.html'));
});

app.get('/add-student.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/add-student.html'));
});

// 使用正则表达式处理所有非API路由，支持前端路由
app.get(/^(?!\/api).*/, (req, res) => {
    // 对于所有非API路由，返回主页面以支持前端路由
    res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});