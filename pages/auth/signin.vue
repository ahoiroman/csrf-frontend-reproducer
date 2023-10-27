<template>
  <h1>Sign in</h1>
  <div>
    <NuxtLink to="/">Go back</NuxtLink>
  </div>
  <h2>Login details</h2>
  <p>Email: test@example.org - Password: test@example.org</p>
  <UForm
      :state="state"
      @submit="submit"
      class="space-y-4"
  >
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email"/>
    </UFormGroup>
    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password"/>
    </UFormGroup>
    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
<script setup lang="ts">
import {ref} from 'vue'
import type {FormSubmitEvent} from '@nuxt/ui/dist/runtime/types'

const {login} = useAuth()
const router = useRouter()

const state = ref({
  email: 'test@example.org',
  password: 'test@example.org'
})

function onSubmit(event: FormSubmitEvent<any>) {
  submit()
}

const {
  submit,
  inProgress,
  validationErrors,
  error
} = useSubmit(
    () => {
      return login({
        email: state.value.email,
        password: state.value.password
      })
    },
    {
      onSuccess: () => router.push("/"),
      onError: () => {
        alert("This did not work")
      }
    }
)
</script>
