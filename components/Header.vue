<template>
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div class="flex items-center">
        <nuxt-link to="/" class="text-2xl font-bold">Project Management</nuxt-link>
      </div>
      <nav class="flex items-center space-x-6 ml-auto">
        <nuxt-link to="/" exact class="hover:underline" :class="{ 'underline': $route.path === '/' }">Alle projecten</nuxt-link>
        <nuxt-link to="/my-projects" class="hover:underline" :class="{ 'underline': $route.path === '/my-projects' }">Mijn projecten</nuxt-link>
        <nuxt-link to="/create-project" class="hover:underline" :class="{ 'underline': $route.path === '/create-project' }">Nieuw project aanmaken</nuxt-link>
      </nav>
      <div class="relative ml-6">
        <ProfileAvatar v-if="currentProfile" :name="currentProfile.name" @click="toggleDropdown" />
        <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <div v-for="profile in profiles" :key="profile.id" class="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer" @click="selectProfile(profile)">
            <ProfileAvatar :name="profile.name" />
            <span>{{ profile.name }}</span>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  
  const currentProfile = ref(null)
  const profiles = ref([])
  const dropdownOpen = ref(false)
  const router = useRouter()
  
  const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
  }
  
  const selectProfile = (profile) => {
    setCurrentProfile(profile)
    currentProfile.value = getCurrentProfile()
    dropdownOpen.value = false
    // Reload the current route to refresh the data
    router.push(router.currentRoute.value.fullPath)
  }
  
  onMounted(async () => {
    await fetchProfiles()
    currentProfile.value = getCurrentProfile()
    profiles.value = getProfiles()
  })
  </script>
  
  <style scoped>
  nav a {
    transition: all 0.3s ease;
  }
  
  nav a.underline {
    text-decoration: underline;
  }
  </style>
  