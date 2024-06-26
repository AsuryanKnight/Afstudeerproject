<template>
    <div>
      <Header />
      <div class="container mx-auto mt-4">
        <h1 class="text-2xl font-bold mb-4">Projecten Overzicht</h1>
        <div class="space-y-4">
          <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  
  const projects = ref([])
  
  onMounted(async () => {
    const response = await axios.get('http://localhost:4000/projects')
    projects.value = response.data
  })
  </script>
  