<template>
    <div class="flex items-center mb-4">
      <input type="text" v-model="search" placeholder="Zoeken..." class="border p-2 rounded w-full" />
    </div>
  </template>
  
  <script setup>
  const search = defineProps(['modelValue'])
  </script>
  