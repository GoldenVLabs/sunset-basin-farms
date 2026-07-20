/* Basin Roots Precision Ag — client portal
   js/services/api.js
   ---------------------------------------------------------------------------
   Placeholder service layer for the future live API. Each function below
   mirrors a planned Node-RED endpoint and currently resolves with local
   demonstration data from CONFIG/SENSOR_DATA instead of making a network
   call. When a real endpoint exists, replace that function's body with a
   fetch() call — keep the resolved shape the same so calling code doesn't
   need to change.

   Not currently called by the interface (see README.md, "Connecting Live
   Data") — the current UI reads CONFIG/SENSOR_DATA directly, per the
   original design. This file exists so the endpoint shapes are decided
   and ready before those live connections are built.

   No credentials, internal addresses, database names, device identifiers,
   DevEUIs, or API keys appear anywhere in this file.
   --------------------------------------------------------------------------- */

const PortalAPI = (function () {

  // Simulated network latency, so code written against these functions
  // behaves the same way it will once they call a real endpoint.
  function resolveAfter(value, delayMs = 150) {
    return new Promise(resolve => setTimeout(() => resolve(value), delayMs));
  }

  /* GET /api/client/property-summary
     Branding, property identity and monitoring-location details. */
  function getPropertySummary() {
    return resolveAfter({
      brand: CONFIG.brand,
      property: CONFIG.property,
      location: CONFIG.location,
      monitoringStatus: CONFIG.demo.monitoringStatus
    });
  }

  /* GET /api/client/current-readings
     Latest snapshot for the current-conditions cards. */
  function getCurrentReadings() {
    return resolveAfter({
      snapshot: SENSOR_DATA.currentSnapshot,
      sensorHealth: SENSOR_DATA.sensorHealth
    });
  }

  /* GET /api/client/trends?range=24H|7D
     Historical readings backing the moisture/temperature/EC charts. A real
     endpoint would likely filter or aggregate by range server-side; the
     demonstration dataset is filtered client-side in js/components/charts.js. */
  function getTrends(range) {
    return resolveAfter({
      range: range || '24H',
      readings: SENSOR_DATA.readings,
      irrigationEvents: SENSOR_DATA.irrigationEvents,
      targetRanges: CONFIG.targetRanges
    });
  }

  /* GET /api/client/events
     Recent-activity timeline entries, newest first. */
  function getEvents() {
    return resolveAfter(SENSOR_DATA.events);
  }

  /* GET /api/client/insights
     Plain-language field insights. */
  function getInsights() {
    return resolveAfter(SENSOR_DATA.insights);
  }

  return {
    getPropertySummary,
    getCurrentReadings,
    getTrends,
    getEvents,
    getInsights
  };
})();
