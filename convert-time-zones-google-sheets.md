---
title: How to convert time zones in Google Sheets, with daylight saving (free)
description: Adding hours breaks when clocks change. TZ_CONVERT, a free custom formula, converts date-times between any time zones with daylight saving time handled correctly.
image: https://decodedxr.github.io/sheets-timezone-convert/assets/cover.png
---
{% raw %}

# How to convert time zones in Google Sheets, with daylight saving (free)

You have meeting times in New York and need them in London, or log timestamps in UTC that you want in local time. The usual trick is to add or subtract hours:

```
=A2 + 5/24
```

That works until daylight saving time. The US and Europe change their clocks on different weekends, so for a few weeks every spring and autumn the gap between New York and London is 4 hours, not 5. And a fixed offset from UTC is wrong for half the year almost everywhere.

Google Sheets has no built-in time zone function, but a tiny free script adds one. This guide uses [Time Zone Convert](https://github.com/DecodedXR/sheets-timezone-convert), a free, MIT-licensed Apps Script.

## Step 1: Add the formula

1. Open your sheet and go to **Extensions → Apps Script**.
2. Delete what's in `Code.gs`, paste in [this `Code.gs`](https://github.com/DecodedXR/sheets-timezone-convert/blob/main/Code.gs), and click **Save**.
3. Close the Apps Script tab.

## Step 2: Use it

```
=TZ_CONVERT(A2, "America/New_York", "Europe/London")
```

That reads A2 as New York time and returns the same moment in London time. To convert a whole column in one formula, give it a range:

```
=TZ_CONVERT(A2:A100, "UTC", "America/Los_Angeles")
```

Use `""` for the spreadsheet's own time zone:

```
=TZ_CONVERT(B2, "", "Asia/Tokyo")
```

(Google doesn't allow `NOW()` or `TODAY()` directly inside custom formulas. Put `=NOW()` in a cell and point the formula at that cell instead. It updates when the sheet recalculates.)

If a result shows as a number like `46205.58`, format it with **Format → Number → Date time**.

## Time zone names

Use the full IANA names, the same ones your phone and computer use:

| City | Name |
|---|---|
| New York | `America/New_York` |
| Chicago | `America/Chicago` |
| Denver | `America/Denver` |
| Los Angeles | `America/Los_Angeles` |
| London | `Europe/London` |
| Paris / Berlin | `Europe/Paris` / `Europe/Berlin` |
| India | `Asia/Kolkata` |
| Tokyo | `Asia/Tokyo` |
| Sydney | `Australia/Sydney` |
| UTC | `UTC` |

The [full list is on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

**Why not "EST" or "PST"?** Those abbreviations are fixed offsets: EST is always UTC−5, but New York uses EDT (UTC−4) in summer. A sheet built on "EST" is an hour off from March to November. The formula refuses abbreviations so that can't happen silently.

## FAQ

**Does my spreadsheet's time zone matter?** No. The formula reads the date and time shown in the cell and shows the answer the same way, whatever **File → Settings → Time zone** says.

**What about times during the clock change?** When clocks spring forward, times like 2:30 AM don't exist that night. They're shifted by an hour.

**Is it free?** Yes, and it needs no permissions: custom formulas run without the usual Google authorization prompt.

---

[Get the script on GitHub](https://github.com/DecodedXR/sheets-timezone-convert) · [More free Google Sheets scripts](https://decodedxr.github.io/free-google-sheets-scripts/)
{% endraw %}
