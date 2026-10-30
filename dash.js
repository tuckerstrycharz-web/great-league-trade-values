// Stand-in for the dashboard runtime: resolves dash.calc datasets from window.TVX_DATA on demand.
(() => {
  const raw = window.TVX_DATA, calcs = {}, done = {}, fns = [];
  const resolve = (id) => {
    if (id in done) return done[id];
    if (id in raw) return (done[id] = raw[id]);
    const c = calcs[id]; if (!c) throw new Error('no dataset ' + id);
    return (done[id] = c.fn(...c.inputs.map(resolve)));
  };
  window.dash = {
    calc: (id, o) => { calcs[id] = o; },
    loader: () => {},
    data: (id) => { try { const d = resolve(id); return { status: 'ok', data: d, rows: d, columns: d.length ? Object.keys(d[0]) : [], meta: [] }; }
      catch (e) { console.error(e); return { status: 'error', data: [], message: String(e) }; } },
    onData: (fn) => { fns.push(fn); setTimeout(fn, 0); },
    colors: getComputedStyle(document.documentElement).getPropertyValue('--tvx-series').split(',').map((s) => s.trim()).filter(Boolean),
    params: () => ({}), setParams: () => {}, resetParams: () => {}, setLink: () => {}, refresh: () => {},
  };
})();
