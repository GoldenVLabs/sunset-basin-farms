/* Basin Roots Precision Ag — client portal
   js/components/header.js
   Renders the brand header: property name, demonstration badge,
   monitoring status, and last-updated timestamp.
   Relies on the shared Portal namespace declared in utils.js, which must
   load first. */

Portal.renderHeader = function renderHeader() {
  const root = document.getElementById('portal-header');
  const { el, formatDateTime } = Portal.utils;

  const titleBlock = el('div');

  const brandRow = el('div', 'portal-brand-row');
  const mark = document.createElement('img');
  mark.className = 'portal-brand-mark';
  mark.src = 'images/LogoSqOnly.png';
  mark.alt = 'Basin Roots Precision Ag';
  const brandName = el('div', 'portal-brand-name', CONFIG.brand.name);
  brandRow.append(mark, brandName);

  const title = el('h1', 'portal-property-title', CONFIG.property.displayTitle);
  const sub = el('p', 'portal-property-sub', CONFIG.brand.tagline);

  titleBlock.append(brandRow, title, sub);

  const meta = el('div', 'portal-header-meta');

  const demoBadge = el('span', 'portal-badge demo', CONFIG.demo.badgeText);

  const statusBadge = el('span', 'portal-badge status');
  const dot = el('span', 'dot');
  statusBadge.append(dot, document.createTextNode(CONFIG.demo.monitoringStatus));

  const badgeRow = el('div');
  badgeRow.style.display = 'flex';
  badgeRow.style.gap = '0.6rem';
  badgeRow.append(demoBadge, statusBadge);

  const lastUpdated = el('div', 'portal-last-updated');
  const strong = el('strong', null, formatDateTime(SENSOR_DATA.currentSnapshot.lastUpdated));
  lastUpdated.append(document.createTextNode(`${CONFIG.metricLabels.lastUpdated}: `), strong);

  meta.append(badgeRow, lastUpdated);

  root.append(titleBlock, meta);

  const disclosure = document.getElementById('portal-disclosure');
  const icon = el('span', 'icon', 'i');
  const text = el('p');
  const strongLead = el('strong', null, 'Demonstration data. ');
  text.append(strongLead, document.createTextNode(CONFIG.demo.disclosureShort));
  disclosure.append(icon, text);
};

Portal.renderFooter = function renderFooter() {
  const root = document.getElementById('portal-footer');
  const { el } = Portal.utils;
  const copy = CONFIG.copy;

  const disclosure = el('p', 'portal-footer-disclosure', CONFIG.demo.disclosureLong);
  const decisionDisclaimer = el('p', 'portal-footer-disclaimer', copy.decisionSupportDisclaimer);

  const cta = el('div', 'portal-footer-cta');
  const ctaText = el('p', 'portal-footer-cta-text');
  ctaText.append(
    el('strong', null, copy.footerCtaHeadline),
    document.createTextNode(' ' + copy.footerCtaBody)
  );
  cta.appendChild(ctaText);

  if (copy.footerCtaHref) {
    const link = el('a', 'portal-footer-cta-btn', copy.footerCtaButtonText);
    link.href = copy.footerCtaHref;
    cta.appendChild(link);
  }

  root.append(disclosure, decisionDisclaimer, cta);
};
