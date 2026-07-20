/* Basin Roots Precision Ag — client portal
   js/components/timeline.js
   Renders the recent-events timeline from SENSOR_DATA.events (newest first).
   Relies on the shared Portal namespace declared in utils.js, which must
   load first. */

Portal.renderTimeline = function renderTimeline() {
  const root = document.getElementById('portal-timeline');
  const { el, formatWeekdayTime } = Portal.utils;

  SENSOR_DATA.events.forEach(event => {
    const item = el('div', 'portal-timeline-item');

    const time = el('div', 'portal-timeline-time', formatWeekdayTime(event.timestamp));

    const iconWrap = el('div', 'portal-timeline-icon');
    iconWrap.appendChild(el('span', `dot ${event.status}`));

    const body = el('div');
    body.append(
      el('div', 'portal-timeline-title', event.title),
      el('p', 'portal-timeline-desc', event.description)
    );

    item.append(time, iconWrap, body);
    root.appendChild(item);
  });
};
