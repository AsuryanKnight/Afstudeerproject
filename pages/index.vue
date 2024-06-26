<template>
  <div>
    <Header />
    <div class="container mx-auto mt-4">
      <h1 class="text-2xl font-bold mb-4">Projecten Overzicht</h1>
      <div>
        <input v-model="searchQuery" placeholder="Zoek op projectcode" class="mb-4 p-2 border rounded">
      </div>
      <div class="space-y-4">
        <ProjectCard v-for="project in filteredProjects" :key="project.id" :project="project" />
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'

const projects = ref([])
const searchQuery = ref('')
const filteredProjects = computed(() => {
if (!searchQuery.value) {
  return projects.value;
}
return projects.value.filter(project =>
  project.name && project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
)
})

onMounted(async () => {
const response = await axios.get('http://localhost:4000/projects')
projects.value = response.data
})
</script>
