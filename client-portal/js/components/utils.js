/* Basin Roots Precision Ag — client portal
   js/components/utils.js
   Shared formatting helpers used by multiple components. No readings or
   copy live here — only presentation logic that reads CONFIG.timezone. */

const Portal = window.Portal || (window.Portal = {});

Portal.utils = {

  toDate(isoTimestamp) {
    return new Date(isoTimestamp);
  },

  formatTime(isoTimestamp) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: CONFIG.timezone
    }).format(Portal.utils.toDate(isoTimestamp));
  },

  formatShortDate(isoTimestamp) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: CONFIG.timezone
    }).format(Portal.utils.toDate(isoTimestamp));
  },

  formatDateTime(isoTimestamp) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: CONFIG.timezone
    }).format(Portal.utils.toDate(isoTimestamp));
  },

  formatWeekdayTime(isoTimestamp) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: CONFIG.timezone
    }).format(Portal.utils.toDate(isoTimestamp));
  },

  formatHourLabel(isoTimestamp) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      timeZone: CONFIG.timezone
    }).format(Portal.utils.toDate(isoTimestamp));
  },

  formatMonthDayHour(isoTimestamp) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      timeZone: CONFIG.timezone
    }).format(Portal.utils.toDate(isoTimestamp));
  },

  el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
};
