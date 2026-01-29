// ============================
// PROJEKTMANAGEMENT
// ============================

protectPage();

document.addEventListener('DOMContentLoaded', function() {
    const newProjectBtn = document.getElementById('newProjectBtn');
    const projectModal = document.getElementById('projectModal');
    const projectCancel = document.getElementById('projectCancel');
    const projectSubmit = document.getElementById('projectSubmit');
    const agFilter = document.getElementById('agFilter');

    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            projectModal.style.display = 'flex';
        });
    }

    if (projectCancel) {
        projectCancel.addEventListener('click', function() {
            projectModal.style.display = 'none';
        });
    }

    if (projectSubmit) {
        projectSubmit.addEventListener('click', function() {
            const name = document.getElementById('projectName').value;
            const description = document.getElementById('projectDescription').value;
            const lead = document.getElementById('projectLead').value;
            const start = document.getElementById('projectStart').value;
            const end = document.getElementById('projectEnd').value;

            if (!name || !description || !lead || !start || !end) {
                alert('Bitte füllen Sie alle erforderlichen Felder aus.');
                return;
            }

            alert('✓ Projekt "' + name + '" erstellt!\nLeitung: ' + lead + '\nZeitraum: ' + start + ' bis ' + end);
            projectModal.style.display = 'none';
            document.getElementById('newProjectForm').reset();
        });
    }

    // AG Filter
    if (agFilter) {
        agFilter.addEventListener('change', filterProjekte);
        agFilter.addEventListener('input', filterProjekte);
    }

    // Project card click handlers
    document.querySelectorAll('.project-card').forEach(card => {
        const detailBtn = card.querySelector('.btn');
        if (detailBtn) {
            detailBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const projectName = card.querySelector('h3').textContent;
                alert('📋 Projektdetails für: ' + projectName + '\n\n(Diese Funktionalität wird noch erweitert)');
            });
        }
    });

    // Close modal on outside click
    projectModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
});

function filterProjekte() {
    const agFilterValue = (document.getElementById('agFilter')?.value || '').toString().trim().toLowerCase();

    document.querySelectorAll('.project-card').forEach(card => {
        const cardAg = (card.getAttribute('data-ag') || '').toString().trim().toLowerCase();
        const show = !agFilterValue || cardAg === agFilterValue || cardAg.includes(agFilterValue);
        card.style.display = show ? '' : 'none';
    });
}
