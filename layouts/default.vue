<template>
  <UContainer class="prose">
    <UCard class="my-4">
      You are logged in: {{isLoggedIn}}
    </UCard>
   <slot />
  </UContainer>
</template>
<script setup lang="ts">
const {isLoggedIn} = useAuth()
</script>