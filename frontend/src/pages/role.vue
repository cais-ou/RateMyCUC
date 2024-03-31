<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchAllUsers();
});

const users = computed(() => authStore.users);
</script>

<template>
  <div>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.username }} -{{ user.email }}- {{ user.role }}
      </li>
    </ul>
  </div> 
</template>
