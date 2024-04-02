<script setup lang="ts">
import { useReviewStore } from '../../../stores/reviewStore'
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue';

interface Props {
  classID?: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  classID: 0,
})

const authStore = useAuthStore();
const userRole = computed(() => authStore.user?.role );

const reviewStore = useReviewStore()
const newTagDialog = ref(false)
const newTag = ref('')

const randomCourses = computed(() => {
  return reviewStore.course?.teachers.flatMap(teacher => teacher.courses)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6)
})

const submitTag = (classID: number | undefined) => {
  if (typeof classID === 'number') {
    useReviewStore().addTag(classID, newTag.value)
    newTag.value = ''
    newTagDialog.value = false
  }
}

const handleAddTagClick = () => {
  const role = userRole.value;
  if (role === 'admin' || role === 'authenticator') {
    newTagDialog.value = true;
  } else {
    alert('访客无法添加Tag，请前往角色认证升级权限');
  }
}
</script>

<template>
  <VCard class="d-flex flex-column">
    <VCardItem>
      <VCardTitle> Tags </VCardTitle>
    </VCardItem>
    <div class="d-flex flex-wrap">
      <VChip
        v-for="(courseTag, index) in reviewStore.course?.courseTags"
        :key="index"
        color="primary"
        class="ma-2"
        size="x-large"
        @click="reviewStore.upvoteTag(reviewStore.course?.classID ?? 0, courseTag.tag.id)"
      >
        {{ courseTag.tag.name }} ({{ courseTag.upvotes }})
      </VChip>
    </div>
    <VCardActions class="align-self-end">
      <VBtn @click="handleAddTagClick">
        添加 Tag
      </VBtn>
    </VCardActions>

    <VDialog
      v-model="newTagDialog"
      persistent
      max-width="600px"
    >
      <VCard>
        <VCardTitle>
          <span class="headline">添加一个新的 Tag</span>
        </VCardTitle>

        <VCardText>
          <VTextField
            v-model="newTag"
            label="Tag"
            required
          />
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="blue darken-1"
            @click="newTagDialog = false"
          >
            Close
          </VBtn>
          <VBtn
            color="blue darken-1"
            @click="submitTag(classID)"
          >
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDivider />

    <!-- 👉 related course  -->
    <VCardItem>
      <VCardTitle> 相关课程 </VCardTitle>
    </VCardItem>

    <VList>
      <VListItem
        v-for="(course, index) in randomCourses"
        :key="`course-${index}`"
        :to="`/review/${course.classID}`"
        router-link
        color="primary"
      >
        <VListItemText>
          {{ course.courseName }}
        </VListItemText>
      </VListItem>
    </VList>
  </VCard>
</template>
