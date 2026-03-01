// =====================
// AUTHENTICATION MODULE
// =====================

// Admin credentials stored in localStorage (dynamic, not hardcoded)
// Initialize with default admin if no admins exist
function initializeAdminAccounts() {
    const admins = localStorage.getItem('adminAccounts');
    if (!admins) {
        const defaultAdmin = [{
            id: 1,
            username: '',
            password: '',
            createdAt: new Date().toISOString()
        }];
        localStorage.setItem('adminAccounts', JSON.stringify(defaultAdmin));
    }
}

// Get all admin accounts
function getAdminAccounts() {
    initializeAdminAccounts();
    return JSON.parse(localStorage.getItem('adminAccounts')) || [];
}

// Save admin accounts
function saveAdminAccounts(admins) {
    localStorage.setItem('adminAccounts', JSON.stringify(admins));
}

// Register a new admin account (limit to one admins)
function registerAdmin(username, password) {
    const admins = getAdminAccounts();
    
    // Check if admin account already exists (limit to one accounts)
    if (admins.length >= 1) {
        return { success: false, message: 'Only one admin account is allowed. Please login with existing credentials.' };
    }
    
    // Check if username already exists
    if (admins.find(a => a.username === username)) {
        return { success: false, message: 'Username already exists' };
    }
    
    const newAdmin = {
        id: Date.now(),
        username,
        password,
        createdAt: new Date().toISOString()
    };
    
    admins.push(newAdmin);
    saveAdminAccounts(admins);
    
    return { success: true, admin: newAdmin };
}

// Delete an admin account
function deleteAdminAccount(adminId) {
    let admins = getAdminAccounts();
    admins = admins.filter(a => a.id !== adminId);
    saveAdminAccounts(admins);
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Check if admin is logged in
function isAdminLoggedIn() {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
}

// Login user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password' };
}

// Register user
function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
    // Clear cart on logout
    const cartKey = 'cart_guest';
    localStorage.setItem(cartKey, JSON.stringify([]));
    window.location.reload();
}

// Admin login - uses dynamic admin accounts from localStorage
function adminLogin(username, password) {
    const admins = getAdminAccounts();
    const admin = admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        return { success: true, admin };
    }
    return { success: false, message: 'Invalid admin credentials' };
}

// Admin logout
function adminLogout() {
    localStorage.setItem('isAdminLoggedIn', 'false');
    // Close admin dashboard modal if open
    const adminDashboardModal = document.getElementById('adminDashboardModal');
    if (adminDashboardModal) {
        adminDashboardModal.style.display = 'none';
    }
    // Update UI
    updateUserUI();
}

// Update user UI based on login state
function updateUserUI() {
    const currentUser = getCurrentUser();
    const adminLoggedIn = isAdminLoggedIn();
    
    const loggedOutMenu = document.getElementById('loggedOutMenu');
    const loggedInMenu = document.getElementById('loggedInMenu');
    const adminLoggedInMenu = document.getElementById('adminLoggedInMenu');
    const adminBadge = document.getElementById('adminBadge');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const adminWelcomeMsg = document.getElementById('adminWelcomeMsg');
    
    if (adminLoggedIn) {
        if (loggedOutMenu) loggedOutMenu.style.display = 'none';
        if (loggedInMenu) loggedInMenu.style.display = 'none';
        if (adminLoggedInMenu) adminLoggedInMenu.style.display = 'block';
        if (adminBadge) adminBadge.style.display = 'block';
        if (adminWelcomeMsg) adminWelcomeMsg.textContent = 'Admin Panel';
    } else if (currentUser) {
        if (loggedOutMenu) loggedOutMenu.style.display = 'none';
        if (loggedInMenu) loggedInMenu.style.display = 'block';
        if (adminLoggedInMenu) adminLoggedInMenu.style.display = 'none';
        if (adminBadge) adminBadge.style.display = 'none';
        if (welcomeMsg) welcomeMsg.textContent = `Welcome, ${currentUser.name}!`;
    } else {
        if (loggedOutMenu) loggedOutMenu.style.display = 'block';
        if (loggedInMenu) loggedInMenu.style.display = 'none';
        if (adminLoggedInMenu) adminLoggedInMenu.style.display = 'none';
        if (adminBadge) adminBadge.style.display = 'none';
    }
}

// Get all users (for admin)
function getAllUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Delete user (for admin)
function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
}

// Add user (for admin)
function addUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
}

// Update user (for admin)
function updateUser(userId, name, email, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], name, email, password };
        localStorage.setItem('users', JSON.stringify(users));
        return users[index];
    }
    return null;
}

// Export functions
window.authFunctions = {
    getCurrentUser,
    isAdminLoggedIn,
    loginUser,
    registerUser,
    logoutUser,
    adminLogin,
    adminLogout,
    updateUserUI,
    getAllUsers,
    deleteUser,
    addUser,
    updateUser,
    // New admin account functions
    registerAdmin,
    getAdminAccounts,
    deleteAdminAccount
};

// Initialize auth functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.authFunctions) {
        window.authFunctions.updateUserUI();
    }
});
