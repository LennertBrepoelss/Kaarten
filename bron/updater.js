// Installeerbare app: offline werken en vanzelf de nieuwste versie laden.
(() => {
  const APP_VERSION = '__VERSION__';
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  // Veilig om te herladen: niet midden in het ingeven van een hand, spelletje of tijdens het delen.
  const safe = () => {
    const t = window.__troeven; if (!t) return true;
    const v = t.ui.view;
    return !t.ui.modal && !['wround', 'hround', 'draw', 'wsetup'].includes(v);
  };
  // ?v=... in het adres (van een vorige update) weer weghalen
  try { const u = new URL(location.href); if (u.searchParams.has('v')) { u.searchParams.delete('v'); history.replaceState(null, '', u.pathname + (u.search || '') + u.hash); } } catch (e) {}
  let pending = false, bar = null, newV = null;
  // Herladen met de nieuwe versie in het adres: zo krijg je zeker de nieuwe pagina en niet een oude kopie van de server.
  // Hooguit één keer per versie, zodat hij nooit blijft herladen.
  function reload() {
    const key = 'reloaded-' + newV;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch (e) {}
    location.replace(location.pathname + '?v=' + encodeURIComponent(newV || Date.now()));
  }
  function showBar() {
    if (bar) return;
    bar = document.createElement('div');
    bar.className = 'toast'; bar.style.bottom = 'calc(16px + env(safe-area-inset-bottom, 0px))'; bar.style.zIndex = 30;
    bar.innerHTML = '<span class="tx"><b>Nieuwe versie klaar</b> · laadt zodra je klaar bent</span><button class="btn soft sm" type="button">Nu laden</button>';
    bar.querySelector('button').onclick = () => reload();
    document.body.appendChild(bar);
  }
  async function check() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;
    try {
      const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
      const { v } = await r.json();
      if (v && v !== APP_VERSION) { pending = true; newV = v; }
    } catch (e) {}
    if (pending) { if (safe()) reload(); else showBar(); }
  }
  // Ook herladen zodra je terugkeert naar een rustig scherm.
  document.addEventListener('click', () => { if (pending && safe()) setTimeout(() => { if (safe()) reload(); }, 400); }, true);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
  setInterval(check, 20000);
  setTimeout(check, 1500);
})();
