<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'

interface BlogCategory {
  text: string
  link: string
  dir: string
}

const { theme, page } = useData()
const router = useRouter()

const categories = computed<BlogCategory[]>(
  () => ((theme.value as any).blogCategories ?? []) as BlogCategory[]
)

// Match the current page against the category path prefix (e.g. '/posts/backend/').
const currentDir = computed(() => {
  const relative = '/' + (page.value.relativePath || '')
  const matched = categories.value.find((category) =>
    relative.startsWith(category.dir)
  )
  return matched?.dir ?? categories.value[0]?.dir ?? ''
})

function onChange(event: Event) {
  const dir = (event.target as HTMLSelectElement).value
  const target = categories.value.find((category) => category.dir === dir)
  if (target) router.go(withBase(target.link))
}
</script>

<template>
  <div v-if="categories.length" class="blog-category-select">
    <label class="blog-category-select__label" for="blog-category">
      Category
    </label>
    <select
      id="blog-category"
      class="blog-category-select__control"
      :value="currentDir"
      @change="onChange"
    >
      <option v-for="category in categories" :key="category.dir" :value="category.dir">
        {{ category.text }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.blog-category-select {
  margin: 0 0 16px;
}

.blog-category-select__label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.blog-category-select__control {
  width: 100%;
  padding: 6px 32px 6px 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  transition: border-color 0.25s, background-color 0.25s;
}

.blog-category-select__control:hover,
.blog-category-select__control:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}
</style>
