// 学生管理相关功能

document.addEventListener('DOMContentLoaded', () => {
    // 初始化页面功能
    initStudentPage();
});

// 初始化学生页面功能
function initStudentPage() {
    // 根据当前页面执行不同的初始化逻辑
    if (window.location.pathname.includes('students.html')) {
        initStudentList();
    } else if (window.location.pathname.includes('add-student.html')) {
        initAddStudent();
    }
    
    // 绑定导航按钮事件
    bindNavigationEvents();
}

// 初始化学生列表页面
function initStudentList() {
    console.log('初始化学生列表页面');
    
    // 绑定搜索按钮事件
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // 绑定添加学生按钮事件
    const addStudentBtn = document.getElementById('add-student-btn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            window.location.href = 'add-student.html';
        });
    }
    
    // 绑定删除相关事件
    bindDeleteEvents();
    
    // 绑定编辑按钮事件
    bindEditEvents();
}

// 初始化添加学生页面
function initAddStudent() {
    console.log('初始化添加学生页面');
    
    // 绑定表单提交事件
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
        studentForm.addEventListener('submit', handleAddStudent);
    }
    
    // 绑定取消按钮事件
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'students.html';
        });
    }
}

// 绑定导航事件
function bindNavigationEvents() {
    // 移动端菜单切换
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // 登出按钮事件
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // 通知关闭按钮
    const closeNotification = document.getElementById('close-notification');
    if (closeNotification) {
        closeNotification.addEventListener('click', hideNotification);
    }
}

// 处理登出
function handleLogout() {
    // 清除登录状态
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 显示通知
    showNotification('已登出', '您已成功退出登录', 'info');
    
    // 跳转到登录页
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// 处理搜索
function handleSearch() {
    const name = document.getElementById('search-name').value;
    const className = document.getElementById('search-class').value;
    const id = document.getElementById('search-id').value;
    
    // 这里应该调用API进行搜索，目前仅作为示例
    console.log('搜索条件:', { name, className, id });
    showNotification('搜索', '搜索功能已触发，请连接后端API实现完整功能', 'info');
}

// 绑定删除事件
function bindDeleteEvents() {
    // 获取所有删除按钮
    const deleteButtons = document.querySelectorAll('button.text-red-600');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 显示删除确认对话框
            const modal = document.getElementById('delete-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                
                // 绑定确认删除事件
                const confirmDelete = document.getElementById('confirm-delete');
                if (confirmDelete) {
                    confirmDelete.onclick = function() {
                        // 这里应该调用API删除学生，目前仅作为示例
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        showNotification('删除成功', '学生信息已删除', 'success');
                    };
                }
                
                // 绑定取消删除事件
                const cancelDelete = document.getElementById('cancel-delete');
                const closeModal = document.getElementById('close-modal');
                if (cancelDelete) {
                    cancelDelete.onclick = function() {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                    };
                }
                if (closeModal) {
                    closeModal.onclick = function() {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                    };
                }
            }
        });
    });
}

// 绑定编辑事件
function bindEditEvents() {
    // 获取所有编辑按钮
    const editButtons = document.querySelectorAll('button.text-primary');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 这里应该跳转到编辑页面或打开编辑模态框
            showNotification('编辑功能', '编辑功能请连接后端API实现', 'info');
        });
    });
}

// 处理添加学生
function handleAddStudent(e) {
    e.preventDefault();
    
    // 获取表单数据
    const studentData = {
        id: document.getElementById('student-id').value,
        name: document.getElementById('student-name').value,
        className: document.getElementById('student-class').value,
        gender: document.getElementById('student-gender').value,
        phone: document.getElementById('student-phone').value,
        email: document.getElementById('student-email').value,
        address: document.getElementById('student-address').value
    };
    
    // 简单验证
    if (!studentData.id || !studentData.name || !studentData.className || 
        !studentData.gender || !studentData.phone) {
        showNotification('表单验证失败', '请填写所有必填字段', 'error');
        return;
    }
    
    // 这里应该调用API添加学生，目前仅作为示例
    console.log('添加学生:', studentData);
    showNotification('添加成功', '学生信息已添加，请连接后端API实现持久化存储', 'success');
    
    // 重置表单
    document.getElementById('student-form').reset();
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
    
    // 设置图标和颜色
    if (type === 'success') {
        notificationIcon.className = 'fa fa-check-circle text-green-500';
        notification.className = 'fixed bottom-6 right-6 p-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 flex items-center max-w-sm bg-green-50 border-l-4 border-green-500';
    } else if (type === 'error') {
        notificationIcon.className = 'fa fa-exclamation-circle text-red-500';
        notification.className = 'fixed bottom-6 right-6 p-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 flex items-center max-w-sm bg-red-50 border-l-4 border-red-500';
    } else {
        notificationIcon.className = 'fa fa-info-circle text-blue-500';
        notification.className = 'fixed bottom-6 right-6 p-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 flex items-center max-w-sm bg-blue-50 border-l-4 border-blue-500';
    }
    
    // 显示通知
    notification.classList.remove('hidden');
    
    // 3秒后自动隐藏
    setTimeout(() => {
        notification.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

// 隐藏通知
function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }
}