<template>
  <div @click="goToProject" class="cursor-pointer border p-4 rounded shadow hover:shadow-lg transition-shadow duration-200">
    <div class="grid grid-cols-6 gap-4">
      <div>
        <strong>Project:</strong>
        <p>{{ project.name }}</p>
      </div>
      <div>
        <strong>Klant:</strong>
        <p>{{ project.client }}</p>
      </div>
      <div>
        <strong>Projectgroep:</strong>
        <p>{{ project.group }}</p>
      </div>
      <div>
        <strong>Geplande opleverdatum:</strong>
        <p>{{ project.dueDate }}</p>
      </div>
      <div>
        <strong>Status:</strong>
        <div class="flex items-center">
          <p>{{ latestStatus }}</p>
          <span :class="statusIndicatorClass" class="ml-2 w-3 h-3 inline-block rounded-full"></span>
        </div>
      </div>
      <div>
        <strong>Betrokkenen:</strong>
        <div class="flex space-x-2">
          <ProfileAvatar v-for="member in project.members" :key="member.id" :name="member.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ProfileAvatar from '~/components/ProfileAvatar.vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goToProject = () => {
  router.push(`/projects/${props.project.id}`)
}

const latestStatus = computed(() => {
  if (!props.project.deliverables || props.project.deliverables.length === 0) {
    return 'Nog geen werk opgeleverd'
  }

  const latestDeliverable = props.project.deliverables.reduce((latest, current) => {
    const latestDate = new Date(latest.date)
    const currentDate = new Date(current.date)
    return currentDate > latestDate ? current : latest
  })

  return `${latestDeliverable.type === 'design' ? 'Design' : 'Ontwikkelen'}: ${latestDeliverable.status || 'Geen status'}`
})

const statusIndicatorClass = computed(() => {
  if (!props.project.deliverables || props.project.deliverables.length === 0) {
    return 'bg-red-500'
  }

  const latestDeliverable = props.project.deliverables.reduce((latest, current) => {
    const latestDate = new Date(latest.date)
    const currentDate = new Date(current.date)
    return currentDate > latestDate ? current : latest
  }, props.project.deliverables[0])

  switch (latestDeliverable.status) {
    case 'Geen werk opgeleverd':
    case 'Afgewezen':
      return 'bg-red-500'
    case 'Onder review':
      return 'bg-orange-500'
    case 'Goedgekeurd':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
})
</script>

<style scoped>
.cursor-pointer:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
