/* Basin Roots Precision Ag — client portal
   js/main.js
   Orchestrates rendering. Reads only CONFIG and SENSOR_DATA — no branding,
   copy, or readings are hardcoded here. */

(function () {
  document.title = `${CONFIG.property.displayTitle} | ${CONFIG.brand.name} Client Portal`;

  Portal.screenshotMode.init();
  Portal.renderHeader();
  Portal.renderFooter();
  Portal.renderLocation();
  Portal.renderCards();
  Portal.charts.init();
  Portal.renderFieldSummary();
  Portal.renderTimeline();
  Portal.renderDecisionSupport();
})();
