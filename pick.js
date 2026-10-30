(() => {
  const KEY = 'tvx-me', ASKED = 'tvx-asked';
  const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const sel = document.getElementById('tvx-me'), dlg = document.getElementById('pick-team');
  const choose = (team) => { set(ASKED, '1'); if (team) { sel.value = team; sel.dispatchEvent(new Event('change', { bubbles: true })); } dlg.close(); };
  const open = () => {
    const teams = [...sel.options].map((o) => o.value);
    if (!teams.length) return setTimeout(open, 100);
    if (get(KEY) && teams.includes(get(KEY)) || get(ASKED)) return;
    const rec = new Map(window.TVX_DATA.players.map((p) => [p.owner, p.record]));
    const list = dlg.querySelector('.pick-list');
    list.replaceChildren(...teams.map((t) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pick-team';
      const n = document.createElement('span'); n.textContent = t;
      const r = document.createElement('span'); r.className = 'pick-rec'; r.textContent = rec.get(t) || '';
      b.append(n, r); b.addEventListener('click', () => choose(t)); return b;
    }));
    dlg.querySelector('.pick-skip').onclick = () => choose(null);
    dlg.addEventListener('cancel', () => set(ASKED, '1'));
    dlg.showModal(); dlg.querySelector('h2').focus();
  };
  open();
})();
