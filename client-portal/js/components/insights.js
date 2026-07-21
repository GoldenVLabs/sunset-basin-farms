/* Basin Roots Precision Ag — client portal
   js/components/insights.js
   Renders the Field Summary panel: client-friendly summary cards built from
   SENSOR_DATA.fieldSummary — presented as observations, not predictions or
   agronomic advice.
   Relies on the shared Portal namespace declared in utils.js, which must
   load first. */

Portal.renderFieldSummary = function renderFieldSummary() {
  const root = document.getElementById('portal-field-summary');
  const { el } = Portal.utils;

  SENSOR_DATA.fieldSummary.forEach(card => {
    const item = el('div', `portal-summary-card status-${card.status}`);
    item.append(
      el('div', 'portal-summary-card-label', card.label),
      el('div', 'portal-summary-card-headline', card.headline),
      el('p', 'portal-summary-card-detail', card.detail)
    );
    root.appendChild(item);
  });

  document.getElementById('portal-field-summary-status').textContent = CONFIG.copy.fieldSummaryStatusLine;
};
