# Basin Roots Precision Ag — Client Portal (Demonstration)

A standalone client-portal demonstration for **Basin Roots Precision Ag**, showing soil
moisture, temperature and electrical conductivity monitoring for a sample property —
**High Lakes Ranch — Garden Demonstration Site**.

Plain HTML, CSS and vanilla JavaScript. No frameworks, no build step, no dependencies
beyond [Chart.js](https://www.chartjs.org/) and
[chartjs-plugin-annotation](https://www.chartjs.org/chartjs-plugin-annotation/latest/),
both loaded from a CDN in `index.html`.

**This is a demonstration.** High Lakes Ranch is not a real client, and every reading
shown is representative sample data modeled on real field sensor observations, not a
live feed. The portal displays a persistent disclosure to that effect, and the page is
marked `noindex` so it isn't picked up by search engines while unlinked from the main
site's navigation.

## Quick Start

No build step — open it directly:

```
client-portal/index.html
```

Double-click the file, or open it in a browser. Everything (styles, data, charts) loads
from relative paths and CDN scripts, so this works with no server.

If you'd rather serve it (recommended if your browser restricts local `file://`
script access, or if you want relative-path behavior to match a real deployment),
run a simple static server from the `client-portal/` folder:

```
# Python
python -m http.server 8000

# Node (no install needed)
npx serve .
```

Then visit `http://localhost:8000/`.

### Screenshot mode

Append `?screenshot=1` to the URL, or click the **Screenshot Mode** button in the
bottom-right corner, to hide the chart range/metric toggle controls for a clean view —
useful for marketing screenshots at both desktop and mobile widths. The demonstration
disclosure banner always stays visible, even in screenshot mode. Click the button again
(now labeled **Exit Screenshot Mode**) to restore the normal interactive view.

## Project Structure

```
client-portal/
├── index.html                    Page markup — empty containers filled in by JS
├── css/
│   └── portal.css                All styling: layout, cards, charts, responsive rules
├── js/
│   ├── config.js                 Branding, labels, units, target ranges, disclosure text
│   ├── main.js                   Orchestrates rendering, in page order
│   ├── data/
│   │   └── sensor-data.js        The only file with sensor readings (demo dataset)
│   ├── services/
│   │   └── api.js                Placeholder service layer for future live endpoints
│   └── components/
│       ├── utils.js              Shared formatting helpers + the Portal namespace
│       ├── header.js             Brand header, disclosure banner, footer
│       ├── cards.js               Monitoring-location strip + current-conditions cards
│       ├── charts.js             Moisture chart (24H/7D) + Temperature/EC toggle chart
│       ├── insights.js           Field Insights panel
│       ├── timeline.js           Recent-activity event timeline
│       ├── decisionSupport.js    "What This Shows" section
│       └── screenshotMode.js     ?screenshot=1 / toggle-button behavior
└── README.md
```

**Script load order matters** (see the bottom of `index.html`): `config.js` and
`data/sensor-data.js` first, then `services/api.js`, then `components/utils.js` (which
declares the shared `Portal` namespace — every other component file assumes it already
exists and does not redeclare it), then the rest of the components, then `main.js` last.

## Configuration & Data

- **`js/config.js`** — everything about *how the portal presents itself*: brand name,
  property name/title, demonstration badge and disclosure copy, the monitoring
  location's display name and status vocabulary, units, the moisture/EC target ranges
  shown on the chart, metric labels, and all static section copy. No readings live here.
- **`js/data/sensor-data.js`** — the only file with actual sensor values. It
  deterministically *generates* a 7-day series of 15-minute readings (no `Math.random`,
  so the demo looks identical on every load) modeling a real observed irrigation event,
  plus the current snapshot, sensor health flags, irrigation event markers, field
  insights, and the event timeline.

Everything the interface renders is read from these two files (plus `SENSOR_DATA`
computed values). To change the story the demo tells — different property name,
different target ranges, different irrigation timing — edit these two files; the
components don't need to change.

## Connecting Live Data

`js/services/api.js` defines placeholder functions shaped like the planned Node-RED
endpoints:

| Function | Planned endpoint |
|---|---|
| `PortalAPI.getPropertySummary()` | `GET /api/client/property-summary` |
| `PortalAPI.getCurrentReadings()` | `GET /api/client/current-readings` |
| `PortalAPI.getTrends(range)` | `GET /api/client/trends?range=24H\|7D` |
| `PortalAPI.getInsights()` | `GET /api/client/insights` |
| `PortalAPI.getEvents()` | `GET /api/client/events` |

Right now each function just resolves a `Promise` with the same local demo data the
components already read from `CONFIG`/`SENSOR_DATA` (with a small artificial delay, so
code written against them behaves the same as it will against a real endpoint). **The
interface does not call `api.js` yet** — components still read `CONFIG`/`SENSOR_DATA`
directly, per the original design, so this file is the *seam* for the next step rather
than something already wired in.

To connect a real Node-RED backend later:

1. In `js/services/api.js`, replace each function body with a `fetch()` call to the real
   endpoint, keeping the resolved shape the same.
2. Update the relevant component (e.g. `js/components/cards.js`) to call
   `PortalAPI.getCurrentReadings()` and render from the resolved value instead of
   reading `SENSOR_DATA.currentSnapshot` directly. Because components already isolate
   their rendering logic into functions, this is a localized change per component, not
   a redesign.
3. `js/main.js` will need to `await` those calls (or chain `.then()`) before rendering,
   since real data becomes asynchronous once it's fetched over the network.

No credentials, internal addresses, database names, device identifiers, DevEUIs, or API
keys appear anywhere in this project.

## Browser Support

Any current evergreen browser (Chrome, Edge, Firefox, Safari). Uses `Intl.DateTimeFormat`
for timezone-aware formatting (`America/Los_Angeles`), CSS Grid, and `URLSearchParams` —
all broadly supported, no polyfills included.
