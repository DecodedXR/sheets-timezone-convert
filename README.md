# Free Time Zone Convert for Google Sheets (daylight saving aware)

![Time Zone Convert for Google Sheets](assets/cover.png)

Google Sheets has no function to convert a date-time between time zones. Adding or subtracting hours (`=A2 + 5/24`) breaks twice a year, because time zones change for daylight saving on different dates. This adds one formula that gets it right:

```
=TZ_CONVERT(A2, "America/New_York", "Europe/London")
=TZ_CONVERT(A2:A100, "UTC", "Asia/Tokyo")              a whole column at once
=TZ_CONVERT(B2, "", "Australia/Sydney")                "" = this spreadsheet's time zone
```

- Daylight saving handled for every zone, including the weeks when the US and Europe are out of sync
- Half-hour and 45-minute zones (India, Nepal, parts of Australia)
- Works on a single cell or a whole range; blank cells stay blank
- Clear errors for typos and ambiguous abbreviations like "EST"

New to this? Read the [step-by-step guide](https://decodedxr.github.io/sheets-timezone-convert/convert-time-zones-google-sheets.html).

## Setup (1 minute)

1. In your sheet: **Extensions → Apps Script**.
2. Replace `Code.gs` with this repo's `Code.gs` and click **Save**.
3. Type `=TZ_CONVERT(` in a cell. It autocompletes like a built-in function.

Format the result cells as date-times (**Format → Number → Date time**) if they show a plain number.

## Time zone names

Use IANA names: `America/New_York`, `America/Chicago`, `America/Denver`, `America/Los_Angeles`, `Europe/London`, `Europe/Paris`, `Asia/Kolkata`, `Asia/Tokyo`, `Australia/Sydney`, or `UTC`. The full list is on [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

Abbreviations such as `EST`, `PST` or `CET` are refused on purpose: "EST" is always UTC−5, even in summer when New York is actually on EDT (UTC−4), so using it would give answers an hour off for half the year.

## Things to know

- The input is read as the date and time **shown in the cell**, and the result is shown the same way. Your spreadsheet's own time zone (**File → Settings**) doesn't change the answer.
- During the hour that's skipped when clocks go forward, a time like 2:30 AM doesn't exist; it's shifted by an hour.

## More free Google tools

- [All free Google Sheets scripts](https://github.com/DecodedXR/free-google-sheets-scripts): mail merge, PDF merge, reminders, Sheets to Calendar, CSV import, timestamps, count by color, row cleanup.

## License

MIT. See `LICENSE`.
