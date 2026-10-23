---
layout: HomePage

hero:
  badge: "Custom software studio"
  name: "Software that saves you hours"
  highlight: "hours"
  text: "Small businesses and founders hire us to turn a clear idea into a working product — and to automate the manual work that slows them down."
  image:
    src: /assets/clients-cases/saas-customer-management.svg
    alt: "SaaS customer management dashboard showing accounts, statuses and sales metrics"
  clients:
    - name: Haier Thailand
      logo: /assets/clients/haier.png
      alt: Haier logo
    - name: CHINT
      logo: /assets/clients/chint.png
      alt: CHINT logo
  actions:
    - theme: brand
      text: Get in touch
      link: /contact/
    - theme: alt
      text: "View clients & cases"
      link: /clients-cases/

featuresTitle: "What We Do"
featuresSubtitle: "Four ways we help small teams ship software that earns its keep."

features:
  - icon: "lucide:layout-dashboard"
    title: Custom Business Software
    details: Bespoke web apps, branded business websites, and scalable backend APIs — with the integrations that connect your existing systems.
  - icon: "lucide:sparkles"
    title: AI Business Automation
    details: Custom AI agents, knowledge-base chatbots, and document processing that cut repetitive manual work from your operations.
  - icon: "lucide:box"
    title: 3D Interactive Experiences
    details: Interactive 3D product viewers, online configurators, and asset pipelines, optimised for smooth delivery in the browser.
  - icon: "lucide:map"
    title: GIS & Map Solutions
    details: Interactive web maps, 3D GIS scenes, and spatial dashboards — with data processing, geocoding, and custom map layers.
---

<script setup>
import IconArrowRight from '~icons/lucide/arrow-right'
import WorldMap from './.vitepress/theme/WorldMap.vue'
</script>

<p class="home-eyebrow">Selected work</p>

## Case Studies

<div class="home-projects">
  <a class="home-project" href="/clients-cases/" data-case-study="/clients-cases/ten-million-order-realtime-display">
    <span class="home-project-media">
      <img src="/assets/clients-cases/ten-million-order-realtime-display.jpg" alt="Batched query flow between a ClickHouse wide table and MySQL detail tables" loading="lazy" />
      <span class="home-project-tag">Backend · Data</span>
    </span>
    <span class="home-project-body">
      <span class="home-project-title">Ten-Million-Order Realtime Statistics</span>
      <span class="home-project-more">Read case study <IconArrowRight class="home-post-arrow" /></span>
    </span>
  </a>
  <a class="home-project" href="/clients-cases/" data-case-study="/clients-cases/3d-realtime-display">
    <span class="home-project-media">
      <video src="/assets/clients-cases/3d-realtime-display.mp4" autoplay muted loop playsinline></video>
      <span class="home-project-tag">3D · WebGL</span>
    </span>
    <span class="home-project-body">
      <span class="home-project-title">3D Realtime Display</span>
      <span class="home-project-more">Read case study <IconArrowRight class="home-post-arrow" /></span>
    </span>
  </a>
  <a class="home-project" href="/clients-cases/" data-case-study="/clients-cases/saas-customer-management-system">
    <span class="home-project-media">
      <img src="/assets/clients-cases/saas-customer-management.svg" alt="SaaS customer management dashboard showing accounts, statuses and sales metrics" loading="lazy" />
      <span class="home-project-tag">SaaS · Full-Stack</span>
    </span>
    <span class="home-project-body">
      <span class="home-project-title">SaaS Customer Management System</span>
      <span class="home-project-more">Read case study <IconArrowRight class="home-post-arrow" /></span>
    </span>
  </a>
</div>

<p class="home-more">
  <a href="/clients-cases/">View all cases <IconArrowRight class="home-post-arrow" /></a>
</p>

<p class="home-eyebrow">How we work</p>

## How We Work

<div class="home-points">
  <div class="home-point">
    <span class="home-point-num">01</span>
    <div class="home-point-body">
      <span class="home-point-title">Scope and price first</span>
      <span class="home-point-text">You get fixed deliverables and a fixed price before any work starts — no hourly guessing games.</span>
    </div>
  </div>
  <div class="home-point">
    <span class="home-point-num">02</span>
    <div class="home-point-body">
      <span class="home-point-title">Short, frequent updates</span>
      <span class="home-point-text">Written progress notes and working demos as we build, so there are no surprises at the end.</span>
    </div>
  </div>
  <div class="home-point">
    <span class="home-point-num">03</span>
    <div class="home-point-body">
      <span class="home-point-title">You own everything</span>
      <span class="home-point-text">Code, accounts, infrastructure, and documentation are handed over and fully yours.</span>
    </div>
  </div>
  <div class="home-point">
    <span class="home-point-num">04</span>
    <div class="home-point-body">
      <span class="home-point-title">Support after launch</span>
      <span class="home-point-text">Every project includes a bug-fix and small-tweak window once it's live.</span>
    </div>
  </div>
</div>

<p class="home-eyebrow">Global delivery</p>

## Where We Work

<p class="home-map-lead">Based in UTC+8 and delivering remotely — written updates in clear English, working demos as we build, and async-friendly workflows for teams across Asia-Pacific, Europe and the Americas.</p>

<WorldMap />

<div class="home-cta">
  <h2>Have a project in mind?</h2>
  <p>Tell us what you're trying to achieve and we'll suggest the smallest version that creates real value — with a fixed scope and a fixed price.</p>
  <div class="home-cta-actions">
    <a class="home-cta-btn brand" href="/contact/">Get in touch</a>
    <a class="home-cta-btn" href="/services/">See services &amp; pricing</a>
  </div>
</div>
