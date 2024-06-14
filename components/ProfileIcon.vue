<template>
    <div class="relative">
      <img :src="profile.icon" alt="Profile Icon" class="w-10 h-10 rounded-full" @click="toggleDropdown" />
      <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white shadow-md">
        <ul>
          <li v-for="p in profiles" :key="p.id" @click="changeProfile(p)" class="p-2 hover:bg-gray-100 cursor-pointer">{{ p.name }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const showDropdown = ref(false)
  const profiles = ref([
    { id: 1, name: 'John Doe', icon: '/profile-icons/jd.png' },
    { id: 2, name: 'Jane Smith', icon: '/profile-icons/js.png' },
    { id: 3, name: 'Sam Wilson', icon: '/profile-icons/sw.png' },
  ])
  const profile = defineProps(['profile'])
  
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
  }
  
  const changeProfile = (newProfile) => {
    profile.value = newProfile
    showDropdown.value = false
  }
  </script>
  