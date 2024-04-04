<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore();
const router = useRouter();

const isLogged = computed (() => authStore.isLoggedIn);
const handleAvatarClick = () => {
  if(!isLogged.value){
    router.push('/login');
  }
}
const userName = computed(() => authStore.user?.username );
const userRole = computed(() => authStore.user?.role );

const showRoleManagement = ref(false);

onMounted(async () => {
  const userRole = authStore.user?.role; // 假设这里已经有用户角色信息
  if (userRole) {
    showRoleManagement.value = await authStore.checkAdminRole(userRole);
  }
});
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
      @click="handleAvatarClick"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{userName}}
            </VListItemTitle>
            <VListItemSubtitle>{{userRole}}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-account-outline"
                size="22"
              />
            </template>

            <VListItemTitle>主页</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link v-if="showRoleManagement" :to="'/role'">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-cog-outline"
                size="22"
              />
            </template>

            <VListItemTitle>角色管理</VListItemTitle>
          </VListItem>

          <VListItem link v-if="userRole === 'visitor'" :to="'/certification'">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-cog-outline"
                size="22"
              />
            </template>

            <VListItemTitle>用户认证</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem to="/login">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
