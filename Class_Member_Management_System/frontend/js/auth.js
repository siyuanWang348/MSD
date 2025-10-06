// 后端API地址 - 修改为相对路径，因为前端和后端现在统一部署
const API_URL = '/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查用户是否已登录，如果已登录则跳转到仪表盘
    if (isLoggedIn() && window.location.pathname.includes('index.html') || 
        window.location.pathname.includes('register.html')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // 登录表单提交
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 注册表单提交
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 通知关闭按钮
    const closeNotification = document.getElementById('close-notification');
    if (closeNotification) {
        closeNotification.addEventListener('click', hideNotification);
    }
});

// 检查用户是否已登录
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '登录失败');
        }
        
        // 保存token和用户信息
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 显示成功通知并跳转
        showNotification('登录成功', `欢迎回来，${data.user.username}`, 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        showNotification('登录失败', error.message, 'error');
    }
}

// 处理注册
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '注册失败');
        }
        
        // 显示成功通知并跳转登录页
        showNotification('注册成功', '您可以使用新账号登录了', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        showNotification('注册失败', error.message, 'error');
    }
}

// 显示通知
function showNotification(title, message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.getElementById('notification-icon');
    
    if (!notification) return;
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // 重置样式
    notification.className = 'fixed bottom-6 right-6 p-4 rounded-lg shadow-lg transform transition-all duration-300 flex items-center max-w-sm';
    
    // 根据类型设置样式和图标
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-100', 'border', 'border-green-200');
            notificationIcon.innerHTML = '<i class="fa fa-check-circle text-green-500"></i>';
            break;
        case 'error':
            notification.classList.add('bg-red-100', 'border', 'border-red-200');
            notificationIcon.innerHTML = '<i class="fa fa-exclamation-circle text-red-500"></i>';
            break;
        case 'warning':
            notification.classList.add('bg-yellow-100', 'border', 'border-yellow-200');
            notificationIcon.innerHTML = '<i class="fa fa-exclamation-triangle text-yellow-500"></i>';
            break;
        default:
            notification.classList.add('bg-blue-100', 'border', 'border-blue-200');
            notificationIcon.innerHTML = '<i class="fa fa-info-circle text-blue-500"></i>';
    }
    
    // 显示通知
    notification.classList.remove('translate-y-20', 'opacity-0', 'hidden');
    notification.classList.add('translate-y-0', 'opacity-100');
    
    // 3秒后自动隐藏
    setTimeout(hideNotification, 3000);
}

// 隐藏通知
function hideNotification() {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.classList.remove('translate-y-0', 'opacity-100');
    notification.classList.add('translate-y-20', 'opacity-0');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 300);
}
    