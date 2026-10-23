---
title: Ten-Million-Order Realtime Display
description: "A ten-million-order realtime display — many fields shown and filtered across tables, 20 rows per page within 500ms, 1M records exported in under 4 minutes."
aside: false
---

# Ten-Million-Order Realtime Display

Past ten million orders, the fields the business needs are spread across different tables. Showing many of them in one view — and filtering by any of them — has to stay fast, or the view is useless.

<div class="pf-media">
  <img src="/assets/clients-cases/ten-million-order-realtime-display.jpg" alt="Batched query flow between a ClickHouse wide table and MySQL detail tables" loading="lazy" />
</div>

## The challenge

- **The fields to display live in different tables.** One screen needs fields from several of them at once, so every row shown means reaching across tables.
- **The fields to filter by live in different tables too.** Filters combine freely, so results have to be narrowed on any of those fields — not just the few a single table is quick on.
- **Scale turns both into a problem.** At ten million rows, pulling those fields together on every page load makes the select time out before the screen shows anything.

## Result

- **Filtering returns 20 rows per page within 500ms** on the ten-million-order dataset.
- **Exporting 1 million records takes less than 4 minutes.**

<a class="pf-btn" href="/clients-cases/">← Back to Clients &amp; Cases</a>
