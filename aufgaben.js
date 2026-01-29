// ============================
// AUFGABENVERWALTUNG
// ============================

protectPage();

document.addEventListener('DOMContentLoaded', function() {
    const newTaskBtn = document.getElementById('newTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const taskCancel = document.getElementById('taskCancel');
    const taskSubmit = document.getElementById('taskSubmit');

    if (newTaskBtn) {
        newTaskBtn.addEventListener('click', function() {
            taskModal.style.display = 'flex';
        });
    }

    if (taskCancel) {
        taskCancel.addEventListener('click', function() {
            taskModal.style.display = 'none';
        });
    }

    if (taskSubmit) {
        taskSubmit.addEventListener('click', function() {
            const title = document.getElementById('taskTitle').value;
            const assignee = document.getElementById('taskAssignee').value;
            const project = document.getElementById('taskProject').value;
            const deadline = document.getElementById('taskDeadline').value;

            if (!title || !assignee || !project || !deadline) {
                alert('Bitte füllen Sie alle erforderlichen Felder aus.');
                return;
            }

            alert('✓ Aufgabe erstellt!\n' + title + '\n👤 Zugewiesen an: ' + assignee + '\n📅 Fällig: ' + deadline);
            taskModal.style.display = 'none';
            document.getElementById('newTaskForm').reset();
        });
    }

    // Filter functionality
    const searchTasks = document.getElementById('searchTasks');
    const priorityFilter = document.getElementById('priorityFilter');
    const assigneeFilter = document.getElementById('assigneeFilter');

    [searchTasks, priorityFilter, assigneeFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterTasks);
            filter.addEventListener('input', filterTasks);
        }
    });

    // Task completion toggle
    document.querySelectorAll('.admin-table input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const row = this.closest('tr');
            if (this.checked) {
                row.style.opacity = '0.6';
                row.style.textDecoration = 'line-through';
            } else {
                row.style.opacity = '1';
                row.style.textDecoration = 'none';
            }
        });
    });
});

function filterTasks() {
    const search = document.getElementById('searchTasks').value.toLowerCase();
    const priority = document.getElementById('priorityFilter').value;
    const assignee = document.getElementById('assigneeFilter').value;

    document.querySelectorAll('.admin-table tbody tr').forEach(row => {
        let show = true;

        const title = row.cells[1].textContent.toLowerCase();
        const assigned = row.cells[1].textContent;

        if (search && !title.includes(search)) {
            show = false;
        }

        if (priority) {
            const rowPriority = row.className;
            if (priority === 'hoch' && !rowPriority.includes('high')) show = false;
            if (priority === 'mittel' && !rowPriority.includes('medium')) show = false;
            if (priority === 'niedrig' && !rowPriority.includes('low')) show = false;
        }

        if (assignee === 'me') {
            // Hier würde man gegen den aktuellen Benutzer filtern
            show = Math.random() > 0.5; // Demo
        }

        row.style.display = show ? '' : 'none';
    });
}
