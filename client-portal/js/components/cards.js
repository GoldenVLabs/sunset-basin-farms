/* Basin Roots Precision Ag — client portal
   js/components/cards.js
   Renders the monitoring-location strip and the current-conditions cards.
   Battery/sensor-health data exists in SENSOR_DATA.sensorHealth but is only
   surfaced here if a warning flag is active.
   CONFIG.location.internalId is deliberately not rendered here — it's kept
   in config for future support use, not shown on the client-facing strip.
   Relies on the shared Portal namespace declared in utils.js, which must
   load first. */

Portal.renderLocation = function renderLocation() {
  const root = document.getElementById('portal-location');
  const { el } = Portal.utils;

  const info = el('div');
  const name = el('div', 'portal-location-name', CONFIG.location.displayName);
  const sub = el('div', 'portal-location-sub', CONFIG.location.description);
  info.append(name, sub);

  const status = el('span', 'portal-status-pill', SENSOR_DATA.currentSnapshot.condition);

  root.append(info, status);
};

Portal.renderCards = function renderCards() {
  const root = document.getElementById('portal-cards');
  const { el } = Portal.utils;
  const snapshot = SENSOR_DATA.currentSnapshot;
  const units = CONFIG.units;
  const labels = CONFIG.metricLabels;

  const moistureRange = CONFIG.targetRanges.moisture;

  const cards = [
    { label: labels.soilMoisture, value: `${snapshot.soilMoisturePct}${units.moisture}` },
    { label: labels.soilTemperature, value: `${snapshot.soilTemperatureF}${units.temperature}` },
    { label: labels.ec, value: `${snapshot.ecDsPerM} ${units.ec}`, small: true, caption: CONFIG.copy.ecStatusCaption },
    {
      label: labels.moistureRange,
      value: CONFIG.copy.moistureRangeValue,
      small: true,
      caption: `${moistureRange.min}–${moistureRange.max}${units.moisture}`
    },
    { label: labels.dataStatus, value: CONFIG.copy.dataStatusValue, caption: CONFIG.copy.dataStatusCaption }
  ];

  cards.forEach(card => {
    const cardEl = el('div', 'portal-card');
    cardEl.append(
      el('div', 'portal-card-label', card.label),
      el('div', `portal-card-value${card.small ? ' small' : ''}`, card.value)
    );
    if (card.caption) cardEl.appendChild(el('div', 'portal-card-caption', card.caption));
    root.appendChild(cardEl);
  });

  const health = SENSOR_DATA.sensorHealth;
  if (health.lowBatteryWarning || health.sensorHealthWarning) {
    const warningCard = el('div', 'portal-card warning');
    const message = health.lowBatteryWarning
      ? `Battery low (${health.batteryPercent}%) — replacement recommended soon.`
      : 'Sensor health check needed.';
    warningCard.append(
      el('div', 'portal-card-label', 'Sensor Alert'),
      el('div', 'portal-card-value small', message)
    );
    root.appendChild(warningCard);
  }
};
