<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'

const email = ref('');
const message = ref('');

const authStore = useAuthStore();
const isLogged = computed (() => authStore.isLoggedIn);
const userMail = computed(() => authStore.user?.email );

const sendVerificationEmail = async () => {
  try {
    const response = await axios.post('http://localhost:5000/send-mail', { email: userMail.value });
    message.value = response.data.message;
  } catch (error) {
    message.value = error.response ? error.response.data.error : 'An error occurred';
  }
};
</script>

<template>
  <div class="container">
    <h1>邮箱验证</h1>
    <div v-if="message" class="message">{{ message }}</div>
    <div>您的邮箱地址是：{{ userMail }}</div>
     <VBtn
        color="primary"
        v-bind="props"
        class="fixed-button"
        @click="sendVerificationEmail"
      >
        <VIcon icon="mdi-send" />
        发送邮件
      </VBtn>
  </div>
</template>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.input,
.button {
  margin-top: 10px;
  display: block;
  width: 100%;
}
.message {
  margin-bottom: 20px;
  color: green;
}
</style>
