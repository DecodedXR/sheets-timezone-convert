// Self-check for DST-correct conversions: node test.js
const vm = require('vm'), fs = require('fs'), assert = require('assert');
// Utilities.formatDate shim for the one pattern the script uses.
const Utilities = { formatDate: (d, tz, _) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(d).map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}.000Z`;
} };
const ctx = { Utilities, Intl }; vm.runInNewContext(fs.readFileSync(__dirname + '/Code.gs', 'utf8'), ctx);
// What a cell shows, in the sheet's zone, for a returned Date.
const shows = (d, zone) => Utilities.formatDate(d, zone).slice(0, 16);
// A cell typed as wall time W in a sheet whose zone is S arrives as the instant fromWall_(W, S).
const cell = (wall, sheetZone) => new Date(ctx.fromWall_(Date.parse(wall + ':00.000Z'), sheetZone));
const conv = (wall, from, to, sheet) => shows(ctx.convert_(cell(wall, sheet), from, to, sheet), sheet);

// Summer: New York is UTC-4, London UTC+1 → +5h. Winter: UTC-5 / UTC+0 → +5h. The gap week in March: +4h.
assert.equal(conv('2026-07-01T09:00', 'America/New_York', 'Europe/London', 'America/Los_Angeles'), '2026-07-01T14:00');
assert.equal(conv('2026-01-15T09:00', 'America/New_York', 'Europe/London', 'Asia/Tokyo'), '2026-01-15T14:00');
assert.equal(conv('2026-03-10T09:00', 'America/New_York', 'Europe/London', 'UTC'), '2026-03-10T13:00');
// Crossing midnight and the date line.
assert.equal(conv('2026-07-01T20:00', 'UTC', 'Australia/Sydney', 'Europe/Berlin'), '2026-07-02T06:00');
assert.equal(conv('2026-07-01T06:00', 'Asia/Tokyo', 'America/Los_Angeles', 'Asia/Tokyo'), '2026-06-30T14:00');
// Half-hour zone.
assert.equal(conv('2026-07-01T12:00', 'UTC', 'Asia/Kolkata', 'UTC'), '2026-07-01T17:30');
// Zone names.
assert.equal(ctx.zone_('', 'Asia/Tokyo'), 'Asia/Tokyo');
assert.equal(ctx.zone_('utc', 'X'), 'UTC');
assert.throws(() => ctx.zone_('EST', 'X'), /time zone name/);
assert.throws(() => ctx.zone_('America/Nowhere', 'X'), /Unknown time zone/);
// Ranges and blanks through the custom function.
ctx.SpreadsheetApp = { getActiveSpreadsheet: () => ({ getSpreadsheetTimeZone: () => 'UTC' }) };
const out = ctx.TZ_CONVERT([[cell('2026-07-01T12:00', 'UTC')], ['']], 'UTC', 'Asia/Tokyo');
assert.equal(shows(out[0][0], 'UTC'), '2026-07-01T21:00'); assert.equal(out[1][0], '');
assert.throws(() => ctx.TZ_CONVERT('hello', 'UTC', 'Asia/Tokyo'), /Not a date-time/);
console.log('ok');
