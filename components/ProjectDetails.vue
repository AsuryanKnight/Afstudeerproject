<template>
    <div class="p-4">
      <div class="mb-4">
        <h2 class="text-xl font-bold">Algemene info</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Projectcode/naam:</strong> {{ project.name }}</p>
            <p><strong>Projectgroep:</strong> {{ project.group }}</p>
          </div>
          <div>
            <p><strong>Klant:</strong> {{ project.client }}</p>
            <p><strong>Geplande opleverdatum:</strong> {{ project.dueDate }}</p>
          </div>
        </div>
        <p class="mt-4"><strong>Briefing/beschrijving:</strong> {{ project.description }}</p>
        <p class="mt-4"><strong>Betrokkenen:</strong></p>
        <div class="flex space-x-2">
          <ProfileIcon v-for="member in project.members" :key="member.id" :profile="member" />
        </div>
      </div>
      <div class="mb-4">
        <h2 class="text-xl font-bold">Materialen</h2>
        <ul>
          <li v-for="material in project.materials" :key="material.name">
            {{ material.name }} - <a :href="material.reference" target="_blank" class="text-blue-500 underline">Bekijk materiaal</a>
          </li>
        </ul>
      </div>
      <div class="mb-4">
        <h2 class="text-xl font-bold">Technische details</h2>
        <div>
          <p><strong>Platformen:</strong> {{ project.platforms.map(p => p.name).join(', ') }}</p>
          <p><strong>Formaten:</strong></p>
          <ul>
            <li v-for="format in project.formats" :key="format">{{ format }}</li>
          </ul>
          <p><strong>Opgelverd werk:</strong></p>
          <ul>
            <li v-for="work in project.deliverables" :key="work.name">
              <a :href="work.link" target="_blank" class="text-blue-500 underline">{{ work.name }}</a> - <span :class="statusClass(work.status)">{{ work.status }}</span> ({{ work.date }})
              <p v-if="work.comment" class="text-red-500">Commentaar: {{ work.comment }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  import ProfileIcon from './ProfileIcon.vue'
  
  const props = defineProps({
    project: Object
  })
  
  const statusClass = (status) => {
    switch (status) {
      case 'Geen werk opgeleverd':
        return 'text-red-500'
      case 'Onder review':
        return 'text-orange-500'
      case 'Werk afgekeurd':
        return 'text-red-500'
      case 'Werk goedgekeurd':
        return 'text-green-500'
      case 'Project afgerond':
        return 'text-green-500'
      default:
        return ''
    }
  }
  </script>
  