// ============================
// TICKET MANAGEMENT
// ============================

protectPage();

document.addEventListener('DOMContentLoaded', function() {
    const newTicketBtn = document.getElementById('newTicketBtn');
    const ticketModal = document.getElementById('ticketModal');
    const ticketCancel = document.getElementById('ticketCancel');
    const ticketSubmit = document.getElementById('ticketSubmit');

    if (newTicketBtn) {
        newTicketBtn.addEventListener('click', function() {
            ticketModal.style.display = 'flex';
        });
    }

    if (ticketCancel) {
        ticketCancel.addEventListener('click', function() {
            ticketModal.style.display = 'none';
        });
    }

    if (ticketSubmit) {
        ticketSubmit.addEventListener('click', function() {
            const title = document.getElementById('ticketTitle').value;
            const category = document.getElementById('ticketCategory').value;
            const priority = document.getElementById('ticketPriority').value;
            const description = document.getElementById('ticketDescription').value;

            if (!title || !category || !description) {
                alert('Bitte füllen Sie alle erforderlichen Felder aus.');
                return;
            }

            alert('✓ Ticket #' + (Math.floor(Math.random() * 1000) + 100) + ' erstellt!\nSie werden benachrichtigt, wenn ein Techniker zugewiesen wird.');
            ticketModal.style.display = 'none';
            document.getElementById('newTicketForm').reset();
        });
    }

    // Filter functionality
    const searchTickets = document.getElementById('searchTickets');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const categoryFilter = document.getElementById('categoryFilter');

    [searchTickets, statusFilter, priorityFilter, categoryFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterTickets);
            filter.addEventListener('input', filterTickets);
        }
    });

    // Make tickets draggable
    makeTicketsDraggable();
});

function filterTickets() {
    const search = document.getElementById('searchTickets').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const priority = document.getElementById('priorityFilter').value;
    const category = document.getElementById('categoryFilter').value;

    document.querySelectorAll('.ticket-card').forEach(card => {
        let show = true;

        const title = card.querySelector('h4').textContent.toLowerCase();
        const cat = card.querySelector('.category').textContent;

        if (search && !title.includes(search) && !cat.includes(search)) {
            show = false;
        }

        if (status && !card.classList.contains('status-' + status)) {
            show = false;
        }

        if (priority) {
            const prioClass = [...card.classList].find(c => c.includes('high') || c.includes('medium') || c.includes('low'));
            if (priority === 'hoch' && !prioClass?.includes('high')) show = false;
            if (priority === 'mittel' && !prioClass?.includes('medium')) show = false;
            if (priority === 'niedrig' && !prioClass?.includes('low')) show = false;
        }

        if (category && !cat.includes(category)) {
            show = false;
        }

        card.style.display = show ? '' : 'none';
    });
}

function makeTicketsDraggable() {
    const tickets = document.querySelectorAll('.ticket-card');
    let draggedElement = null;

    tickets.forEach(ticket => {
        ticket.addEventListener('dragstart', function() {
            draggedElement = this;
            this.style.opacity = '0.5';
        });

        ticket.addEventListener('dragend', function() {
            this.style.opacity = '1';
            draggedElement = null;
        });
    });

    const columns = document.querySelectorAll('.kanban-cards');
    columns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = '#f0f0f0';
        });

        column.addEventListener('dragleave', function() {
            this.style.background = '';
        });

        column.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = '';
            if (draggedElement) {
                this.appendChild(draggedElement);
                alert('✓ Ticket aktualisiert');
            }
        });
    });
}
