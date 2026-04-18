# Marketing Demo Components

Three self-contained Vue 3 demo components for embedding on the marketing site. Each uses hardcoded fake data (no backend, no API calls, no LLM).

## Components

### HuddleDemo.vue
Pre-visit Huddle view with three tabs (Active Now, Falling Off, HCC Due). Clickable tabs, hoverable problem rows, A&P data inline.

### EncounterViewDemo.vue
Encounter note view with a format toggle between Classic SOAP, Fully Combined, and Problem-Based modes. Read-only, same data rendered three ways.

### TimelineRecapDemo.vue
Per-problem Timeline with historical A&P entries. Includes a "Recap" button that reveals a pre-generated AI summary (narrative + medication history with badges + key metrics) after a 1.5-second fake loading delay.

## Files

- `demo-data.js` — All hardcoded fake patient/encounter/timeline/recap data in one file. Edit copy here without touching components.
- `HuddleDemo.vue` — Huddle component
- `EncounterViewDemo.vue` — Encounter note component
- `TimelineRecapDemo.vue` — Timeline + Recap component

## Usage

Each component is a standard Vue 3 SFC. Import and render:

```vue
<script>
import HuddleDemo from './demos/HuddleDemo.vue';
import EncounterViewDemo from './demos/EncounterViewDemo.vue';
import TimelineRecapDemo from './demos/TimelineRecapDemo.vue';
</script>

<template>
  <HuddleDemo @problem-click="handleClick" />
  <EncounterViewDemo />
  <TimelineRecapDemo />
</template>
```

## Fake Patient

All components use the same patient: Maria Rodriguez, 64F, PCP Dr. J. Kantrowitz.

## Watermark

Each component includes a visible "DEMO - fake patient data - not a real chart" banner that cannot be removed via CSS.

## Responsive

All components work from 380px (mobile) to 700px (desktop embed). No fixed heights.
