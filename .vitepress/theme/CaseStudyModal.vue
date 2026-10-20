<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { data as caseStudies } from '../../clients-cases.data.mts'

const isOpen = ref(false)
const title = ref('')
const contentHtml = ref('')
const panelEl = ref<HTMLElement | null>(null)

let previousOverflow = ''

async function openCase(url: string) {
  const study = caseStudies.find((item) => item.url === url)
  if (!study) return

  // The case page is rendered at build time; lift its <h1> out as the popup title.
  const doc = new DOMParser().parseFromString(study.html, 'text/html')
  const heading = doc.querySelector('h1')

  title.value = heading?.textContent?.trim() || study.title
  heading?.remove()
  contentHtml.value = doc.body.innerHTML.trim()
  isOpen.value = true

  // Videos injected via v-html do not autoplay on their own; start them once mounted.
  await nextTick()
  panelEl.value?.querySelectorAll('video').forEach((video) => {
    video.muted = true
    video.playsInline = true
    video.play().catch(() => {
      // Autoplay blocked by the browser — the controls stay available.
    })
  })
}

function closeCase() {
  isOpen.value = false
  contentHtml.value = ''
  title.value = ''
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (!target || typeof target.closest !== 'function') return

  const trigger = target.closest<HTMLElement>('[data-case-study]')
  if (trigger) {
    event.preventDefault()
    const url = trigger.getAttribute('data-case-study')
    if (url) openCase(url)
    return
  }

  // A link inside the popup: let the router navigate, but close the popup first.
  if (panelEl.value?.contains(target) && target.closest('a')) closeCase()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) closeCase()
}

watch(isOpen, (open) => {
  if (open) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = previousOverflow
  }
})

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="pf-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="title || 'Case study'"
      @click.self="closeCase"
    >
      <div ref="panelEl" class="pf-modal-panel">
        <button type="button" class="pf-modal-close" aria-label="Close" @click="closeCase">×</button>
        <h2 v-if="title" class="pf-modal-title">{{ title }}</h2>
        <div class="vp-doc pf-modal-body" v-html="contentHtml" />
      </div>
    </div>
  </Teleport>
</template>
