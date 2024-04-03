<!-- eslint-disable import/no-unresolved -->
<script setup lang="ts">
import { useReviewStore } from '../stores/reviewStore'
import InformationCard from '@/views/pages/reviews/InformationCard.vue'
import InputField from '@/views/pages/reviews/InputField.vue'
import TagCard from '@/views/pages/reviews/TagCard.vue'
import ReviewCard from '@/views/pages/reviews/ReviewCard.vue'

const route = useRoute()
const classID = parseInt(route.params.classID as string)

const reviewStore = useReviewStore()

watch(
  () => parseInt(route.params.classID as string),
  async (newClassID: number | undefined) => {
    if (newClassID)
      await reviewStore.fetchCourse(newClassID)
  },
  { immediate: true },
)

onMounted(async () => {
  await reviewStore.fetchCourse(classID) // replace this with the actual id of the course
})
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 course overview here -->
    <VCol
      cols="12"
      md="8"
    >
      <InformationCard />
    </VCol>
    <VCol
      cols="12"
      md="4"
    >
      <TagCard :class-i-d="classID" />
    </VCol>
    <!-- 👉 pop up here -->
    <VRow justify="center">
      <InputField />
    </VRow>
    <VDivider class="my-2" />
    <!-- 👉 review card here -->
    <VCol
      v-for="(review, index) in reviewStore.course?.reviews"
      :key="index"
      cols="12"
    >
      <ReviewCard :review="review" />
    </VCol>
  </VRow>
</template>
