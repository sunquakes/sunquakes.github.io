<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  url: string
}>()

const SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js'
const STYLE_HREF = 'https://assets.calendly.com/assets/external/widget.css'

const root = ref<HTMLElement | null>(null)

function loadStyle() {
  if (document.querySelector(`link[href="${STYLE_HREF}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = STYLE_HREF
  document.head.appendChild(link)
}

// Calendly only auto-detects `.calendly-inline-widget` on script load, which
// never happens on client-side navigation. So load the script once, then
// initialise the widget explicitly on every mount.
function loadScript(): Promise<void> {
  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
  if (existing) return Promise.resolve()
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  loadStyle()
  await loadScript()
  if (!root.value) return
  const calendly = (window as any).Calendly
  if (calendly?.initInlineWidget) {
    calendly.initInlineWidget({ url: props.url, parentElement: root.value })
  }
})
</script>

<template>
  <div ref="root" class="pf-calendly" style="min-width: 320px; height: 700px" />
</template>

<style scoped>
.pf-calendly {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--vp-c-bg-soft);
}
</style>
