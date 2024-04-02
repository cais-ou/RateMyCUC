<script setup lang="ts">
import logo from '@images/logo.png'
import { useCourseStore } from '@/stores/courseStore'
import router from '@/router'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'

const courseStore = useCourseStore()

const authStore = useAuthStore();
const isLogged = computed (() => authStore.isLoggedIn);

const verified = ref(false)

onMounted(() => {
  const route = useRoute()
  verified.value = route.query.verified === 'true'
})

const items = ref([] as string[])
const values = ref('')

let timerId: ReturnType<typeof setTimeout> | null = null

const fetchSuggestions = async (value: string) => {
  await courseStore.fetchSuggestion(value)
  items.value = courseStore.suggestions
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (!isLogged.value) {
      router.push('/login');
    } else {
      router.push(`/search?keyword=${values.value}`)
      };
    }
  }

watch(values, newValue => {
  if (timerId)
    clearTimeout(timerId)

  timerId = setTimeout(() => {
    fetchSuggestions(newValue)
  }, 500)
}, { immediate: true })
</script>

<template>
  <div class="pa-8 ma-8 d-flex justify-center flex-wrap">
    <VResponsive max-width="650">
      <VImg
        class="mx-auto mt-12 mb-16"
        max-height="140"
        max-width="240"
        :src="logo"
      />
      <VAutocomplete
        v-model:search="values"
        :items="items"
        auto-select-first
        class="flex-full-width"
        density="comfortable"
        menu-icon=""
        placeholder="按课程/老师..."
        prepend-inner-icon="mdi-magnify"
        rounded
        theme="light"
        variant="solo"
        @keydown="handleKeyDown"
      />
    </VResponsive>
  </div>
</template>
