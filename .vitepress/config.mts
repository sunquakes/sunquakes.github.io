import { defineConfig } from 'vitepress'
import NavSiderbar from './tools/nav-sidebar'
import fs from 'fs'
import path from 'path'

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

export default defineConfig({
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'Shing Rui' }],
    ['meta', { name: 'keywords', content: 'full stack developer, Java developer, Golang developer, JavaScript developer, React developer, Vue developer, Kubernetes tutorial, Docker tutorial, cloud native, DevOps engineer, software architecture, backend development, frontend development, web development, programming tutorials, coding best practices, microservices, RESTful API, database optimization, ClickHouse, MySQL, PostgreSQL, Redis, CI/CD, agile development, software engineering blog, tech blog, developer portfolio' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow, snippetext' }],
    ['meta', { name: 'bingbot', content: 'index, follow' }],
    ['link', { rel: 'canonical', href: 'https://sunquakes.com' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:site_name', content: 'Sunquakes - Full Stack Developer Blog' }],
    ['meta', { property: 'og:title', content: 'Sunquakes - Full Stack Developer | Java, Go, React, Vue, Kubernetes Expert' }],
    ['meta', { property: 'og:description', content: 'Expert full stack developer with 10+ years experience. Sharing practical tutorials on Java, Golang, JavaScript, TypeScript, React, Vue, Kubernetes, Docker, and modern web development.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://sunquakes.com' }],
    ['meta', { property: 'og:image', content: 'https://sunquakes.com/assets/logo.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Sunquakes Full Stack Developer Logo' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@sunquakesio' }],
    ['meta', { name: 'twitter:creator', content: '@sunquakesio' }],
    ['meta', { name: 'twitter:title', content: 'Sunquakes - Full Stack Developer Blog' }],
    ['meta', { name: 'twitter:description', content: 'Practical tutorials on Java, Golang, JavaScript, React, Vue, Kubernetes, Docker and modern web development from a developer with 10+ years experience.' }],
    ['meta', { name: 'twitter:image', content: 'https://sunquakes.com/assets/logo.png' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/rss.xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'true' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Sunquakes',
      alternateName: 'Sunquakes - Full Stack Developer Blog',
      url: 'https://sunquakes.com',
      description: 'Expert full stack developer sharing practical tutorials on Java, Golang, JavaScript, React, Vue, Kubernetes, Docker and modern web development',
      author: {
        '@type': 'Person',
        name: 'Shing Rui',
        jobTitle: 'Full Stack Developer',
        url: 'https://sunquakes.com/about',
        sameAs: [
          'https://github.com/sunquakes',
          'https://x.com/sunquakesio',
          'mailto:sunquakes@outlook.com'
        ]
      },
      publisher: {
        '@type': 'Person',
        name: 'Shing Rui'
      }
    })],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Shing Rui',
      jobTitle: 'Full Stack Developer',
      description: 'Full stack developer with 10+ years of experience in Java, Golang, JavaScript, TypeScript, React, Vue, Kubernetes, Docker',
      url: 'https://sunquakes.com',
      sameAs: [
        'https://github.com/sunquakes',
        'https://x.com/sunquakesio'
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance'
      },
      knowsAbout: [
        'Java', 'Golang', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 
        'Kubernetes', 'Docker', 'MySQL', 'PostgreSQL', 'Redis', 'ClickHouse',
        'DevOps', 'CI/CD', 'Microservices', 'RESTful API', 'GraphQL'
      ]
    })]
  ],
  title: 'Sunquakes',
  description: 'Expert full stack developer with 10+ years experience. Sharing practical tutorials on Java, Golang, JavaScript, TypeScript, React, Vue, Kubernetes, Docker, and modern web development.',
  lastUpdated: true,
  sitemap: {
    hostname: 'https://sunquakes.com'
  },
  themeConfig: {
    logo: '/assets/logo.svg',
    footer: {
      copyright: 'Copyright © 2024-present Shing Rui'
    },
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      ...navSiderbar.getNav('/posts'),
      { text: 'About', link: '/about' }
    ],
    sidebar: navSiderbar.getSidebar('/posts'),
    socialLinks: [{ icon: 'github', link: 'https://github.com/sunquakes' }]
  }
})
