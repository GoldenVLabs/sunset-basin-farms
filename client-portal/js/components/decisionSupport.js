/* Basin Roots Precision Ag — client portal
   js/components/decisionSupport.js
   Renders the "What This Shows" section from static copy in CONFIG.copy.
   Deliberately cautious framing: monitoring and decision support, not
   automatic irrigation control.
   Relies on the shared Portal namespace declared in utils.js, which must
   load first. */

Portal.renderDecisionSupport = function renderDecisionSupport() {
  const root = document.getElementById('portal-decision-list');
  const { el } = Portal.utils;

  document.getElementById('portal-decision-intro').textContent = CONFIG.copy.whatThisShowsIntro;

  CONFIG.copy.whatThisShowsBullets.forEach(text => {
    root.appendChild(el('li', null, text));
  });

  document.getElementById('portal-decision-footnote').textContent = CONFIG.copy.whatThisShowsFootnote;
};
