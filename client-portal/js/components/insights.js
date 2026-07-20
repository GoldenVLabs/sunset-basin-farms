/* Basin Roots Precision Ag — client portal
   js/components/insights.js
   Renders the Field Insights panel. Plain-language observations from
   SENSOR_DATA.insights — presented as observations, not predictions or
   agronomic advice.
   Relies on the shared Portal namespace declared in utils.js, which must
   load first. */

Portal.renderInsights = function renderInsights() {
  const root = document.getElementById('portal-insights-list');
  const { el } = Portal.utils;

  SENSOR_DATA.insights.forEach(text => {
    const item = el('div', 'portal-insight-item');
    item.append(el('span', 'marker'), el('p', null, text));
    root.appendChild(item);
  });
};
