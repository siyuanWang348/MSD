const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 数据库路径
const dbPath = path.resolve(__dirname, './database/classSystem.db');

// 确保数据库目录存在
const dbDir = path.resolve(__dirname, './database');
const fs = require('fs');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// 连接数据库
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('数据库连接错误:', err.message);
    } else {
        console.log('成功连接到SQLite数据库');
        initializeDatabase();
    }
});

// 初始化数据库并插入示例数据
function initializeDatabase() {
    // 创建用户表
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        createdAt TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('创建用户表失败:', err.message);
        } else {
            console.log('用户表创建成功');
            insertSampleUsers();
        }
    });
    
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
    )`, (err) => {
        if (err) {
            console.error('创建学生表失败:', err.message);
        } else {
            console.log('学生表创建成功');
            insertSampleStudents();
        }
    });
}

// 插入示例用户数据
function insertSampleUsers() {
    const users = [
        {
            id: uuidv4(),
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            username: 'teacher1',
            password: 'teacher123',
            role: 'teacher',
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            username: 'teacher2',
            password: 'teacher456',
            role: 'teacher',
            createdAt: new Date().toISOString()
        }
    ];
    
    const stmt = db.prepare(`INSERT OR IGNORE INTO users (id, username, password, role, createdAt) 
                             VALUES (?, ?, ?, ?, ?)`);
    
    users.forEach(user => {
        stmt.run([user.id, user.username, user.password, user.role, user.createdAt], function(err) {
            if (err) {
                console.error('插入用户数据失败:', err.message);
            } else {
                if (this.changes > 0) {
                    console.log(`用户 ${user.username} 插入成功`);
                } else {
                    console.log(`用户 ${user.username} 已存在`);
                }
            }
        });
    });
    
    stmt.finalize();
}

// 插入示例学生数据
function insertSampleStudents() {
    const students = [
        {
            id: uuidv4(),
            idNumber: '2021001',
            name: '张三',
            className: 'class1',
            gender: '男',
            phone: '13800138001',
            email: 'zhangsan@example.com',
            address: '北京市朝阳区',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            idNumber: '2021002',
            name: '李四',
            className: 'class1',
            gender: '女',
            phone: '13800138002',
            email: 'lisi@example.com',
            address: '上海市浦东新区',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            idNumber: '2021003',
            name: '王五',
            className: 'class2',
            gender: '男',
            phone: '13800138003',
            email: 'wangwu@example.com',
            address: '广州市天河区',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            idNumber: '2021004',
            name: '赵六',
            className: 'class2',
            gender: '女',
            phone: '13800138004',
            email: 'zhaoliu@example.com',
            address: '深圳市南山区',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            idNumber: '2021005',
            name: '钱七',
            className: 'class3',
            gender: '男',
            phone: '13800138005',
            email: 'qianqi@example.com',
            address: '杭州市西湖区',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    const stmt = db.prepare(`INSERT OR IGNORE INTO students 
        (id, idNumber, name, className, gender, phone, email, address, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    students.forEach(student => {
        stmt.run([
            student.id, student.idNumber, student.name, student.className, student.gender,
            student.phone, student.email, student.address, student.createdAt, student.updatedAt
        ], function(err) {
            if (err) {
                console.error('插入学生数据失败:', err.message);
            } else {
                if (this.changes > 0) {
                    console.log(`学生 ${student.name} 插入成功`);
                } else {
                    console.log(`学生 ${student.name} 已存在`);
                }
            }
        });
    });
    
    stmt.finalize();
}

// 关闭数据库连接
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('关闭数据库连接时出错:', err.message);
        } else {
            console.log('数据库连接已关闭');
        }
    });
});