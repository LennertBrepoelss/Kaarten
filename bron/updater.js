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
  let pending = false, bar = null;
  function showBar() {
    if (bar) return;
    bar = document.createElement('div');
    bar.className = 'toast'; bar.style.bottom = 'calc(16px + env(safe-area-inset-bottom, 0px))'; bar.style.zIndex = 30;
    bar.innerHTML = '<span class="tx"><b>Nieuwe versie klaar</b> · laadt zodra je klaar bent</span><button class="btn soft sm" type="button">Nu laden</button>';
    bar.querySelector('button').onclick = () => location.reload();
    document.body.appendChild(bar);
  }
  async function check() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;
    try {
      const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
      const { v } = await r.json();
      if (v && v !== APP_VERSION) pending = true;
    } catch (e) {}
    if (pending) { if (safe()) location.reload(); else showBar(); }
  }
  // Ook herladen zodra je terugkeert naar een rustig scherm.
  document.addEventListener('click', () => { if (pending && safe()) setTimeout(() => { if (safe()) location.reload(); }, 400); }, true);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
  setInterval(check, 20000);
  setTimeout(check, 1500);
})();
