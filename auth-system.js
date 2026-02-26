// auth-system.js - سیستم مدیریت کاربران با سوال امنیتی، بن، نظرات و پیام‌های تماس

class AuthSystem {
    constructor() {
        this.usersKey = 'website_users';
        this.currentUserKey = 'current_user';
        this.commentsKey = 'website_comments';
        this.messagesKey = 'contact_messages';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.usersKey)) {
            // ایجاد سوپر ادمین پیش‌فرض
            const superAdmin = {
                id: this.generateId(),
                firstName: 'ادمین',
                lastName: 'اصلی',
                email: 'aliebrahimi1100567321@gmail.com',
                password: 'Ebram1100',
                securityAnswer: 'admin',
                role: 'superadmin',
                banned: false,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem(this.usersKey, JSON.stringify([superAdmin]));
        }
        if (!localStorage.getItem(this.commentsKey)) {
            localStorage.setItem(this.commentsKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.messagesKey)) {
            localStorage.setItem(this.messagesKey, JSON.stringify([]));
        }
    }

    // ثبت‌نام کاربر جدید
    register(userData) {
        const users = this.getUsers();
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است' };
        }
        const newUser = {
            id: this.generateId(),
            ...userData,
            role: 'user',
            banned: false,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        this._saveUsers(users);
        return { success: true, message: 'ثبت‌نام با موفقیت انجام شد', user: newUser };
    }

    // ورود
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return { success: false, message: 'ایمیل یا رمز عبور اشتباه است' };
        }
        if (user.banned) {
            return { success: false, message: 'شما به دلایل امنیتی از سایت مسدود شده‌اید.' };
        }
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        return { success: true, message: 'ورود موفقیت‌آمیز بود', user };
    }

    // خروج
    logout() {
        localStorage.removeItem(this.currentUserKey);
        return { success: true };
    }

    // دریافت کاربر فعلی
    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }

    // آیا کاربر جاری ادمین (عادی یا سوپر) است؟
    isAdmin() {
        const user = this.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'superadmin');
    }

    // آیا کاربر جاری سوپرادمین است؟
    isSuperAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'superadmin';
    }

    // بازیابی رمز عبور با سوال امنیتی
    forgotPassword(email, securityAnswer, newPassword) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);
        if (!user) {
            return { success: false, message: 'کاربری با این ایمیل یافت نشد' };
        }
        if (user.securityAnswer !== securityAnswer) {
            return { success: false, message: 'پاسخ امنیتی اشتباه است' };
        }
        user.password = newPassword;
        this._saveUsers(users);
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.email === email) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        }
        return { success: true, message: 'رمز عبور با موفقیت تغییر کرد' };
    }

    // دریافت همه کاربران
    getAllUsers() {
        return this.getUsers();
    }

    // به‌روزرسانی یک کاربر
    updateUser(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return { success: false, message: 'کاربر یافت نشد' };
        users[index] = { ...users[index], ...updates };
        this._saveUsers(users);
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(users[index]));
        }
        return { success: true };
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    }

    _saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    // ========== نظرات ==========
    getComments() {
        return JSON.parse(localStorage.getItem(this.commentsKey)) || [];
    }

    addComment(comment) {
        const comments = this.getComments();
        const newComment = {
            id: this.generateId(),
            ...comment,
            timestamp: new Date().toISOString(),
            replies: []
        };
        comments.push(newComment);
        localStorage.setItem(this.commentsKey, JSON.stringify(comments));
        return newComment;
    }

    addReply(commentId, replyText, adminName) {
        const comments = this.getComments();
        const comment = comments.find(c => c.id === commentId);
        if (!comment) return false;
        const reply = {
            id: this.generateId(),
            text: replyText,
            adminName,
            timestamp: new Date().toISOString()
        };
        if (!comment.replies) comment.replies = [];
        comment.replies.push(reply);
        localStorage.setItem(this.commentsKey, JSON.stringify(comments));
        return true;
    }

    deleteComment(commentId) {
        let comments = this.getComments();
        comments = comments.filter(c => c.id !== commentId);
        localStorage.setItem(this.commentsKey, JSON.stringify(comments));
        return true;
    }

    // ========== پیام‌های تماس ==========
    getMessages() {
        return JSON.parse(localStorage.getItem(this.messagesKey)) || [];
    }

    addMessage(messageData) {
        const messages = this.getMessages();
        const newMessage = {
            id: this.generateId(),
            ...messageData,
            timestamp: new Date().toISOString(),
            replies: []
        };
        messages.push(newMessage);
        localStorage.setItem(this.messagesKey, JSON.stringify(messages));
        return newMessage;
    }

    addMessageReply(messageId, replyText, adminName) {
        const messages = this.getMessages();
        const message = messages.find(m => m.id === messageId);
        if (!message) return false;
        const reply = {
            id: this.generateId(),
            text: replyText,
            adminName,
            timestamp: new Date().toISOString()
        };
        if (!message.replies) message.replies = [];
        message.replies.push(reply);
        localStorage.setItem(this.messagesKey, JSON.stringify(messages));
        return true;
    }

    deleteMessage(messageId) {
        let messages = this.getMessages();
        messages = messages.filter(m => m.id !== messageId);
        localStorage.setItem(this.messagesKey, JSON.stringify(messages));
        return true;
    }

    getUserMessages(email) {
        const messages = this.getMessages();
        return messages.filter(m => m.email === email);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

const auth = new AuthSystem();