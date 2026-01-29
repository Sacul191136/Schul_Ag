// Einfacher interaktiver Monatskalender mit localStorage
document.addEventListener('DOMContentLoaded', () => {
  const monthYear = document.getElementById('monthYear');
  const calendarGrid = document.getElementById('calendarGrid');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const eventModal = document.getElementById('eventModal');
  const modalClose = document.getElementById('modalClose');
  const saveEvent = document.getElementById('saveEvent');
  const deleteEventBtn = document.getElementById('deleteEvent');
  const eventForm = document.getElementById('eventForm');
  const backHomeBtn = document.getElementById('backHome');
  const loginNotice = document.getElementById('loginNotice');

  let current = new Date();
  let editingEventId = null;
  const isAdmin = () => (typeof SessionManager !== 'undefined' && SessionManager.hasRole && SessionManager.hasRole('admin'));
  const isLoggedIn = () => (typeof SessionManager !== 'undefined' && SessionManager.isLoggedIn && SessionManager.isLoggedIn());

  function loadEvents(){
    return JSON.parse(localStorage.getItem('calendarEvents')||'[]');
  }
  function saveEvents(ev){
    localStorage.setItem('calendarEvents', JSON.stringify(ev));
  }

  function render(){
    calendarGrid.innerHTML = '';
    const weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So'];
    weekdays.forEach(d=>{
      const el = document.createElement('div'); el.className='weekday'; el.textContent=d; calendarGrid.appendChild(el);
    });

    const year = current.getFullYear();
    const month = current.getMonth();
    monthYear.textContent = current.toLocaleString('de-DE',{month:'long', year:'numeric'});

    const first = new Date(year, month, 1);
    const last = new Date(year, month+1, 0);
    // get day index (Monday=0)
    const startOffset = (first.getDay()+6)%7;

    // empty cells before first
    for(let i=0;i<startOffset;i++){
      const empty = document.createElement('div'); empty.className='day-cell'; empty.style.background='#fafafa'; calendarGrid.appendChild(empty);
    }

    const events = loadEvents();

    for(let d=1; d<= last.getDate(); d++){
      const date = new Date(year,month,d);
      const iso = date.toISOString().slice(0,10);
      const cell = document.createElement('div'); cell.className='day-cell'; cell.tabIndex=0; cell.setAttribute('data-date', iso);
      const num = document.createElement('div'); num.className='day-number'; num.textContent=d; cell.appendChild(num);

      const todaysEvents = events.filter(e=>e.date===iso);
      todaysEvents.slice(0,3).forEach(ev=>{
        const evEl = document.createElement('div'); evEl.className='event-item';
        const dot = document.createElement('span'); dot.className='event-dot'; dot.style.background = ev.ag && ev.ag.includes('Technik')? '#ff9800' : ev.ag && ev.ag.includes('Computer')? '#0066cc' : '#999';
        evEl.appendChild(dot);
        const txt = document.createElement('span'); txt.textContent = (ev.time? ev.time + ' ' : '') + ev.title;
        evEl.appendChild(txt);
        evEl.style.fontSize='0.9em'; evEl.style.marginTop='4px';
        cell.appendChild(evEl);
      });

      if(todaysEvents.length>3){
        const more = document.createElement('div'); more.textContent = '…+'+(todaysEvents.length-3)+' Termine'; more.style.fontSize='0.8em'; more.style.color='#666'; more.style.marginTop='6px'; cell.appendChild(more);
      }

      cell.addEventListener('click', ()=> openModalForDate(iso));
      calendarGrid.appendChild(cell);
    }
  }

  function openModalForDate(date, eventId){
    editingEventId = eventId || null;
    const events = loadEvents();
    document.getElementById('eventDate').value = date;

    const logged = isLoggedIn();

    if(eventId){
      const ev = events.find(x=>x.id===eventId);
      if(ev){
        document.getElementById('eventTime').value = ev.time||'';
        document.getElementById('eventTitle').value = ev.title||'';
        document.getElementById('eventAG').value = ev.ag||'Allgemein';
        document.getElementById('eventDesc').value = ev.desc||'';

        // delete button only for admins
        if(isAdmin()){
          deleteEventBtn.style.display='inline-block';
          deleteEventBtn.disabled = false;
        } else {
          deleteEventBtn.style.display='none';
          deleteEventBtn.disabled = true;
        }
        document.getElementById('modalTitle').textContent='Termin bearbeiten';
      }
    } else {
      eventForm.reset(); document.getElementById('eventDate').value = date; deleteEventBtn.style.display='none'; deleteEventBtn.disabled = true; document.getElementById('modalTitle').textContent='Termin hinzufügen';
    }

    // If not logged in -> view-only mode
    if(!logged){
      // disable inputs
      document.querySelectorAll('#eventForm input, #eventForm select, #eventForm textarea').forEach(el=>el.disabled=true);
      saveEvent.style.display = 'none';
      if(loginNotice) loginNotice.style.display='block';
    } else {
      document.querySelectorAll('#eventForm input, #eventForm select, #eventForm textarea').forEach(el=>el.disabled=false);
      saveEvent.style.display = 'inline-block';
      if(loginNotice) loginNotice.style.display='none';
    }

    eventModal.style.display='flex';
  }

  function closeModal(){ editingEventId=null; eventModal.style.display='none'; }

  saveEvent.addEventListener('click', ()=>{
    if(!isLoggedIn()){
      alert('Bitte einloggen, um Termine zu erstellen oder zu bearbeiten.');
      return;
    }
    const events = loadEvents();
    const data = {
      id: editingEventId || ('ev_'+Date.now()),
      date: document.getElementById('eventDate').value,
      time: document.getElementById('eventTime').value,
      title: document.getElementById('eventTitle').value,
      ag: document.getElementById('eventAG').value,
      desc: document.getElementById('eventDesc').value
    };
    if(!data.date || !data.title) return alert('Bitte Datum und Titel angeben.');
    if(editingEventId){
      const idx = events.findIndex(e=>e.id===editingEventId); if(idx>-1) events[idx]=data;
    } else events.push(data);
    saveEvents(events); closeModal(); render();
  });

  deleteEventBtn.addEventListener('click', ()=>{
    if(!editingEventId) return;
    // double-check admin rights before deleting
    if(!(typeof SessionManager !== 'undefined' && SessionManager.hasRole && SessionManager.hasRole('admin'))){
      alert('Nur Administratoren können Termine löschen.');
      return;
    }
    let events=loadEvents(); events = events.filter(e=>e.id!==editingEventId); saveEvents(events); closeModal(); render();
  });

  modalClose.addEventListener('click', closeModal);
  eventModal.addEventListener('click', (e)=>{ if(e.target===eventModal) closeModal(); });

  prevBtn.addEventListener('click', ()=>{ current.setMonth(current.getMonth()-1); render(); });
  nextBtn.addEventListener('click', ()=>{ current.setMonth(current.getMonth()+1); render(); });

  if(backHomeBtn){ backHomeBtn.addEventListener('click', ()=>{ window.location.href = 'index.html'; }); }

  // allow keyboard nav
  document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowLeft') prevBtn.click();
    if(e.key==='ArrowRight') nextBtn.click();
    if(e.key==='Escape') closeModal();
  });

  // initial sample events if none
  if(!localStorage.getItem('calendarEvents')){
    const sample = [
      {id:'ev_sample_1', date: new Date().toISOString().slice(0,10), time:'14:00', title:'Sprechstunde Technik', ag:'Technik AG', desc:'Offene Sprechstunde'},
    ]; saveEvents(sample);
  }

  render();
});
