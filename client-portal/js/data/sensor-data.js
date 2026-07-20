/* Basin Roots Precision Ag — client portal demonstration
   js/data/sensor-data.js
   ---------------------------------------------------------------------------
   The only file in this project that contains sensor readings. Everything
   here is representative demonstration data modeled on real field sensor
   behavior — not a live feed and not tied to any real device.

   No credentials, internal addresses, database names, device identifiers,
   DevEUIs, or API keys appear anywhere in this file.

   Readings are generated deterministically (no Math.random) so the
   demonstration looks identical on every page load — useful for review
   and for the screenshot mode added in a later stage.

   Timestamps are stored as ISO 8601 strings with a fixed -07:00 (Pacific
   Daylight Time) offset, matching America/Los_Angeles in July. Because a
   Date built from an ISO string represents a single absolute instant,
   downstream code can still format it in any timezone with Intl/
   toLocaleString — the fixed offset here only affects how these specific
   demo timestamps were authored, not how they're displayed.
   --------------------------------------------------------------------------- */

const SENSOR_DATA = (function buildSensorData() {

  const PT_OFFSET = '-07:00';
  const INTERVAL_MINUTES = 15;

  // Demonstration window: a full seven days for the "7 Day" chart view,
  // covering the real observed window (July 15-17) plus four padding days
  // beforehand so the trailing view is fully populated. The primary
  // irrigation event — and the "current" snapshot shown on the cards — sits
  // on July 16, the middle of the real observation window.
  const SERIES_START = { year: 2026, month: 7, day: 11 }; // Sat
  const SERIES_END = { year: 2026, month: 7, day: 17 };   // Fri
  const CURRENT_DAY = { year: 2026, month: 7, day: 16 };  // Thu — primary event day

  // The exact values the current-conditions cards must show, per the
  // demonstration brief. The generated series approaches these values
  // naturally; this final reading pins them precisely.
  const CURRENT_SNAPSHOT_TIME = { hour: 20, minute: 40 }; // 8:40 PM
  const CURRENT_SNAPSHOT = {
    soilMoisturePct: 28,
    soilTemperatureF: 68,
    ecDsPerM: 0.42,
    condition: 'Drying Normally',
    lastUpdated: isoTimestamp(CURRENT_DAY, 20, 40)
  };

  // Two irrigation events: a smaller mid-week watering and the more
  // pronounced, fully-documented event on the primary event day (July 16).
  const IRRIGATION_EVENTS = [
    {
      id: 'irrigation-midweek',
      day: { year: 2026, month: 7, day: 14 }, // Tue
      hour: 17.5,          // 5:30 PM
      riseMinutes: 30,
      peakMoisture: 29,
      tau: 2.9,             // slower, less pronounced dry-down
      label: CONFIG.chart.annotationLabel
    },
    {
      id: 'irrigation-current',
      day: CURRENT_DAY,
      hour: 18.25,          // 6:15 PM
      riseMinutes: 30,
      peakMoisture: 34,
      tau: 2.431,            // tuned so the 8:40 PM reading lands at 28%
      label: CONFIG.chart.annotationLabel
    }
  ].map(withStartHours);

  const READINGS = generateReadings();

  return {
    generatedAt: isoTimestamp(CURRENT_DAY, CURRENT_SNAPSHOT_TIME.hour, CURRENT_SNAPSHOT_TIME.minute),
    currentSnapshot: CURRENT_SNAPSHOT,
    sensorHealth: {
      batteryVoltage: 3.61,
      batteryPercent: 84,
      signalStrength: 'Good',
      lowBatteryWarning: false,
      sensorHealthWarning: false
    },
    readings: READINGS,
    irrigationEvents: IRRIGATION_EVENTS.map(event => ({
      id: event.id,
      timestamp: isoTimestamp(event.day, Math.floor(event.hour), Math.round((event.hour % 1) * 60)),
      label: event.label
    })),
    insights: [
      'Watering was detected at approximately 6:15 PM.',
      'Soil moisture increased rapidly following irrigation, reaching about 34% within 30 minutes.',
      'The garden root zone began drying gradually through the evening.',
      'Soil moisture has remained within the demonstration target range of 24–34%.',
      'Electrical conductivity remained relatively stable during the monitoring period.'
    ],
    events: [
      {
        timestamp: isoTimestamp(CURRENT_DAY, 20, 40),
        title: 'Sensor Report Received',
        description: 'Latest reading received from the Garden Plot sensor.',
        status: 'ok'
      },
      {
        timestamp: isoTimestamp(CURRENT_DAY, 19, 30),
        title: 'Normal Dry-Down Observed',
        description: 'Soil moisture is decreasing at the expected rate following irrigation.',
        status: 'ok'
      },
      {
        timestamp: isoTimestamp(CURRENT_DAY, 18, 45),
        title: 'Moisture Target Reached',
        description: 'Soil moisture reached approximately 34%, within the demonstration target range.',
        status: 'ok'
      },
      {
        timestamp: isoTimestamp(CURRENT_DAY, 18, 15),
        title: 'Irrigation Detected',
        description: 'Soil moisture began rising in the Garden Plot root zone.',
        status: 'watered'
      }
    ]
  };

  // -------------------------------------------------------------------------
  // Generation helpers
  // -------------------------------------------------------------------------

  function withStartHours(event) {
    return Object.assign({}, event, { startHours: hoursFromSeriesStart(event.day, event.hour) });
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function isoTimestamp(day, hour, minute) {
    return `${day.year}-${pad(day.month)}-${pad(day.day)}T${pad(hour)}:${pad(minute)}:00${PT_OFFSET}`;
  }

  // Hours elapsed between the start of the demonstration window and a given
  // (day, fractional-hour) point. Treats each day as exactly 24 hours, which
  // is fine for a fixed-offset demonstration series spanning one week.
  function hoursFromSeriesStart(day, fractionalHour) {
    const dayIndex = daysBetween(SERIES_START, day);
    return dayIndex * 24 + fractionalHour;
  }

  function daysBetween(a, b) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const dateA = Date.UTC(a.year, a.month - 1, a.day);
    const dateB = Date.UTC(b.year, b.month - 1, b.day);
    return Math.round((dateB - dateA) / msPerDay);
  }

  function round1(n) { return Math.round(n * 10) / 10; }
  function round2(n) { return Math.round(n * 100) / 100; }

  // Slow multi-day baseline drift plus a small diurnal wobble — the "stable/
  // drying period" the demonstration brief describes as holding near 22-24%.
  function baselineMoisture(hoursSinceStart) {
    const drift = 23 + 0.6 * Math.sin((2 * Math.PI * hoursSinceStart) / (24 * 5));
    const diurnal = 0.3 * Math.sin((2 * Math.PI * (hoursSinceStart % 24)) / 24 - Math.PI / 2);
    return drift + diurnal;
  }

  function activeIrrigationEvent(hoursSinceStart) {
    let active = null;
    for (const event of IRRIGATION_EVENTS) {
      if (hoursSinceStart >= event.startHours) active = event;
    }
    return active;
  }

  function moistureAt(hoursSinceStart) {
    const event = activeIrrigationEvent(hoursSinceStart);
    if (!event) return round1(baselineMoisture(hoursSinceStart));

    const riseHours = event.riseMinutes / 60;
    const peakAt = event.startHours + riseHours;
    const hoursSinceEvent = hoursSinceStart - event.startHours;

    // Effect of an irrigation event fades out well before the next one.
    if (hoursSinceEvent > 30) return round1(baselineMoisture(hoursSinceStart));

    if (hoursSinceStart <= peakAt) {
      // Eased rise from baseline-at-event-start up to the event's peak.
      const progress = riseHours === 0 ? 1 : hoursSinceEvent / riseHours;
      const eased = 1 - Math.pow(1 - progress, 2);
      const base = baselineMoisture(event.startHours);
      return round1(base + (event.peakMoisture - base) * eased);
    }

    // Exponential dry-down back toward the (slowly drifting) baseline —
    // fastest right after the peak, slowing as it nears baseline.
    const hoursAfterPeak = hoursSinceStart - peakAt;
    const base = baselineMoisture(hoursSinceStart);
    return round1(base + (event.peakMoisture - base) * Math.exp(-hoursAfterPeak / event.tau));
  }

  // Daily cycle: ~58°F pre-dawn low to ~72°F late-afternoon high.
  function temperatureAt(hoursSinceStart) {
    const hourOfDay = hoursSinceStart % 24;
    const mean = 65;
    const amplitude = 7;
    const peakHour = 16.3; // ~4:18 PM
    return round1(mean + amplitude * Math.cos((2 * Math.PI * (hourOfDay - peakHour)) / 24));
  }

  // Stable baseline with a brief, modest shift in the hours after watering.
  function ecAt(hoursSinceStart) {
    const base = 0.42 + 0.015 * Math.sin((2 * Math.PI * hoursSinceStart) / (24 * 5));
    let bump = 0;
    for (const event of IRRIGATION_EVENTS) {
      const hoursSinceEvent = hoursSinceStart - event.startHours;
      if (hoursSinceEvent >= 0 && hoursSinceEvent < 3) {
        bump += 0.03 * Math.exp(-hoursSinceEvent);
      }
    }
    return round2(base + bump);
  }

  function statusAt(hoursSinceStart, moisture) {
    const event = activeIrrigationEvent(hoursSinceStart);
    if (event) {
      const hoursSinceEvent = hoursSinceStart - event.startHours;
      const riseHours = event.riseMinutes / 60;
      if (hoursSinceEvent <= riseHours) return 'Recently Watered';
      if (hoursSinceEvent <= riseHours + 0.5) return 'Moisture Increasing';
    }
    if (moisture >= CONFIG.targetRanges.moisture.max) return 'Wet';
    if (moisture < 18) return 'Dry';
    return 'Drying Normally';
  }

  function generateReadings() {
    const readings = [];
    const totalDays = daysBetween(SERIES_START, SERIES_END) + 1; // inclusive, full 7 days

    for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
      for (let slot = 0; slot < (24 * 60) / INTERVAL_MINUTES; slot++) {
        const minutesIntoDay = slot * INTERVAL_MINUTES;
        const hour = Math.floor(minutesIntoDay / 60);
        const minute = minutesIntoDay % 60;
        const hoursSinceStart = dayIndex * 24 + hour + minute / 60;

        const day = addDays(SERIES_START, dayIndex);
        const moisture = moistureAt(hoursSinceStart);

        readings.push({
          timestamp: isoTimestamp(day, hour, minute),
          soilMoisturePct: moisture,
          soilTemperatureF: temperatureAt(hoursSinceStart),
          ecDsPerM: ecAt(hoursSinceStart),
          status: statusAt(hoursSinceStart, moisture)
        });
      }
    }

    // Insert the "current" check-in right after 8:30 PM on the primary
    // event day — slightly off the 15-minute grid (realistic sensor
    // jitter) and pinned to the exact demonstration snapshot values. This
    // sits in the middle of the full 7-day series, not at its end, since
    // the series continues through July 17 to keep the "7 Day" view
    // fully populated.
    const insertAfter = readings.findIndex(r => r.timestamp === isoTimestamp(CURRENT_DAY, 20, 30));
    readings.splice(insertAfter + 1, 0, {
      timestamp: CURRENT_SNAPSHOT.lastUpdated,
      soilMoisturePct: CURRENT_SNAPSHOT.soilMoisturePct,
      soilTemperatureF: CURRENT_SNAPSHOT.soilTemperatureF,
      ecDsPerM: CURRENT_SNAPSHOT.ecDsPerM,
      status: CURRENT_SNAPSHOT.condition
    });

    return readings;
  }

  function addDays(day, count) {
    const utc = new Date(Date.UTC(day.year, day.month - 1, day.day + count));
    return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() };
  }

})();
