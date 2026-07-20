/* Basin Roots Precision Ag — client portal
   js/components/charts.js
   Builds the main soil-moisture trend chart (24H/7D toggle, target band,
   irrigation event marker) and the secondary Temperature/EC toggle chart.
   Uses Chart.js + chartjs-plugin-annotation from the CDN, loaded before
   this file. A category x-axis (formatted label strings) is used instead
   of Chart.js's time scale so no date-adapter dependency is required.
   Relies on the shared Portal namespace declared in utils.js, which must
   load first. */

Portal.charts = (function () {

  const colors = CONFIG.chart.colors;
  let moistureChart = null;
  let secondaryChart = null;
  let secondaryMetric = 'soilTemperatureF';
  let moistureRange = '24H';

  // Register the annotation plugin defensively in case the UMD build
  // loaded via <script> did not already self-register.
  if (window.Chart && window['chartjs-plugin-annotation']) {
    Chart.register(window['chartjs-plugin-annotation']);
  }

  function readingsForRange(range) {
    if (range === '24H') {
      const end = new Date(SENSOR_DATA.currentSnapshot.lastUpdated);
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      return SENSOR_DATA.readings.filter(r => {
        const t = new Date(r.timestamp);
        return t >= start && t <= end;
      });
    }
    // 7D: thin the 15-minute series down to on-the-hour points so the
    // week-long view stays readable.
    return SENSOR_DATA.readings.filter(r => r.timestamp.slice(14, 16) === '00');
  }

  function labelFor(range, timestamp) {
    return range === '24H'
      ? Portal.utils.formatTime(timestamp)
      : Portal.utils.formatMonthDayHour(timestamp);
  }

  function eventsInRange(readings) {
    if (!readings.length) return [];
    const start = new Date(readings[0].timestamp);
    const end = new Date(readings[readings.length - 1].timestamp);
    return SENSOR_DATA.irrigationEvents.filter(evt => {
      const t = new Date(evt.timestamp);
      return t >= start && t <= end;
    });
  }

  // Finds the reading in `readings` closest to `isoTimestamp`, for
  // snapping an event marker onto an existing category-axis label.
  function nearestLabel(readings, range, isoTimestamp) {
    const target = new Date(isoTimestamp).getTime();
    let closest = readings[0];
    let closestDiff = Infinity;
    readings.forEach(r => {
      const diff = Math.abs(new Date(r.timestamp).getTime() - target);
      if (diff < closestDiff) { closestDiff = diff; closest = r; }
    });
    return labelFor(range, closest.timestamp);
  }

  function buildMoistureAnnotations(readings, range) {
    const annotations = {
      targetBand: {
        type: 'box',
        yMin: CONFIG.targetRanges.moisture.min,
        yMax: CONFIG.targetRanges.moisture.max,
        backgroundColor: colors.targetBand,
        borderWidth: 0
      }
    };

    eventsInRange(readings).forEach((evt, i) => {
      annotations['irrigation' + i] = {
        type: 'line',
        scaleID: 'x',
        value: nearestLabel(readings, range, evt.timestamp),
        borderColor: colors.irrigationMarker,
        borderWidth: 2,
        borderDash: [5, 4],
        label: {
          display: true,
          content: evt.label,
          position: 'start',
          backgroundColor: colors.irrigationMarker,
          color: '#fff',
          font: { size: 10, weight: '700' },
          padding: 5,
          borderRadius: 4
        }
      };
    });

    return annotations;
  }

  function eventNoteForLabel(readings, range, label) {
    const match = eventsInRange(readings).find(evt => nearestLabel(readings, range, evt.timestamp) === label);
    return match ? match.label : null;
  }

  function renderMoistureChart() {
    const canvas = document.getElementById('portal-moisture-chart');
    const readings = readingsForRange(moistureRange);
    const labels = readings.map(r => labelFor(moistureRange, r.timestamp));
    const data = readings.map(r => r.soilMoisturePct);

    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${CONFIG.metricLabels.soilMoisture} (${CONFIG.units.moisture})`,
          data,
          borderColor: colors.moisture,
          backgroundColor: colors.moistureFill,
          fill: true,
          tension: 0.25,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: colors.moisture
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            grid: { color: colors.gridLine },
            ticks: { maxTicksLimit: 8, color: '#5B6670', font: { size: 11 } }
          },
          y: {
            suggestedMin: 15,
            suggestedMax: 38,
            grid: { color: colors.gridLine },
            ticks: { callback: v => v + '%', color: '#5B6670', font: { size: 11 } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: item => `${CONFIG.metricLabels.soilMoisture}: ${item.formattedValue}${CONFIG.units.moisture}`,
              afterBody: items => {
                const note = eventNoteForLabel(readings, moistureRange, items[0].label);
                return note ? [note] : [];
              }
            }
          },
          annotation: { annotations: buildMoistureAnnotations(readings, moistureRange) }
        }
      }
    };

    if (moistureChart) {
      moistureChart.data = config.data;
      moistureChart.options = config.options;
      moistureChart.update();
    } else {
      moistureChart = new Chart(canvas, config);
    }
  }

  function metricSeries(readings, metric) {
    return readings.map(r => r[metric]);
  }

  function renderSecondaryChart() {
    const canvas = document.getElementById('portal-secondary-chart');
    const readings = readingsForRange('7D');
    const labels = readings.map(r => labelFor('7D', r.timestamp));
    const isTemp = secondaryMetric === 'soilTemperatureF';

    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: isTemp
            ? `${CONFIG.metricLabels.soilTemperature} (${CONFIG.units.temperature})`
            : `${CONFIG.metricLabels.ec} (${CONFIG.units.ec})`,
          data: metricSeries(readings, secondaryMetric),
          borderColor: isTemp ? colors.temperature : colors.ec,
          backgroundColor: 'transparent',
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            grid: { color: colors.gridLine },
            ticks: { maxTicksLimit: 6, color: '#5B6670', font: { size: 11 } }
          },
          y: {
            grid: { color: colors.gridLine },
            ticks: {
              callback: v => isTemp ? v + '°F' : v + ' dS/m',
              color: '#5B6670',
              font: { size: 11 }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: item => `${item.dataset.label}: ${item.formattedValue}`
            }
          }
        }
      }
    };

    if (secondaryChart) {
      secondaryChart.data = config.data;
      secondaryChart.options = config.options;
      secondaryChart.update();
    } else {
      secondaryChart = new Chart(canvas, config);
    }
  }

  function setMoistureRange(range) {
    moistureRange = range;
    document.querySelectorAll('[data-moisture-range]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.moistureRange === range);
    });
    renderMoistureChart();
  }

  function setSecondaryMetric(metric) {
    secondaryMetric = metric;
    document.querySelectorAll('[data-secondary-metric]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.secondaryMetric === metric);
    });
    renderSecondaryChart();
  }

  function init() {
    document.querySelectorAll('[data-moisture-range]').forEach(btn => {
      btn.addEventListener('click', () => setMoistureRange(btn.dataset.moistureRange));
    });
    document.querySelectorAll('[data-secondary-metric]').forEach(btn => {
      btn.addEventListener('click', () => setSecondaryMetric(btn.dataset.secondaryMetric));
    });
    document.getElementById('portal-ec-explainer').textContent = CONFIG.ecExplainer;

    setMoistureRange(moistureRange);
    setSecondaryMetric(secondaryMetric);
  }

  return { init };
})();
