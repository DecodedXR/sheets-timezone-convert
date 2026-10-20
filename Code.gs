/** @OnlyCurrentDoc */ // asks Google for access to this spreadsheet only, not all your sheets

/**
 * Time Zone Convert for Google Sheets: a formula that converts dates and times between time zones,
 * with daylight saving time handled correctly.
 *
 *   =TZ_CONVERT(A2, "America/New_York", "Europe/London")
 *   =TZ_CONVERT(A2:A100, "UTC", "Asia/Tokyo")          a whole column at once
 *   =TZ_CONVERT(B2, "", "Australia/Sydney")            "" means this spreadsheet's time zone
 *
 * Time zone names are IANA names like "America/Los_Angeles"; "UTC" works too.
 * Abbreviations like "EST" or "PST" are ambiguous and don't follow daylight saving, so they're refused.
 */

/**
 * Converts a date-time from one time zone to another, handling daylight saving time.
 * @param {A2} datetime A date-time cell or range.
 * @param {"America/New_York"} from_zone The time zone the value is in ("" = this spreadsheet's).
 * @param {"Europe/London"} to_zone The time zone to convert to ("" = this spreadsheet's).
 * @return The same moment as a date-time in to_zone.
 * @customfunction
 */
function TZ_CONVERT(datetime, from_zone, to_zone) {
  const sheetZone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  const from = zone_(from_zone, sheetZone), to = zone_(to_zone, sheetZone);
  const one = v => {
    if (v === '' || v === null) return '';
    if (Object.prototype.toString.call(v) !== '[object Date]') throw new Error('Not a date-time: ' + v);
    return convert_(v, from, to, sheetZone);
  };
  return Array.isArray(datetime) ? datetime.map(row => row.map(one)) : one(datetime);
}

/**
 * Sheets hands custom functions a Date for the wall-clock time shown in the sheet's zone.
 * Read that wall-clock time, treat it as `from` time, find the real moment, show it as `to` time,
 * and return a Date that displays that wall-clock time in the sheet's zone.
 */
function convert_(date, from, to, sheetZone) {
  const shown = wall_(date.getTime(), sheetZone);
  const moment = fromWall_(shown, from);
  return new Date(fromWall_(wall_(moment, to), sheetZone));
}

/** Wall-clock time of an instant in a zone, as milliseconds of a UTC date with the same fields. */
function wall_(ms, zone) {
  const s = Utilities.formatDate(new Date(ms), zone, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  return Date.parse(s);
}

/** The instant whose wall-clock time in `zone` is `wallMs`. Re-checks the offset across DST changes. */
function fromWall_(wallMs, zone) {
  let ms = wallMs;
  for (let i = 0; i < 3; i++) ms = wallMs - (wall_(ms, zone) - ms);
  return ms;
}

function zone_(name, sheetZone) {
  const z = String(name || '').trim();
  if (!z) return sheetZone;
  if (z.toUpperCase() === 'UTC' || z.toUpperCase() === 'GMT') return 'UTC';
  if (!z.includes('/')) throw new Error('Use a time zone name like "America/New_York", not "' + z + '".');
  // An unknown name would silently fall back to GMT in formatDate, so check it first.
  try { new Intl.DateTimeFormat('en-US', { timeZone: z }); } catch (e) { throw new Error('Unknown time zone: "' + z + '".'); }
  return z;
}
