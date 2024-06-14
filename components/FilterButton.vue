<template>
    <div class="flex items-center">
      <button @click="toggleFilter" class="bg-blue-500 text-white p-2 rounded">Filter</button>
      <div v-if="showFilter" class="mt-2 p-4 bg-white shadow-md rounded">
        <label class="block mb-2">
          Projectnaam/code:
          <input type="text" v-model="filters.name" class="border p-2 rounded w-full" />
        </label>
        <label class="block mb-2">
          Klant:
          <input type="text" v-model="filters.client" class="border p-2 rounded w-full" />
        </label>
        <label class="block mb-2">
          Status:
          <select v-model="filters.status" class="border p-2 rounded w-full">
            <option value="">Selecteer status</option>
            <option value="Geen werk opgeleverd">Geen werk opgeleverd</option>
            <option value="Onder review">Onder review</option>
            <option value="Werk afgekeurd">Werk afgekeurd</option>
            <option value="Werk goedgekeurd">Werk goedgekeurd</option>
            <option value="Project afgerond">Project afgerond</option>
          </select>
        </label>
        <button @click="applyFilters" class="bg-green-500 text-white p-2 rounded mt-2">Toepassen</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const showFilter = ref(false)
  const filters = ref({
    name: '',
    client: '',
    status: ''
  })
  
  const toggleFilter = () => {
    showFilter.value = !showFilter.value
  }
  
  const applyFilters = () => {
    // Emit filter event
    emit('filter', { ...filters.value })
    toggleFilter()
  }
  </script>
  