<script setup lang="ts">
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'
import * as yup from 'yup';

import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'

const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const router = useRouter()

const form = ref({
  privacyPolicies: false,
})

const registerStore = useAuthStore()

const schema = yup.object({
  username: yup.string().required('请输入用户名'),
  email: yup.string().email('请输入真实可用邮箱') // Update this line to include a custom message for invalid email format
    .matches(/^[^@]+@cuc\.edu\.cn$/, {message: '邮箱必须以@cuc.edu.cn结尾', excludeEmptyString: true}) // Ensure the email ends with @cuc.edu.cn
    .required('请输入真实可用的cuc 邮箱'), // Custom message for the required field
  password: yup.string().min(8, '必须至少8位数').required('请输入密码'),
})

const { useFieldModel, errors, handleSubmit } = useForm({
  validationSchema: schema,
})

const [username, email, password] = useFieldModel(['username', 'email', 'password']);

const onSubmit = handleSubmit((values) => {
  registerStore.register(values.username, values.email, values.password)
  .then(() => {
      if (registerStore.user) {
        router.push('/main')
      }
    })
})

const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          Rate My CUC
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Adventure starts here 🚀
        </h5>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="onSubmit">
          <VRow>
            <!-- Username -->
            <VCol cols="12">
              <VTextField v-model="username" label="Username" :error-messages="errors.username" />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="email" label="Email" type="email" :error-messages="errors.email" />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="password" label="Password" :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" :error-messages="errors.password" />
              <div class="d-flex align-center mt-1 mb-4">
                <VCheckbox id="privacy-policy" v-model="form.privacyPolicies" inline />
                <VLabel for="privacy-policy" style="opacity: 1;">
                  <span class="me-1">I agree to</span>
                  <a href="javascript:void(0)" class="text-primary">privacy policy & terms</a>
                </VLabel>
              </div>

              <VBtn block type="submit">
                Sign up
              </VBtn>
            </VCol>

            <!-- login instead -->
            <VCol cols="12" class="text-center text-base">
              <span>Already have an account?</span>
              <RouterLink class="text-primary ms-2" to="login">
                Sign in instead
              </RouterLink>
            </VCol>

            <VCol cols="12" class="d-flex align-center">
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <VCol cols="12" class="text-center">
              <AuthProvider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />

    <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />

    <!-- bg img -->
    <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
</style>
