import { createContentLoader } from 'vitepress'

export interface CaseStudy {
  url: string
  title: string
  html: string
}

declare const data: CaseStudy[]
export { data }

// Renders each case-study page at build time so the popup can show it
// without fetching the page HTML at runtime.
// Cases may live in a folder (clients-cases/<name>/index.md) or as a flat
// file (clients-cases/<name>.md); the listing page itself is excluded.
export default createContentLoader(
  ['clients-cases/*/index.md', 'clients-cases/*.md', '!clients-cases/index.md'],
  {
    render: true,
    transform(raw): CaseStudy[] {
      return raw
        // The listing page itself must not become popup content.
        .filter(({ url }) => url !== '/clients-cases/')
        .map(({ url, html, frontmatter }) => ({
        // Flat pages get a .html url; strip it so it matches the card's
        // data-case-study attribute, which CaseStudyModal compares exactly.
        url: url.replace(/\.html$/, ''),
        title: (frontmatter.title as string) || 'Case study',
        html: html || ''
      }))
    }
  }
)
