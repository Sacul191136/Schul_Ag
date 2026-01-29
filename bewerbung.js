// ============================
// BEWERBUNGSVERWALTUNG
// ============================

protectPage(['admin', 'teamleiter']);

// Mock Bewerbungen Data
const mockBewerbungen = [];

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const agFilter = document.getElementById('agFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterBewerbungen);
    }
    if (agFilter) {
        agFilter.addEventListener('change', filterBewerbungen);
    }

    // Modal functionality
    const bewerbungsModal = document.getElementById('bewerbungsModal');
    const modalClose = document.getElementById('modalClose');
    const modalSave = document.getElementById('modalSave');

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            bewerbungsModal.style.display = 'none';
        });
    }

    if (modalSave) {
        modalSave.addEventListener('click', function() {
            alert('✓ Bewerbung aktualisiert und E-Mail versendet!');
            bewerbungsModal.style.display = 'none';
        });
    }

    // Alle Bewerbungen laden
    loadBewerbungen();
});

function loadBewerbungen() {
    const buttons = document.querySelectorAll('.btn-view, .btn-edit');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const bewerbung = mockBewerbungen.find(b => b.name === row.querySelector('strong').textContent);
            
            if (bewerbung) {
                showBewerbungModal(bewerbung);
            }
        });
    });
}

function showBewerbungModal(bewerbung) {
    document.getElementById('modalName').value = bewerbung.name;
    document.getElementById('modalEmail').value = bewerbung.email;
    document.getElementById('modalKlasse').value = bewerbung.klasse;
    document.getElementById('modalAG').value = bewerbung.ag;
    document.getElementById('modalMotivation').value = bewerbung.motivation;
    document.getElementById('modalVorkenntnisse').value = bewerbung.vorkenntnisse;
    document.getElementById('modalStatus').value = bewerbung.status;
    
    document.getElementById('bewerbungsModal').style.display = 'flex';
}

function filterBewerbungen() {
    const statusFilter = document.getElementById('statusFilter').value;
    
    const computerRows = document.querySelectorAll('#table-computer tbody tr');
    const technikRows = document.querySelectorAll('#table-technik tbody tr');

    [...computerRows, ...technikRows].forEach(row => {
        let show = true;
        
        if (statusFilter && !row.classList.contains('status-' + statusFilter)) {
            show = false;
        }
        
        row.style.display = show ? '' : 'none';
    });
}
