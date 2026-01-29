// ============================
// DASHBOARD FUNCTIONALITY
// ============================

// Protect page - only logged-in users
protectPage();

document.addEventListener('DOMContentLoaded', function() {
    // Überprüfe ob Benutzer angemeldet ist
    const user = SessionManager.getCurrentUser();
    if (!user) {
        console.log('Dashboard: Kein Benutzer angemeldet');
        return;
    }

    console.log('✅ Dashboard geladen für:', user.name);

    // Update current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('today');
    if (dateEl) {
        dateEl.textContent = today.toLocaleDateString('de-DE', options);
    }

    // Make ticket cards clickable
    document.querySelectorAll('.ticket-card').forEach(card => {
        card.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            console.log('Ticket angezeigt: #' + ticketId);
        });
    });

    // Sidebar toggle for mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar') && !e.target.closest('.sidebar-toggle')) {
            sidebar.classList.remove('active');
        }
    });

    // Search functionality
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            console.log('Suche nach:', this.value);
        });
    }
});
