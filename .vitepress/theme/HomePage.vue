<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

interface HeroAction {
  theme?: 'brand' | 'alt' | 'sponsor'
  text: string
  link: string
}

interface HeroImage {
  src: string
  alt?: string
}

interface Feature {
  icon?: string
  title?: string
  details?: string
  link?: string
}

const { frontmatter } = useData()

const hero = computed(() => frontmatter.value.hero ?? {})
const actions = computed<HeroAction[]>(() => hero.value.actions ?? [])
const features = computed<Feature[]>(() => frontmatter.value.features ?? [])
const marquee = computed<string[]>(() => frontmatter.value.marquee ?? [])

const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(async () => {
  await nextTick()
  const el = root.value
  if (!el) return

  const targets = Array.from(
    el.querySelectorAll<HTMLElement>(
      '.x-feature, .x-body .home-post, .x-body .home-card, .x-body .home-point, .x-body .home-cta, .x-body .home-lead, .x-body h2'
    )
  )

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'))
    return
  }

  el.classList.add('x-anim')
  targets.forEach((t, i) => {
    t.classList.add('x-reveal')
    t.style.setProperty('--x-reveal-delay', `${(i % 4) * 100}ms`)
  })

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  )

  targets.forEach((t) => observer!.observe(t))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div ref="root" class="x-home">
    <section class="x-hero">
      <div class="x-hero-bg" aria-hidden="true">
        <span class="x-blob x-blob-a"></span>
        <span class="x-blob x-blob-b"></span>
        <span class="x-blob x-blob-c"></span>
        <span class="x-grid"></span>
        <span class="x-noise"></span>
      </div>

      <div class="x-hero-inner">
        <div class="x-hero-copy">
          <span class="x-hero-badge">Full Stack · Cloud Native · AI</span>
          <h1 class="x-hero-name"><span class="x-grad-text">{{ hero.name }}</span></h1>
          <p v-if="hero.text" class="x-hero-text">{{ hero.text }}</p>
          <p v-if="hero.tagline" class="x-hero-tagline">{{ hero.tagline }}</p>

          <div v-if="actions.length" class="x-hero-actions">
            <a
              v-for="action in actions"
              :key="action.text"
              :href="action.link"
              class="x-btn"
              :class="`x-btn-${action.theme || 'alt'}`"
            >
              {{ action.text }}
            </a>
          </div>
        </div>

        <div v-if="hero.image" class="x-hero-visual">
          <span class="x-hero-glow" aria-hidden="true"></span>
          <img
            class="x-hero-image"
            :src="hero.image.src"
            :alt="hero.image.alt || hero.name"
          />
        </div>
      </div>
    </section>

    <section v-if="marquee.length" class="x-marquee" aria-hidden="true">
      <div class="x-marquee-track">
        <span v-for="(item, i) in marquee" :key="`m1-${i}`" class="x-marquee-item">{{ item }}</span>
        <span v-for="(item, i) in marquee" :key="`m2-${i}`" class="x-marquee-item">{{ item }}</span>
      </div>
    </section>

    <section v-if="features.length" class="x-features">
      <div class="x-features-grid">
        <article v-for="feature in features" :key="feature.title" class="x-feature">
          <span v-if="feature.icon" class="x-feature-icon" v-html="feature.icon"></span>
          <h3 class="x-feature-title">{{ feature.title }}</h3>
          <p class="x-feature-details">{{ feature.details }}</p>
        </article>
      </div>
    </section>

    <div class="x-body vp-doc">
      <Content />
    </div>
  </div>
</template>
