<template>
  <h1>XSRF-Token-Reproducer</h1>
  <p>Hi there, thank you for using this reproducer. In order to get this up and running, you need a Laravel-instance.
    You may find this here: <a href="https://github.com/ahoiroman/csrf-backend-reproducer" target="_blank">https://github.com/ahoiroman/csrf-backend-reproducer</a></p>
  <h2>Try it out for yourself</h2>
  <p>Please check your browser's cookie storage and click around for a while. You can log in multiple times, logout again etc. You'll see an XSRF-token for .domain.test. After logging in and clicking around again, you'll find another cookie named `frontend.domain.test`</p>
  <div v-if="!isLoggedIn">You may want to try it out right here? Just <NuxtLink to="/auth/signin">Log in</NuxtLink></div>
  <div v-else>
    Maybe you would like to log out?
    <UButton @click="logout">Logout</UButton>
  </div>
  <hr />
  {{todos}}
</template>

<script setup lang="ts">
const {isLoggedIn, logout} = useAuth()
const {index} = useTodos()

const {data: todos, pending, refresh, error} = await index()
</script>