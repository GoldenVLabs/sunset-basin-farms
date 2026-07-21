/* Basin Roots Precision Ag — client portal demonstration
   config.js
   ---------------------------------------------------------------------------
   All branding, labels, units, target ranges and disclosure copy live here.
   Interface code should read display strings and thresholds from CONFIG only
   — no readings, timestamps, or sensor values belong in this file.
   --------------------------------------------------------------------------- */

const CONFIG = {

  brand: {
    name: 'Basin Roots Precision Ag',
    tagline: 'Remote soil and irrigation monitoring demonstration'
  },

  property: {
    name: 'High Lakes Ranch',
    siteName: 'Garden Demonstration Site',
    displayTitle: 'High Lakes Ranch — Garden Demonstration Site'
  },

  demo: {
    badgeText: 'Demonstration',
    monitoringStatus: 'Monitoring Active',
    // Persistent, short-form disclosure shown near the header at all times.
    disclosureShort: 'This dashboard uses representative data based on real field sensor observations.',
    // Longer-form disclosure for a footer / about area.
    disclosureLong: 'High Lakes Ranch is a demonstration property used to illustrate the Basin Roots ' +
      'Precision Ag client portal. It is not an active client. All readings shown are representative ' +
      'sample data modeled on real field sensor observations, not a live feed.'
  },

  location: {
    displayName: 'Garden Plot',
    internalId: 'Sensor A',
    description: 'Vegetable garden root zone',
    // Full vocabulary of status values the portal can display for a monitoring location.
    statusOptions: [
      'Recently Watered',
      'Moisture Increasing',
      'Drying Normally',
      'Dry',
      'Wet',
      'Needs Review',
      'Offline'
    ]
  },

  timezone: 'America/Los_Angeles',

  units: {
    moisture: '%',
    temperature: '°F',
    ec: 'dS/m'
  },

  // Shaded "healthy" band drawn on the moisture chart and used to judge
  // whether a reading is within the expected demonstration range.
  targetRanges: {
    moisture: { min: 24, max: 34 },
    ec: { min: 0.40, max: 0.44 }
  },

  metricLabels: {
    soilMoisture: 'Soil Moisture',
    soilTemperature: 'Soil Temperature',
    ec: 'Electrical Conductivity',
    moistureRange: 'Moisture Range',
    lastUpdated: 'Last Updated',
    dataStatus: 'Data Status'
  },

  chart: {
    ranges: [
      { key: '24H', label: '24 Hours' },
      { key: '7D', label: '7 Days' }
    ],
    colors: {
      moisture: '#3F6B4F',
      moistureFill: 'rgba(63, 107, 79, 0.12)',
      temperature: '#B0763C',
      ec: '#3E6C82',
      targetBand: 'rgba(63, 107, 79, 0.10)',
      irrigationMarker: '#8A6412',
      gridLine: '#E4DCC9'
    },
    annotationLabel: 'Irrigation Detected'
  },

  ecExplainer: 'Electrical conductivity (EC) reflects the level of dissolved salts and nutrients present in the soil water.',

  moistureChartSummary: 'Moisture increased from approximately 23% to 34% following irrigation, then began a gradual dry-down.',

  copy: {
    fieldSummaryStatusLine: 'Current status: No immediate follow-up indicated. Continue normal monitoring.',

    ecStatusCaption: 'Stable',
    moistureRangeValue: 'Within Target',
    dataStatusValue: 'Current',
    dataStatusCaption: 'Last report received successfully',

    eventTimelineTitle: 'Recent Activity',

    whatThisShowsTitle: 'What This Shows',
    whatThisShowsIntro: 'Basin Roots Precision Ag monitoring is built to support field decisions, not replace them.',
    whatThisShowsBullets: [
      'Confirm whether irrigation reached the monitored root zone',
      'Track how quickly soil dries after watering',
      'Compare conditions over time',
      'Review field information remotely',
      'Identify unusual changes that may require inspection'
    ],
    whatThisShowsFootnote: 'This portal provides monitoring and decision-support information. It does not control irrigation automatically.',

    decisionSupportDisclaimer: 'Basin Roots Precision Ag provides monitoring and decision-support information. ' +
      'Irrigation and land-management decisions remain the responsibility of the property owner or manager.',

    footerCtaHeadline: 'Interested in monitoring your property?',
    footerCtaBody: 'Request a site assessment from Basin Roots Precision Ag.',
    footerCtaButtonText: 'Request a Site Assessment',
    footerCtaHref: 'mailto:basinroots@gmail.com'
  }
};
