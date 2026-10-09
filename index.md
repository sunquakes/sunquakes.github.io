---
layout: HomePage

hero:
  name: "Shing Rui"
  text: "Full Stack Developer"
  tagline: "Embracing AI for efficient development"
  image:
    src: /assets/logo.png
    alt: Sunquakes
  actions:
    - theme: brand
      text: Explore Technical Articles
      link: /posts/
    - theme: alt
      text: View GitHub Profile
      link: https://github.com/sunquakes

features:
  - icon: "lucide:share-2"
    title: Share Development Experience
    details: Insights from 10+ years of software development across backend, frontend, and DevOps — learned from real-world projects.
  - icon: "lucide:book-open"
    title: Continuous Learning
    details: Staying current with cloud-native development, AI integration, and modern web frameworks, with tutorials you can apply immediately.
  - icon: "lucide:users"
    title: Connect Developers
    details: Building communities and fostering collaboration among developers worldwide. Join a growing network of tech enthusiasts.
  - icon: "lucide:handshake"
    title: Open to Collaboration
    details: Always exploring opportunities for innovative projects and partnerships. Let's build something amazing together.

marquee:
  - Java
  - Golang
  - TypeScript
  - React
  - Vue
  - Kubernetes
  - Docker
  - ClickHouse
  - DevOps
  - Node.js
  - PostgreSQL
  - Redis
  - Kafka
  - gRPC
---

<script setup>
import IconPuzzle from '~icons/lucide/puzzle'
import IconLayers from '~icons/lucide/layers'
import IconSettings from '~icons/lucide/settings'
import IconCode from '~icons/lucide/code'
import IconCheck from '~icons/lucide/check'
import IconArrowRight from '~icons/lucide/arrow-right'
</script>

<p class="home-lead">Practical solutions, tutorials, and insights from years of building real-world applications — no fluff, just actionable knowledge you can apply immediately.</p>

## Latest Articles

<div class="home-posts">
  <a class="home-post" href="/posts/frontend/3d/build-web-3d-with-react-components.html">
    <span class="home-post-tag">Frontend · 3D</span>
    <span class="home-post-title">Build Web 3D with React Components</span>
    <span class="home-post-excerpt">Skip the Three.js boilerplate — render scenes, models, and particle effects as composable React components.</span>
    <span class="home-post-more">Read article <IconArrowRight class="home-post-arrow" /></span>
  </a>
  <a class="home-post" href="/posts/ai/become-a-full-stack-developer-without-writing-code.html">
    <span class="home-post-tag">AI · Coding</span>
    <span class="home-post-title">Become a Full-Stack Developer Without Writing Code</span>
    <span class="home-post-excerpt">How AI coding tools collapsed the learning curve — ship a real product end-to-end, from idea to deployment.</span>
    <span class="home-post-more">Read article <IconArrowRight class="home-post-arrow" /></span>
  </a>
  <a class="home-post" href="/posts/backend/database/avoid-database-queries-in-loops.html">
    <span class="home-post-tag">Backend · Database</span>
    <span class="home-post-title">Avoid Database Queries in Large Data Loops</span>
    <span class="home-post-excerpt">The N+1 anti-pattern that turns a 10,000-record sync into a slog — and the batch-query patterns that fix it.</span>
    <span class="home-post-more">Read article <IconArrowRight class="home-post-arrow" /></span>
  </a>
  <a class="home-post" href="/posts/backend/kubernetes/differences-between-liveness-and-readness-probes.html">
    <span class="home-post-tag">Backend · Kubernetes</span>
    <span class="home-post-title">Differences Between Liveness and Readiness Probes</span>
    <span class="home-post-excerpt">One restarts your container, the other stops traffic — mixing them up causes cascading failures. Set them right.</span>
    <span class="home-post-more">Read article <IconArrowRight class="home-post-arrow" /></span>
  </a>
</div>

## What You'll Find Here

<div class="home-grid">
  <div class="home-card">
    <span class="home-card-icon"><IconPuzzle /></span>
    <h3 class="home-card-title">Problem-Solving Tutorials</h3>
    <p class="home-card-text">Real bugs, real fixes. Step-by-step walkthroughs of N+1 queries, race conditions, and memory leaks — with the code that solved them.</p>
  </div>
  <div class="home-card">
    <span class="home-card-icon"><IconLayers /></span>
    <h3 class="home-card-title">Production-Ready Patterns</h3>
    <p class="home-card-text">Architecture and design patterns battle-tested in high-traffic systems: caching strategies, batch processing, and service decomposition.</p>
  </div>
  <div class="home-card">
    <span class="home-card-icon"><IconSettings /></span>
    <h3 class="home-card-title">DevOps Best Practices</h3>
    <p class="home-card-text">Kubernetes probes, Docker builds, CI/CD pipelines, and infrastructure automation that actually survive production.</p>
  </div>
  <div class="home-card">
    <span class="home-card-icon"><IconCode /></span>
    <h3 class="home-card-title">Frontend & Backend</h3>
    <p class="home-card-text">Full-stack coverage — database optimization and API design on one end, responsive UI and WebGL rendering on the other.</p>
  </div>
</div>

## Why This Blog?

<div class="home-points">
  <div class="home-point">
    <span class="home-point-check"><IconCheck /></span>
    <span class="home-point-body">
      <span class="home-point-title">Production-Tested</span>
      <span class="home-point-text">Every post starts from an actual issue I hit in production — not recycled theory.</span>
    </span>
  </div>
  <div class="home-point">
    <span class="home-point-check"><IconCheck /></span>
    <span class="home-point-body">
      <span class="home-point-title">No Fluff</span>
      <span class="home-point-text">The why and the how, without wading through filler or academic detours.</span>
    </span>
  </div>
  <div class="home-point">
    <span class="home-point-check"><IconCheck /></span>
    <span class="home-point-body">
      <span class="home-point-title">Copy-Paste Ready</span>
      <span class="home-point-text">Complete, runnable code examples you can drop into your project in minutes.</span>
    </span>
  </div>
  <div class="home-point">
    <span class="home-point-check"><IconCheck /></span>
    <span class="home-point-body">
      <span class="home-point-title">Always Current</span>
      <span class="home-point-text">Regular updates from cloud-native tooling, AI-assisted development, and modern frameworks.</span>
    </span>
  </div>
</div>

<div class="home-cta">
  <a class="home-cta-btn brand" href="/posts/">Browse All Articles</a>
  <a class="home-cta-btn" href="/about/">About Me</a>
</div>
