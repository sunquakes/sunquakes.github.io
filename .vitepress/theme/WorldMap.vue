<script setup lang="ts">
import { WORLD_DOTS_PATH } from './worldDots'

// Equirectangular projection into the 1000x500 viewBox:
//   x = (lon + 180) / 360 * 1000, y = (90 - lat) / 180 * 500
// Only the hub is anchored to a public fact (the studio is based in UTC+8,
// per the contact page). The zone markers are decorative anchors for the
// remote delivery regions — they are not client locations.
const hub = { x: 794.4, y: 166.7 } // UTC+8 base (East Asia)

const zones = [
  // Europe
  { id: 'london', x: 499.6, y: 106.9 },
  { id: 'berlin', x: 537.2, y: 104.1 },
  { id: 'lisbon', x: 474.6, y: 142.4 },
  { id: 'stockholm', x: 550.2, y: 85.2 },
  // Americas
  { id: 'new-york', x: 294.4, y: 136.9 },
  { id: 'san-francisco', x: 159.9, y: 145.1 },
  { id: 'sao-paulo', x: 370.5, y: 315.4 },
  { id: 'toronto', x: 279.5, y: 128.8 },
  // Oceania
  { id: 'sydney', x: 920, y: 344.1 },
  { id: 'perth', x: 821.8, y: 338.8 },
  { id: 'melbourne', x: 902.7, y: 355 },
  // Asia & Middle East waypoints
  { id: 'singapore', x: 788.4, y: 246.3 },
  { id: 'dubai', x: 653.5, y: 180 },
]

// Decorative delivery arcs (quadratic curves) radiating from the hub.
const hubArc = (x: number, y: number, cx: number, cy: number) =>
  `M${hub.x} ${hub.y} Q${cx} ${cy} ${x} ${y}`

const arcs = [
  hubArc(499.6, 106.9, 650, 40), // → London
  hubArc(537.2, 104.1, 680, 58), // → Berlin
  hubArc(294.4, 136.9, 540, 20), // → New York
  hubArc(159.9, 145.1, 470, 10), // → San Francisco
  hubArc(370.5, 315.4, 560, 250), // → São Paulo
  hubArc(920, 344.1, 880, 250), // → Sydney
  hubArc(788.4, 246.3, 800, 210), // → Singapore
  hubArc(653.5, 180, 720, 150), // → Dubai
]

// Softer mesh links between zones for a network feel.
const crossArcs = [
  'M499.6 106.9 Q400 40 294.4 136.9', // London – New York
  'M788.4 246.3 Q860 290 920 344.1', // Singapore – Sydney
]
</script>

<template>
  <figure class="home-map">
    <div class="x-map">
      <svg
        class="x-map-svg"
        viewBox="0 0 1000 500"
        role="img"
        aria-label="Dotted world map showing the studio based in UTC+8 and remote delivery zones across Europe, the Americas and Asia-Pacific"
      >
        <path class="x-map-dots" :d="WORLD_DOTS_PATH" />

        <g class="x-map-links" aria-hidden="true">
          <path
            v-for="(d, i) in arcs"
            :key="i"
            class="x-map-arc x-map-arc-link"
            :d="d"
            :style="{ animationDelay: `${-i * 0.45}s` }"
          />
          <path
            v-for="(d, i) in crossArcs"
            :key="`cross-${i}`"
            class="x-map-arc x-map-arc-link is-cross"
            :d="d"
            :style="{ animationDelay: `${-1.1 - i * 0.9}s` }"
          />
        </g>

        <g
          v-for="(zone, i) in zones"
          :key="zone.id"
          class="x-map-node is-zone"
          :transform="`translate(${zone.x} ${zone.y})`"
        >
          <circle class="x-map-pulse" r="8" :style="{ animationDelay: `${-(i % 5) * 0.6}s` }" />
          <circle class="x-map-core" r="3.1" />
        </g>

        <g class="x-map-node" :transform="`translate(${hub.x} ${hub.y})`">
          <circle class="x-map-pulse" r="10" />
          <circle class="x-map-pulse is-late" r="10" />
          <circle class="x-map-core" r="4.2" />
        </g>
      </svg>

      <span class="x-map-chip x-map-chip--left" style="--chip-x: 79.44%; --chip-y: 33.34%;">
        <i aria-hidden="true"></i>Studio · UTC+8
      </span>
      <span class="x-map-chip x-map-chip--left" style="--chip-x: 49.96%; --chip-y: 21.38%;">
        <i class="is-zone" aria-hidden="true"></i>Europe
      </span>
      <span class="x-map-chip x-map-chip--up" style="--chip-x: 29.44%; --chip-y: 27.38%;">
        <i class="is-zone" aria-hidden="true"></i>Americas
      </span>
      <span class="x-map-chip x-map-chip--down" style="--chip-x: 82.18%; --chip-y: 67.76%;">
        <i class="is-zone" aria-hidden="true"></i>Oceania
      </span>
    </div>

    <figcaption class="x-map-legend">
      <span class="x-map-key"><i class="is-studio" aria-hidden="true"></i>Studio — based in UTC+8</span>
      <span class="x-map-key"><i class="is-zone" aria-hidden="true"></i>Remote delivery zones — Europe · Americas · Asia-Pacific</span>
    </figcaption>
  </figure>
</template>
