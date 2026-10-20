<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import IconArrowRight from '~icons/lucide/arrow-right'

interface HeroAction {
  theme?: 'brand' | 'alt' | 'sponsor'
  text: string
  link: string
}

interface HeroImage {
  src: string
  alt?: string
}

interface HeroClient {
  name: string
  logo: string
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
const clients = computed<HeroClient[]>(() => hero.value.clients ?? [])
const features = computed<Feature[]>(() => frontmatter.value.features ?? [])
const featuresTitle = computed<string>(() => frontmatter.value.featuresTitle ?? '')
const featuresSubtitle = computed<string>(() => frontmatter.value.featuresSubtitle ?? '')

// Split the headline so the final keyword can carry the accent gradient.
const headline = computed(() => {
  const name: string = hero.value.name ?? ''
  const highlight: string | undefined = hero.value.highlight
  const index = highlight ? name.lastIndexOf(highlight) : -1
  if (index < 0) return { lead: name, accent: '' }
  return {
    lead: name.slice(0, index),
    accent: name.slice(index)
  }
})

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
      '.x-hero-badge, .x-hero-name, .x-hero-text, .x-hero-actions, .x-hero-clients, .x-hero-visual, .x-feature, .x-section-head, .x-body .home-eyebrow, .x-body .home-project, .x-body .home-point, .x-body .home-map, .x-body .home-cta, .x-body .home-more'
    )
  )

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'))
    return
  }

  el.classList.add('x-anim')
  targets.forEach((t, i) => {
    t.classList.add('x-reveal')
    t.style.setProperty('--x-reveal-delay', `${(i % 4) * 90}ms`)
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
        <span class="x-glow x-glow-a"></span>
        <span class="x-glow x-glow-b"></span>
        <span class="x-grid"></span>
      </div>

      <div class="x-hero-inner">
        <div class="x-hero-copy">
          <span v-if="hero.badge" class="x-hero-badge">
            <span class="x-dot" aria-hidden="true"></span>
            {{ hero.badge }}
          </span>

          <h1 class="x-hero-name">
            {{ headline.lead }}<span v-if="headline.accent" class="x-grad-text">{{ headline.accent }}</span>
          </h1>

          <p v-if="hero.text" class="x-hero-text">{{ hero.text }}</p>

          <div v-if="actions.length" class="x-hero-actions">
            <a
              v-for="action in actions"
              :key="action.text"
              :href="action.link"
              class="x-btn"
              :class="`x-btn-${action.theme || 'alt'}`"
            >
              {{ action.text }}
              <IconArrowRight v-if="action.theme === 'brand'" class="x-btn-arrow" />
            </a>
          </div>

          <div v-if="clients.length" class="x-hero-clients">
            <span class="x-clients-label">Trusted by</span>
            <span v-for="client in clients" :key="client.name" class="x-client">
              <img
                :src="client.logo"
                :alt="client.alt || `${client.name} logo`"
                loading="lazy"
              />
            </span>
          </div>
        </div>

        <div v-if="hero.image" class="x-hero-visual">
          <span class="x-hero-halo" aria-hidden="true"></span>
          <figure class="x-window">
            <span class="x-window-bar" aria-hidden="true">
              <i></i><i></i><i></i>
            </span>
            <img
              class="x-window-img"
              :src="hero.image.src"
              :alt="hero.image.alt || hero.name"
            />
          </figure>
        </div>
      </div>
    </section>

    <section v-if="features.length" class="x-features">
      <div class="x-section-head">
        <span class="x-eyebrow">Capabilities</span>
        <h2 v-if="featuresTitle" class="x-section-title">{{ featuresTitle }}</h2>
        <p v-if="featuresSubtitle" class="x-section-lead">{{ featuresSubtitle }}</p>
      </div>

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
