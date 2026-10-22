<script setup lang="ts">
import { ref } from 'vue'
import { WORLD_DOTS_PATH } from './worldDots'

// Equirectangular projection into the 1000x500 viewBox:
//   x = (lon + 180) / 360 * 1000, y = (90 - lat) / 180 * 500
// Only the hub is anchored to a public fact (the studio is based in UTC+8,
// per the contact page). The zone markers are decorative anchors for the
// remote delivery regions — they are not client locations.
const hub = { x: 794.4, y: 166.7 } // UTC+8 base (East Asia)

type RegionId = 'studio' | 'europe' | 'americas' | 'asia-pacific'

const zones = [
  // Europe
  { id: 'london', x: 499.6, y: 106.9, region: 'europe' },
  { id: 'berlin', x: 537.2, y: 104.1, region: 'europe' },
  { id: 'lisbon', x: 474.6, y: 142.4, region: 'europe' },
  { id: 'stockholm', x: 550.2, y: 85.2, region: 'europe' },
  // Americas
  { id: 'new-york', x: 294.4, y: 136.9, region: 'americas' },
  { id: 'san-francisco', x: 159.9, y: 145.1, region: 'americas' },
  { id: 'sao-paulo', x: 370.5, y: 315.4, region: 'americas' },
  { id: 'toronto', x: 279.5, y: 128.8, region: 'americas' },
  // Asia-Pacific
  { id: 'sydney', x: 920, y: 344.1, region: 'asia-pacific' },
  { id: 'perth', x: 821.8, y: 338.8, region: 'asia-pacific' },
  { id: 'melbourne', x: 902.7, y: 355, region: 'asia-pacific' },
  { id: 'singapore', x: 788.4, y: 246.3, region: 'asia-pacific' },
  { id: 'dubai', x: 653.5, y: 180, region: 'asia-pacific' },
] as const

// Decorative delivery arcs (quadratic curves) radiating from the hub.
// Each arc is tied to the marker it ends at, so a click highlights only
// that marker's line.
const routes = [
  { id: 'london', x: 499.6, y: 106.9, cx: 650, cy: 40, region: 'europe' }, // → London
  { id: 'berlin', x: 537.2, y: 104.1, cx: 680, cy: 58, region: 'europe' }, // → Berlin
  { id: 'new-york', x: 294.4, y: 136.9, cx: 540, cy: 20, region: 'americas' }, // → New York
  { id: 'san-francisco', x: 159.9, y: 145.1, cx: 470, cy: 10, region: 'americas' }, // → San Francisco
  { id: 'sao-paulo', x: 370.5, y: 315.4, cx: 560, cy: 250, region: 'americas' }, // → São Paulo
  { id: 'sydney', x: 920, y: 344.1, cx: 880, cy: 250, region: 'asia-pacific' }, // → Sydney
  { id: 'singapore', x: 788.4, y: 246.3, cx: 800, cy: 210, region: 'asia-pacific' }, // → Singapore
  { id: 'dubai', x: 653.5, y: 180, cx: 720, cy: 150, region: 'asia-pacific' }, // → Dubai
]

// One selection at a time: a single marker, or a whole region from the legend.
const activePoint = ref<string | null>(null)
const activeRegion = ref<RegionId | null>(null)

const selectPoint = (id: string) => {
  activePoint.value = activePoint.value === id ? null : id
  activeRegion.value = null
}
const toggleRegion = (id: RegionId) => {
  activeRegion.value = activeRegion.value === id ? null : id
  activePoint.value = null
}

// Flat dashed paths — animated by CSS so the dots keep flowing out of the hub.
const arcs = routes.map(r => ({
  id: r.id,
  region: r.region,
  d: `M${hub.x} ${hub.y} Q${r.cx} ${r.cy} ${r.x} ${r.y}`,
}))

// Softer mesh links between zones for a network feel.
const crossArcs: { d: string; points: string[]; regions: RegionId[] }[] = [
  { d: 'M499.6 106.9 Q400 40 294.4 136.9', points: ['london', 'new-york'], regions: ['europe', 'americas'] }, // London – New York
  { d: 'M788.4 246.3 Q860 290 920 344.1', points: ['singapore', 'sydney'], regions: ['asia-pacific'] }, // Singapore – Sydney
]

// Only the clicked marker's own routes light up. Everything else stays put.
const arcActive = (points: string[], regions: RegionId[]) =>
  activePoint.value === 'studio' ||
  (activePoint.value !== null && points.includes(activePoint.value)) ||
  (activeRegion.value !== null && regions.includes(activeRegion.value))
const arcDim = (points: string[], regions: RegionId[]) =>
  !arcActive(points, regions) && (activePoint.value !== null || activeRegion.value !== null)

const markerLabel = (id: string) =>
  id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
</script>

<template>
  <figure class="home-map" @keydown.esc="activePoint = null; activeRegion = null">
    <div class="x-map">
      <div class="x-map-canvas">
        <svg
          class="x-map-svg"
          viewBox="0 0 1000 500"
          role="group"
          aria-label="Dotted world map showing the studio based in UTC+8 and remote delivery zones across Europe, the Americas and Asia-Pacific"
        >
          <defs>
            <linearGradient id="xMapDots" x1="0" y1="0" x2="1" y2="0.6">
              <stop offset="0" style="stop-color: var(--x-map-dot-a)" />
              <stop offset="0.55" style="stop-color: var(--x-map-dot-b)" />
              <stop offset="1" style="stop-color: var(--x-map-dot-c)" />
            </linearGradient>
            <radialGradient id="xMapHubGlow">
              <stop offset="0" style="stop-color: var(--x-accent); stop-opacity: 0.4" />
              <stop offset="1" style="stop-color: var(--x-accent); stop-opacity: 0" />
            </radialGradient>
            <radialGradient id="xMapZoneGlow">
              <stop offset="0" style="stop-color: var(--x-accent-2); stop-opacity: 0.38" />
              <stop offset="1" style="stop-color: var(--x-accent-2); stop-opacity: 0" />
            </radialGradient>
          </defs>

          <path class="x-map-dots" :d="WORLD_DOTS_PATH" fill="url(#xMapDots)" />

          <g class="x-map-links" aria-hidden="true">
            <!-- Dashed route lines that are always visible. -->
            <path
              v-for="(a, i) in arcs"
              :key="`base-${i}`"
              class="x-map-arc x-map-arc-base"
              :class="{ 'is-dim': arcDim([a.id], [a.region]), 'is-active': arcActive([a.id], [a.region]) }"
              :d="a.d"
            />
            <path
              v-for="(c, i) in crossArcs"
              :key="`cross-${i}`"
              class="x-map-arc x-map-arc-base is-cross"
              :class="{ 'is-dim': arcDim(c.points, c.regions), 'is-active': arcActive(c.points, c.regions) }"
              :d="c.d"
            />
          </g>

          <g
            v-for="(zone, i) in zones"
            :key="zone.id"
            class="x-map-node is-zone"
            :class="{ 'is-active': activePoint === zone.id || activeRegion === zone.region }"
            :transform="`translate(${zone.x} ${zone.y})`"
            role="button"
            tabindex="0"
            :aria-label="`${markerLabel(zone.id)} — highlight its route`"
            :aria-pressed="activePoint === zone.id || activeRegion === zone.region"
            @click="selectPoint(zone.id)"
            @keydown.enter.prevent="selectPoint(zone.id)"
            @keydown.space.prevent="selectPoint(zone.id)"
          >
            <circle class="x-map-hit" r="14" />
            <circle class="x-map-halo" r="11" fill="url(#xMapZoneGlow)" />
            <circle class="x-map-ring" r="5.6" />
            <circle class="x-map-pulse" r="8" :style="{ animationDelay: `${-(i % 5) * 0.6}s` }" />
            <circle class="x-map-core" r="2.6" />
          </g>

          <g
            class="x-map-node"
            :class="{ 'is-active': activePoint === 'studio' }"
            :transform="`translate(${hub.x} ${hub.y})`"
            role="button"
            tabindex="0"
            aria-label="Studio — highlight its routes"
            :aria-pressed="activePoint === 'studio'"
            @click="selectPoint('studio')"
            @keydown.enter.prevent="selectPoint('studio')"
            @keydown.space.prevent="selectPoint('studio')"
          >
            <circle class="x-map-hit" r="20" />
            <circle class="x-map-halo is-hub" r="30" fill="url(#xMapHubGlow)" />
            <circle class="x-map-ring is-hub" r="13" />
            <circle class="x-map-pulse" r="10" />
            <circle class="x-map-pulse is-late" r="10" />
            <circle class="x-map-core" r="4.4" />
            <circle class="x-map-core-dot" r="1.5" />
          </g>
        </svg>
      </div>
    </div>

    <figcaption class="x-map-legend">
      <button
        type="button"
        class="x-map-key"
        :class="{ 'is-active': activeRegion === 'studio' }"
        :aria-pressed="activeRegion === 'studio'"
        @click="toggleRegion('studio')"
      >
        <i class="is-studio" aria-hidden="true"></i>Studio — based in UTC+8
      </button>
      <button
        type="button"
        class="x-map-key"
        :class="{ 'is-active': activeRegion === 'europe' }"
        :aria-pressed="activeRegion === 'europe'"
        @click="toggleRegion('europe')"
      >
        <i class="is-zone" aria-hidden="true"></i>Europe
      </button>
      <button
        type="button"
        class="x-map-key"
        :class="{ 'is-active': activeRegion === 'americas' }"
        :aria-pressed="activeRegion === 'americas'"
        @click="toggleRegion('americas')"
      >
        <i class="is-zone" aria-hidden="true"></i>Americas
      </button>
      <button
        type="button"
        class="x-map-key"
        :class="{ 'is-active': activeRegion === 'asia-pacific' }"
        :aria-pressed="activeRegion === 'asia-pacific'"
        @click="toggleRegion('asia-pacific')"
      >
        <i class="is-zone" aria-hidden="true"></i>Asia-Pacific
      </button>
    </figcaption>
  </figure>
</template>
