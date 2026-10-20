<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import BlogCategorySelect from './BlogCategorySelect.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #sidebar-nav-before>
      <BlogCategorySelect />
    </template>
  </DefaultTheme.Layout>
  <CaseStudyModal />
</template>
