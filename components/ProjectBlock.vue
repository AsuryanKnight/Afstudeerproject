<template>
    <div class="bg-gray-100 p-4 rounded mb-2">
      <div class="flex justify-between items-center cursor-pointer bg-gray-800 text-white p-2 rounded" @click="toggleOpen">
        <h2 class="text-xl font-bold">{{ title }}</h2>
        <button class="text-white">
          <span v-if="isOpen">▲</span>
          <span v-else>▼</span>
        </button>
      </div>
      <div v-if="isOpen" class="mt-4">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    initiallyOpen: {
      type: Boolean,
      default: false
    }
  })
  
  const isOpen = ref(props.initiallyOpen)
  
  const toggleOpen = () => {
    isOpen.value = !isOpen.value
  }
  </script>
  
  <style scoped>
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
  }
  </style>
  