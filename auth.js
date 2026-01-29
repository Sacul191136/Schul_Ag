// ============================
// AUTHENTICATION & SESSION SYSTEM
// ============================

// Mock User Database - Vordefinierte Benutzer
const mockUsers = [
    { id: 1, username: 'admin', email: 'admin@school.de', password: 'Sch00l!Admin2026', role: 'admin', name: 'Admin User', ag: 'Verwaltung', firstLoginDone: true },
    { id: 2, username: 'support', email: 'support@school.de', password: 'Sup#Port99Tech', role: 'support', name: 'Support Team', ag: 'Computer Service AG', firstLoginDone: true },
    { id: 3, username: 'technik', email: 'technik@school.de', password: 'T3chnik@2026Power', role: 'technik', name: 'Technik Team', ag: 'Technik AG', firstLoginDone: true },
    { id: 4, username: 'teamleiter', email: 'leiter@school.de', password: 'Lead3r!Team2026', role: 'teamleiter', name: 'Team Leiter', ag: 'Technik AG', firstLoginDone: true }
];

// Neue Benutzer mit Anfangsbuchstaben aus Nachnamen
const newUsers = [
    { id: 5, username: 'Ruschhaupt', initialPassword: 'Ru$ch#2025Pw@1', email: '', password: null, role: 'member', name: 'Ruschhaupt', ag: '', firstLoginDone: false },
    { id: 6, username: 'Lohmann', initialPassword: 'Lo&Mann2025!Sec', email: '', password: null, role: 'member', name: 'Lohmann', ag: '', firstLoginDone: false },
    { id: 7, username: 'Jung', initialPassword: 'Ju@2025Secure#9', email: '', password: null, role: 'member', name: 'Jung', ag: '', firstLoginDone: false },
    { id: 8, username: 'Neumann', initialPassword: 'Ne$2025Pass!Key', email: '', password: null, role: 'member', name: 'Neumann', ag: '', firstLoginDone: false },
    { id: 9, username: 'Ertas', initialPassword: 'Er#2025Taz$Sec', email: '', password: null, role: 'member', name: 'Ertas', ag: '', firstLoginDone: false },
    { id: 10, username: 'Kunze', initialPassword: 'Ku@2025Zen!Pwd', email: '', password: null, role: 'member', name: 'Kunze', ag: '', firstLoginDone: false },
    { id: 11, username: 'Jeisecke', initialPassword: 'Je#2025Sec$Safe', email: '', password: null, role: 'member', name: 'Jeisecke', ag: '', firstLoginDone: false },
    { id: 12, username: 'Getfert', initialPassword: 'Ge@2025Fert!Pwd', email: '', password: null, role: 'member', name: 'Getfert', ag: '', firstLoginDone: false },
    { id: 13, username: 'Haselman', initialPassword: 'Ha$2025Man!Sec#', email: '', password: null, role: 'member', name: 'Haselman', ag: '', firstLoginDone: false },
    { id: 14, username: 'Hielscher', initialPassword: 'Hi@2025Sch!Key$', email: '', password: null, role: 'member', name: 'Hielscher', ag: '', firstLoginDone: false },
    { id: 15, username: 'Borchers', initialPassword: 'Bo#2025Cher$Sec', email: '', password: null, role: 'member', name: 'Borchers', ag: '', firstLoginDone: false },
    { id: 16, username: 'Obermeier', initialPassword: 'Ob@2025Meier!Pwd', email: '', password: null, role: 'member', name: 'Obermeier', ag: '', firstLoginDone: false },
    { id: 17, username: 'Gehlert', initialPassword: 'Ge#2025Hler!Sec$', email: '', password: null, role: 'member', name: 'Gehlert', ag: '', firstLoginDone: false },
    { id: 18, username: 'test', initialPassword: 'Test@2025!123', email: 'test@example.de', password: 'Test@2025Secure!99', role: 'teamleiter', name: 'Test Account', ag: 'Technik AG', firstLoginDone: true },
    { id: 19, username: 'Lückenbach', initialPassword: 'Lü#ckenb2025!Pwd', email: '', password: null, role: 'member', name: 'Lückenbach', ag: '', firstLoginDone: false }
];

// Kombiniere alle Benutzer
let allUsers = [...mockUsers, ...newUsers];

// User Data Persistence Manager
const UserDataManager = {
    // Speichere alle Benutzerdaten im localStorage
    saveAllUsers: function() {
        localStorage.setItem('allUsersData', JSON.stringify(allUsers));
    },

    // Lade alle Benutzerdaten aus localStorage
    loadAllUsers: function() {
        const savedUsers = localStorage.getItem('allUsersData');
        if (savedUsers) {
            try {
                allUsers = JSON.parse(savedUsers);
                console.log('✅ Benutzerdaten aus localStorage geladen');
            } catch (e) {
                console.error('❌ Fehler beim Laden der Benutzerdaten:', e);
            }
        }
    },

    // Aktualisiere einen bestimmten Benutzer
    updateUser: function(username, updates) {
        const user = allUsers.find(u => u.username === username);
        if (user) {
            Object.assign(user, updates);
            this.saveAllUsers();
            return user;
        }
        return null;
    },

    // Hole einen Benutzer nach Username
    getUserByUsername: function(username) {
        return allUsers.find(u => u.username === username);
    }
};

// Lade Benutzerdaten beim Start
UserDataManager.loadAllUsers();

// Activity Logging Manager
const ActivityLogger = {
    logActivity: function(type, action, details = '') {
        const user = SessionManager.getCurrentUser();
        const log = {
            timestamp: new Date().toISOString(),
            type: type, // login, setup, password, admin, email
            user: user ? user.name : 'Unknown',
            action: action,
            details: details
        };

        let logs = [];
        const existingLogs = localStorage.getItem('activityLogs');
        if (existingLogs) {
            try {
                logs = JSON.parse(existingLogs);
            } catch (e) {
                logs = [];
            }
        }
        logs.push(log);
        localStorage.setItem('activityLogs', JSON.stringify(logs));
        console.log('📝 Activity logged:', log);
    }
};

// Session Management
const SessionManager = {
    // Speichere den aktuellen Benutzer
    setCurrentUser: function(user) {
        const userData = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            ag: user.ag,
            firstLoginDone: user.firstLoginDone
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('loginTime', new Date().toISOString());
    },

    // Hole aktuellen Benutzer
    getCurrentUser: function() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    // Prüfe, ob Benutzer angemeldet ist
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    },

    // Logout
    logout: function() {
        const user = this.getCurrentUser();
        if (user) {
            ActivityLogger.logActivity('login', 'Abmeldung', 'Benutzer hat sich abgemeldet');
        }
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
        window.location.href = 'login.html';
    },

    // Prüfe Rolle
    hasRole: function(requiredRoles) {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (typeof requiredRoles === 'string') {
            return user.role === requiredRoles;
        }
        return requiredRoles.includes(user.role);
    },

    // Prüfe Berechtigung (Permission)
    hasPermission: function(permission) {
        const user = this.getCurrentUser();
        if (!user) return false;

        // Admin-Berechtigungen
        const adminPermissions = [
            'view-activity-logs',
            'manage-users',
            'manage-roles',
            'view-reports',
            'system-settings',
            'view-security-logs'
        ];

        // Teamleiter-Berechtigungen
        const teamleiterPermissions = [
            'manage-team',
            'view-team-logs',
            'approve-requests'
        ];

        // Support-Berechtigungen
        const supportPermissions = [
            'help-users',
            'view-support-logs'
        ];

        let userPermissions = [];
        
        if (user.role === 'admin') {
            userPermissions = adminPermissions;
        } else if (user.role === 'teamleiter') {
            userPermissions = teamleiterPermissions;
        } else if (user.role === 'support') {
            userPermissions = supportPermissions;
        } else if (user.role === 'technik') {
            userPermissions = ['manage-tech'];
        }

        return userPermissions.includes(permission);
    }
};

// PAGE PROTECTION
function protectPage(requiredRoles = []) {
    // Warte bis DOM vollständig geladen ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            performPageProtection(requiredRoles);
        });
    } else {
        performPageProtection(requiredRoles);
    }
}

function performPageProtection(requiredRoles = []) {
    const user = SessionManager.getCurrentUser();
    
    if (!user) {
        console.log('⚠️ Nicht angemeldet - Weitergeleitet zu Login');
        window.location.href = 'login.html';
        return;
    }

    console.log('✅ Benutzer angemeldet:', user.name, '(Rolle:', user.role + ')');

    if (requiredRoles.length > 0 && !SessionManager.hasRole(requiredRoles)) {
        console.log('❌ Rolle nicht ausreichend');
        alert('Zugriff verweigert. Sie haben keine Berechtigung für diese Seite.');
        window.location.href = 'dashboard.html';
        return;
    }
}

// Update User Interface
function updateUserUI() {
    const user = SessionManager.getCurrentUser();
    if (!user) return;

    // Update Sidebar
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) {
        const roleLabels = {
            'admin': '👑 Administrator',
            'teamleiter': '🎯 Teamleiter',
            'support': '🛠️ Support',
            'technik': '⚡ Technik',
            'member': '👤 Mitglied'
        };
        userRoleEl.textContent = roleLabels[user.role] || user.role;
    }

    // Show/Hide Admin Elements
    const adminSections = document.querySelectorAll('[data-role]');
    adminSections.forEach(element => {
        const requiredRoles = element.getAttribute('data-role').split(',').map(r => r.trim());
        if (requiredRoles.includes(user.role) || requiredRoles.includes('all')) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
}

// LOGOUT BUTTON
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Möchten Sie sich abmelden?')) {
                SessionManager.logout();
            }
        });
    }

    // Update UI on page load
    updateUserUI();
});

// Export für andere Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SessionManager, protectPage, updateUserUI };
}
