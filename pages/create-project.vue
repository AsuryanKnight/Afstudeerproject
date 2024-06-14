<template>
    <div>
      <Header :pageTitle="pageTitle" />
      <div class="p-4">
        <h2>Nieuw Project Aanmaken</h2>
        <!-- Formulier voor het aanmaken van een nieuw project -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Header from '../components/Header.vue'
  
  const pageTitle = ref('Nieuw project aanmaken')
  </script>
  