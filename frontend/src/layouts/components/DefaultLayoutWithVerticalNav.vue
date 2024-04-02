<script lang="ts" setup>
import { useTheme } from 'vuetify'
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

// Search
import { useCourseStore } from '@/stores/courseStore'

// Login
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

const vuetifyTheme = useTheme()
const authStore = useAuthStore();
const isLogged = computed (() => authStore.isLoggedIn);
const courseStore = useCourseStore()

const items = ref([] as string[])
const values = ref('')

let timerId: ReturnType<typeof setTimeout> | null = null

const fetchSuggestions = async (value: string) => {
  await courseStore.fetchSuggestion(value)
  items.value = courseStore.suggestions
}

const handleAvatarClick = () => {
  if(!isLogged.value){
    router.push('/login');
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (!isLogged.value) {
      router.push('/login');
    } else {
      router.push(`/search?keyword=${values.value}`).then(() => {
        console.log(isLogged.value)
        newDialog.value = false
      });
    }
  }
}


watch(
  values,
  newValue => {
    if (timerId) clearTimeout(timerId)

    timerId = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 500)
  },
  { immediate: true },
)

const newDialog = ref(false)
</script>

<template>
  <VDialog
    v-model="newDialog"
    max-width="600px"
  >
    <VCard style="background-color: transparent">
      <VResponsive max-width="600px">
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
    </VCard>
  </VDialog>

  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <!-- <div class="navbar-fixed"> -->
      <!-- <div class="d-flex h-100 align-center"> -->
      <!-- 👉 Vertical nav toggle in overlay mode -->
      <!-- 👉 Search -->
      <div
        class="d-flex h-100 align-center cursor-pointer"
        style="user-select: none"
      >
        <IconBtn
          class="ms-n d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="mdi-menu" />
        </IconBtn>
        <!-- 👉 Search Trigger button -->
        <IconBtn @click="newDialog = true">
          <VIcon icon="mdi-magnify" />
        </IconBtn>
        <span class="d-none d-md-flex align-center text-disabled">
          <span class="me-3">搜索</span>
        </span>

        <VSpacer />

        <IconBtn
          class="me-2"
          href="https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon icon="mdi-github" />
        </IconBtn>
        <IconBtn class="me-2">
          <VIcon icon="mdi-bell-outline" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
      <!-- </div> -->
    </template>

    <template #vertical-nav-content>
      <!-- 👉 Pages -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Pages',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '登录',
          icon: 'mdi-login',
          to: '/login',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '注册',
          icon: 'mdi-account-plus-outline',
          to: '/register',
        }"
      />
      <!-- 👉 User Interface -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'User Interface',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '课程列表',
          icon: 'mdi-table',
          to:'/courselist',
        }"
        @click="handleClick"
      />
      <VerticalNavLink
        :item="{
          title: '关于我们',
          icon: 'mdi-information-outline',
          to: '/about-us',
        }"
      />
    </template>
    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.navbar-fixed {
  position: fixed;
  width: 84%;
  background-color: #fff;
  opacity: 1;
}
</style>
