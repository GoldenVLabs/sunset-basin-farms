/* Basin Roots Precision Ag — client portal
   js/components/screenshotMode.js
   Toggles a clean, chrome-free view for marketing screenshots — either via
   the ?screenshot=1 URL parameter or the floating toggle button. The
   demonstration disclosure always stays visible; only interactive controls
   (like the chart range/metric toggles) are hidden by the CSS this applies.
   Relies on the shared Portal namespace declared in utils.js, which must
   load first. */

Portal.screenshotMode = (function () {
  const PARAM = 'screenshot';

  function isEnabled() {
    return new URLSearchParams(window.location.search).get(PARAM) === '1';
  }

  function apply(enabled) {
    document.body.classList.toggle('screenshot-mode', enabled);
    const btn = document.getElementById('portal-screenshot-toggle');
    if (btn) btn.textContent = enabled ? 'Exit Screenshot Mode' : 'Screenshot Mode';
  }

  function setEnabled(enabled) {
    const url = new URL(window.location.href);
    if (enabled) url.searchParams.set(PARAM, '1');
    else url.searchParams.delete(PARAM);
    window.history.replaceState(null, '', url.toString());
    apply(enabled);
  }

  function init() {
    apply(isEnabled());
    const btn = document.getElementById('portal-screenshot-toggle');
    if (btn) btn.addEventListener('click', () => setEnabled(!isEnabled()));
  }

  return { init, isEnabled, setEnabled };
})();
