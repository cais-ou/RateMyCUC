<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchAllUsers();
});

const users = computed(() => authStore.users);

const headers = [
  { title: '用户名', key: 'username' },
  { title: '用户邮箱', key: 'email' },
  { title: '角色', key: 'role' },
]
</script>

<template>
  <!-- <div>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.username }} -{{ user.email }}- {{ user.role }}
      </li>
    </ul>
  </div> -->
  <!-- <VDataTable
  :headers="headers"
  >

  </VDataTable> -->
</template>
