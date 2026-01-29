// ============================
// LOGIN FUNCTIONALITY
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const remember = document.getElementById('remember').checked;

            // Validate input
            if (!username || !password) {
                alert('⚠️ Bitte füllen Sie alle Felder aus.');
                return;
            }

            // Find user in allUsers (kombinierte Liste)
            const user = UserDataManager.getUserByUsername(username);

            if (!user) {
                showErrorMsg('❌ Benutzer nicht gefunden');
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
                return;
            }

            // Prüfe ob es ein neuer Benutzer beim ersten Login ist
            if (!user.firstLoginDone) {
                // Prüfe ob das Anfangspasswort korrekt ist
                if (password !== user.initialPassword) {
                    showErrorMsg('❌ Falsches Passwort');
                    document.getElementById('password').value = '';
                    document.getElementById('password').focus();
                    return;
                }
                
                // Leite zum Passwort-Setup weiter
                sessionStorage.setItem('setupUserUsername', username);
                sessionStorage.setItem('setupUserPassword', user.initialPassword);
                window.location.href = 'first-login-setup.html';
                return;
            }

            // Prüfe ob ein temporäres Passwort verwendet wird
            const resetData = localStorage.getItem('passwordReset_' + username);
            let isTempPassword = false;
            if (resetData) {
                try {
                    const data = JSON.parse(resetData);
                    if (Date.now() < data.expiresAt && password === data.tempPassword) {
                        isTempPassword = true;
                        // Entferne das temporäre Passwort nach Gebrauch
                        localStorage.removeItem('passwordReset_' + username);
                    }
                } catch (e) {
                    console.error('Fehler beim Prüfen des temporären Passworts:', e);
                }
            }

            // Normales Login für Benutzer die bereits ihr Passwort gesetzt haben
            if (!isTempPassword && (!user.password || password !== user.password)) {
                showErrorMsg('❌ Benutzername oder Passwort ist falsch');
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
                return;
            }

            // Wenn temporäres Passwort verwendet wird, zum Reset weiterleiten
            if (isTempPassword) {
                sessionStorage.setItem('resetUserUsername', username);
                window.location.href = 'reset-password.html';
                return;
            }

            // Erfolgreiches Login
            SessionManager.setCurrentUser(user);
            
            // Logge die Anmeldung
            ActivityLogger.logActivity('login', 'Benutzer angemeldet', `Rolle: ${user.role}`);
            
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedUsername', username);
            }

            // Show success message
            showSuccessMsg('✅ Anmeldung erfolgreich!');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    // Auto-fill saved credentials
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername && document.getElementById('username')) {
            document.getElementById('username').value = savedUsername;
            document.getElementById('remember').checked = true;
            document.getElementById('password').focus();
        }
    }

    // Test: Log that login.js loaded
    console.log('✅ login.js loaded.');
});

// Hilfsfunktionen
function showErrorMsg(message) {
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #dc3545; color: white; padding: 1rem 1.5rem; border-radius: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 10000; font-weight: 600; max-width: 400px; text-align: center;';
    errorMsg.innerHTML = message;
    document.body.appendChild(errorMsg);

    setTimeout(() => {
        errorMsg.remove();
    }, 4000);
}

function showSuccessMsg(message) {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #51cf66; color: white; padding: 1rem 1.5rem; border-radius: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 10000; font-weight: 600;';
    successMsg.innerHTML = message + '<br><small>Wird zum Dashboard weitergeleitet...</small>';
    document.body.appendChild(successMsg);
}
