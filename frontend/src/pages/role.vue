<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { VDataTable } from 'vuetify/labs/VDataTable'

const authStore = useAuthStore();

const searchText = ref('');

onMounted(async () => {
  await authStore.fetchAllUsers();
});

const filteredUsers = computed(() => {
  const lowerSearchText = searchText.value.toLowerCase();
  return authStore.users.filter(user => 
    user.role !== 'admin' && 
    (user.username.toLowerCase().includes(lowerSearchText) || user.email.toLowerCase().includes(lowerSearchText))
  );
});

const headers = [
  { title: '用户ID',value:'id'},
  { title: '用户名', value: 'username' },
  { title: '电子邮件', value: 'email' },
  { title: '角色', value: 'role' },
  { title: '修改角色为访客',key:'visitor'},
  { title: '修改角色为认证',key:'authenticator'}
];

const makeVisitor = async (item) => {
  await authStore.makeVisitor(item.value);
  await authStore.fetchAllUsers();
};

const makeAuthenticator = async (item) => {
  await authStore.makeAuthenticator(item.value);
  await authStore.fetchAllUsers();
};
</script>

<template>
  <VDataTable
    :headers="headers"
    :items="filteredUsers"
    :search="searchText"
    class="elevation-1"
    item-key="id"
  >
    <template #top>
      <VTextField
        v-model="searchText"
        label="搜索用户"
        class="mx-4"
        append-icon="mdi-magnify"
        single-line
        hide-details
      />
     </template>
    <template #item.visitor="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="makeVisitor(item)"
      >
        mdi-pencil
      </v-icon>
    </template>
    <template #item.authenticator="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="makeAuthenticator(item)"
      >
        mdi-pencil
      </v-icon>
    </template>
  </VDataTable>
</template>

