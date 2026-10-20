import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { createRequire } from 'module'
import Icons from 'unplugin-icons/vite'
import NavSiderbar from './tools/nav-sidebar'
import fs from 'fs'
import path from 'path'

interface BlogCategory {
  text: string
  link: string
  dir: string
}

const require = createRequire(import.meta.url)
const lucideIcons = require('@iconify-json/lucide/icons.json')

const navSiderbar = new NavSiderbar({
  entry: './posts',
  collapsed: true,
  ignoreFiles: ['index.md']
})

const sidebar = navSiderbar.getNavDeep('/posts', 'posts')
fs.writeFile('posts' + path.sep + 'index.json', JSON.stringify(sidebar), (err) => {
  if (err) {
    console.error('Error wrote posts list.', err)
  } else {
    console.info('Successfully wrote posts list.')
  }
})

// Blog sidebar is keyed by category (e.g. '/posts/backend/').
// Expose the categories so the sidebar can render a category dropdown.
const blogSidebar = navSiderbar.getSidebar('/posts')

function findFirstLink(items: DefaultTheme.SidebarItem[]): string | undefined {
  for (const item of items) {
    if (typeof item.link === 'string') return item.link
    if (Array.isArray(item.items)) {
      const link = findFirstLink(item.items)
      if (link) return link
    }
  }
  return undefined
}

const blogCategories: BlogCategory[] = Object.entries(
  blogSidebar as Record<string, DefaultTheme.SidebarItem[]>
).map(([dir, items]) => ({
  text: items[0]?.text ?? dir,
  dir,
  link: findFirstLink(items) ?? dir
}))

const lucide = lucideIcons as unknown as {
  icons: Record<string, { body: string }>
  width?: number
  height?: number
}

function lucideToSvg(name: string): string {
  const icon = lucide.icons[name]
  if (!icon) return ''
  const size = lucide.width || 24
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon.body}</svg>`
}

export default defineConfig({
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'Sunquakes Studio' }],
    ['meta', { name: 'keywords', content: 'custom software studio, software development studio, custom web app development, mobile app development, desktop app development, backend API development, AI business automation, 3D web development, GIS development, SaaS integration developer, React developer, Vue developer, Java developer, Golang developer, Node.js developer, Kubernetes, Docker, ClickHouse, MySQL, PostgreSQL, Redis, small business software, technical blog' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow, snippetext' }],
    ['meta', { name: 'bingbot', content: 'index, follow' }],
    ['link', { rel: 'canonical', href: 'https://sunquakes.com' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:site_name', content: 'Sunquakes Studio' }],
    ['meta', { property: 'og:title', content: 'Sunquakes Studio — Custom Web, Mobile & Desktop Apps' }],
    ['meta', { property: 'og:description', content: 'We build custom web, mobile and desktop apps, backend APIs, AI business automation, 3D and GIS solutions for small businesses. Fixed-scope packages, clear pricing, remote-friendly across EU and US time zones.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://sunquakes.com' }],
    ['meta', { property: 'og:image', content: 'https://sunquakes.com/assets/logo.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Sunquakes Studio' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@sunquakesio' }],
    ['meta', { name: 'twitter:creator', content: '@sunquakesio' }],
    ['meta', { name: 'twitter:title', content: 'Sunquakes Studio — Custom Web, Mobile & Desktop Apps' }],
    ['meta', { name: 'twitter:description', content: 'Custom web, mobile and desktop apps, backend APIs, AI business automation, 3D and GIS solutions for small businesses. Fixed-scope packages and clear pricing.' }],
    ['meta', { name: 'twitter:image', content: 'https://sunquakes.com/assets/logo.png' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/rss.xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'true' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Sunquakes Studio',
      alternateName: 'Sunquakes Studio — Custom Software Studio',
      url: 'https://sunquakes.com',
      description: 'Custom software studio building web, mobile and desktop apps, backend APIs, AI business automation, 3D and GIS solutions for small businesses.',
      author: {
        '@type': 'Organization',
        name: 'Sunquakes Studio',
        url: 'https://sunquakes.com/',
        sameAs: [
          'https://github.com/sunquakes',
          'https://x.com/sunquakesio',
          'mailto:sunquakes@outlook.com'
        ]
      },
      publisher: {
        '@type': 'Organization',
        name: 'Sunquakes Studio'
      }
    })],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Sunquakes Studio',
      description: 'Custom web, mobile and desktop app development, backend APIs, AI business automation, 3D and GIS solutions for businesses worldwide.',
      url: 'https://sunquakes.com',
      email: 'sunquakes@outlook.com',
      areaServed: ['US', 'CA', 'GB', 'DE', 'AU', 'SG'],
      availableLanguage: ['en', 'zh'],
      founder: {
        '@type': 'Person',
        name: 'Shing Rui',
        jobTitle: 'Founder & Full Stack Developer',
        url: 'https://sunquakes.com/',
        sameAs: [
          'https://github.com/sunquakes',
          'https://x.com/sunquakesio'
        ],
        knowsAbout: [
          'Java', 'Golang', 'JavaScript', 'TypeScript', 'React', 'Vue.js',
          'Node.js', 'Kubernetes', 'Docker', 'MySQL', 'PostgreSQL', 'Redis',
          'ClickHouse', 'DevOps', 'CI/CD', 'Microservices', 'RESTful API',
          'GraphQL', 'AI agents', 'SaaS integrations', 'WebGL', 'Three.js', 'GIS'
        ]
      },
      makesOffer: [
        { '@type': 'Offer', name: 'Custom Business Software Development', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'AI Business Automation', priceCurrency: 'USD' },
        { '@type': 'Offer', name: '3D Interactive Experiences', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'GIS & Map Solutions', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Deployment, Documentation & Training', priceCurrency: 'USD' }
      ]
    })]
  ],
  title: 'Sunquakes Studio',
  description: 'Custom software studio building web, mobile and desktop apps, backend APIs, AI business automation, 3D and GIS solutions for small businesses. Fixed-scope packages, clear pricing, remote-friendly.',
  lastUpdated: true,
  sitemap: {
    hostname: 'https://sunquakes.com'
  },
  themeConfig: {
    logo: '/assets/logo.svg',
    footer: {
      copyright: 'Copyright © 2024-present Sunquakes Studio'
    },
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Services', link: '/services/' },
      { text: 'Clients & Cases', link: '/clients-cases/' },
      { text: 'Contact', link: '/contact/' },
      {
        text: 'Blog',
        activeMatch: '^/posts/',
        items: blogCategories.map((category) => ({
          text: category.text,
          link: category.link
        }))
      }
    ],
    sidebar: blogSidebar,
    blogCategories,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sunquakes' },
      { icon: 'x', link: 'https://x.com/sunquakesio' }
    ]
  } as DefaultTheme.Config & { blogCategories: BlogCategory[] },
  vite: {
    plugins: [Icons({ compiler: 'vue3' })]
  },
  transformPageData(pageData) {
    const features = (pageData.frontmatter as Record<string, any>)?.features
    if (!Array.isArray(features)) return
    for (const feature of features) {
      if (typeof feature.icon === 'string' && feature.icon.startsWith('lucide:')) {
        feature.icon = lucideToSvg(feature.icon.slice('lucide:'.length))
      }
    }
  }
})
