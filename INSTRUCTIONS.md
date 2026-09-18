# CFS — Floating Widget Alerts, GLS Popup, English

6 files. No database changes.

## 1. Alerts absorbed into the floating widget
The separate "Needs Attention" banner is gone. Instead:
- The floating widget in the bottom-left turns red and shakes whenever
  there's approved content that's due or overdue and hasn't been marked
  as uploaded
- Click it -> a popup opens with an "Uploads" tab listing each item with
  Uploaded / Not yet buttons
- Since you told me the client is the one who actually publishes the
  content, this confirmation is client-driven (reusing the
  client_confirmed field from the last update) — clicking "Uploaded"
  clears that item from the alert immediately
- An "Overview" tab in the same popup still shows the full stats
  breakdown (Total, In Production, Pending Review, etc.)

## 2. Checkmark in the calendar grid
Any content the client has confirmed as uploaded now shows a small green
checkmark directly on its card in the month view — no need to open
anything to see it.

## 3. GLS is now a compact card + popup
Instead of the full form sitting on the page, GLS is now a small summary
card ("2 resolved, 1 pending"). Clicking it opens a popup with the full
thread (comment + resolution side by side, resolved checkmark) and the
form to add a new comment, including the small live clock.

## 4. English
All the components in this batch are now in English, matching the
professional SaaS tone you asked for — labels, buttons, empty states,
the works.

Scope note: translating every remaining Indonesian string across the
whole CFS system (admin forms, other panels not touched this round) is a
larger, separate pass — happy to do a dedicated full-translation batch
next if you want everything converted at once, since doing it well means
checking every screen rather than rushing it alongside other changes.

## Cleanup note
components/public/needs-attention.tsx is no longer used anywhere — safe
to delete from your repo, or leave it, won't break the build.

## How to apply

github.dev -> drag all 6 files in -> commit -> push. No SQL.

Test: mark a piece of content Approved with a past or today's date, open
the client link, and watch the widget go red and shake. Click it, mark
it Uploaded, confirm the alert clears and the calendar card shows the
checkmark.
