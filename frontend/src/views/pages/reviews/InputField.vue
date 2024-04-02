<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<script setup lang="ts">
import { useReviewStore } from '@/stores/reviewStore'
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue';


const authStore = useAuthStore();
const userRole = computed(() => authStore.user?.role );
const reviewStore = useReviewStore()

const outlined = ref(true)
const dense = ref(false)
const hideToolbar = ref(false)
const disableToolbar = ref(false)
const errorMessages = ref(null)
const maxWidth = ref<number>(900)
const dialog = ref(false)

const courseId = ref(1)
const authorId = ref(1)
const content = ref('')
const rate = ref(0)
const score = ref(0)
const difficulty = ref(0)
const gain = ref(0)
const title = ref('')

const handleAddReviewClick = () => {
  const role = userRole.value;
  if (role === 'admin' || role === 'authenticator') {
    dialog.value = true;
  } else {
    alert('访客无法评论，请前往角色认证升级权限');
    dialog.value=false;
  }
}

const handleSubmit = async () => {
  try {
    await reviewStore.submitReview(
      courseId.value,
      authorId.value,
      difficulty.value,
      gain.value,
      rate.value,
      score.value,
      content.value,
      title.value,
    )

    // 清空输入框
    difficulty.value = 0
    gain.value = 0
    rate.value = 0
    score.value = 0
    content.value = ''
    dialog.value = false // 关闭对话框
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <VDialog
    v-model="dialog"
    persistent
    width="1024"
  >
    <template #activator="{ props }">
      <VBtn
        color="primary"
        v-bind="props"
        class="fixed-button"
        @click="handleAddReviewClick"
      >
        <VIcon icon="mdi-pencil" />
        写评论
      </VBtn>
    </template>
    <VCard>
      <VCardText>
        <VContainer class="text-start">
          <VRow>
            <VCol
              cols="12"
              md="1"
            >
              总评：
            </VCol>
            <VCol
              cols="12"
              md="5"
            >
              <VRating
                v-model="rate"
                hover
                half-increments
                class="me-3"
                density="compact"
              />
            </VCol>
            <VCol
              cols="12"
              md="1"
            >
              难度：
            </VCol>
            <VCol
              cols="12"
              md="5"
            >
              <VRating
                v-model="difficulty"
                hover
                half-increments
                class="me-3"
                density="compact"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol
              cols="12"
              md="1"
            >
              收获：
            </VCol>
            <VCol
              cols="12"
              md="5"
            >
              <VRating
                v-model="gain"
                hover
                half-increments
                class="me-3"
                density="compact"
              />
            </VCol>
            <VCol
              cols="12"
              md="1"
            >
              给分：
            </VCol>
            <VCol
              cols="12"
              md="5"
            >
              <VRating
                v-model="score"
                hover
                half-increments
                class="me-3"
                density="compact"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <VTextField
                v-model="title"
                label="标题"
              />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VuetifyTiptap
        v-model="content"
        label="撰写评论"
        :hide-toolbar="hideToolbar"
        :disable-toolbar="disableToolbar"
        :outlined="outlined"
        :dense="dense"
        :error-messages="errorMessages"
        rounded
        :max-height="465"
        :max-width="maxWidth"
      />
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="dialog = false"
        >
          Close
        </VBtn>
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="handleSubmit"
        >
          Submit
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.fixed-button {
  position: fixed;
  // To keep upgrade to pro button on top of v-layout
  z-index: 999;
  inset-block-end: 5%;
  inset-inline-end: 79px;
}
</style>
