<template>
    <div>
      <Header />
      <div class="container mx-auto mt-4">
        <h1 class="text-2xl font-bold mb-4">Mijn Projecten</h1>
        <div class="space-y-4">
          <ProjectCard v-for="project in filteredProjects" :key="project.id" :project="project" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { getCurrentProfile } from '~/utils/profileManager'
  import Header from '~/components/Header.vue'
  import ProjectCard from '~/components/ProjectCard.vue'
  
  const currentProfile = ref(getCurrentProfile())
  const projects = ref([])
  const filteredProjects = ref([])
  
  onMounted(async () => {
    const response = await axios.get('http://localhost:4000/projects')
    projects.value = response.data
    currentProfile.value = getCurrentProfile()
  
    // Filter projecten gebaseerd op het ingelogde profiel
    filteredProjects.value = projects.value.filter(project =>
      project.members.some(member => member.name === currentProfile.value.name)
    )
  })
  </script>
  