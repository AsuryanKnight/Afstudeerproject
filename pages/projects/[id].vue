<template>
  <div>
    <Header />
    <div class="container mx-auto mt-4">
      <div v-if="project">
        <ProjectBlock title="Algemene info" :initiallyOpen="true">
          <div class="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-md">
            <div><strong>Projectnaam:</strong> {{ project.name }}</div>
            <div><strong>Klant:</strong> {{ project.client }}</div>
            <div><strong>Projectgroep:</strong> {{ project.group }}</div>
            <div><strong>Geplande opleverdatum:</strong> {{ project.dueDate }}</div>
          </div>
          <div class="mt-4 bg-gray-100 p-4 rounded-md">
            <h3 class="font-semibold">Briefing/Projectbeschrijving</h3>
            <p>{{ project.description }}</p>
          </div>
          <div class="mt-4 bg-gray-100 p-4 rounded-md">
            <h3 class="font-semibold">Betrokkenen</h3>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <h4 class="font-semibold">Projectmanager</h4>
                <div class="flex space-x-2 items-center">
                  <ProfileAvatar 
                    v-for="member in project.members.filter(m => m.role === 'Project Manager')" 
                    :key="member.name" 
                    :name="member.name" 
                    :title="member.role" 
                  />
                  <button 
                    v-if="isProjectManager" 
                    @click="openAddMemberForm('Project Manager')" 
                    class="rounded-full bg-blue-500 text-white w-10 h-10 flex items-center justify-center"
                  >+</button>
                </div>
              </div>
              <div>
                <h4 class="font-semibold">Designers</h4>
                <div class="flex space-x-2 items-center">
                  <ProfileAvatar 
                    v-for="member in project.members.filter(m => m.role === 'Designer')" 
                    :key="member.name" 
                    :name="member.name" 
                    :title="member.role" 
                  />
                  <button 
                    v-if="isProjectManager" 
                    @click="openAddMemberForm('Designer')" 
                    class="rounded-full bg-blue-500 text-white w-10 h-10 flex items-center justify-center"
                  >+</button>
                </div>
              </div>
              <div>
                <h4 class="font-semibold">Ontwikkelaars</h4>
                <div class="flex space-x-2 items-center">
                  <ProfileAvatar 
                    v-for="member in project.members.filter(m => m.role === 'Ontwikkelaar')" 
                    :key="member.name" 
                    :name="member.name" 
                    :title="member.role" 
                  />
                  <button 
                    v-if="isProjectManager" 
                    @click="openAddMemberForm('Ontwikkelaar')" 
                    class="rounded-full bg-blue-500 text-white w-10 h-10 flex items-center justify-center"
                  >+</button>
                </div>
              </div>
            </div>
          </div>
        </ProjectBlock>

        <ProjectBlock title="Materialen" :initiallyOpen="false">
          <ul class="bg-gray-100 p-4 rounded-md">
            <li v-for="material in project.materials" :key="material.name">
              <strong>{{ material.name }}:</strong> 
              <a :href="material.reference" target="_blank" class="ml-2 text-blue-500">{{ material.reference }}</a>
            </li>
          </ul>
          <div v-if="!project.materials || project.materials.length === 0" class="mt-2 bg-gray-100 p-4 rounded-md">
            <p>Geen materialen beschikbaar</p>
          </div>
          <button v-if="isProjectManager" @click="showMaterialForm = true" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Materiaal Toevoegen</button>
          <div v-if="showMaterialForm" class="mt-2 bg-gray-100 p-4 rounded-md">
            <input v-model="newMaterialName" placeholder="Naam Materiaal" class="border p-2 rounded" />
            <input v-model="newMaterialLink" placeholder="Link Materiaal" class="border p-2 rounded ml-2" />
            <button @click="addMaterial" class="bg-green-500 text-white px-4 py-2 rounded ml-2">Toevoegen</button>
          </div>
        </ProjectBlock>

        <ProjectBlock title="Technische details" :initiallyOpen="false">
          <div v-for="platform in project.platforms" :key="platform.name" class="mt-4 bg-gray-100 p-4 rounded-md">
            <h4 class="font-semibold">{{ platform.name }}</h4>
            <p><strong>Type:</strong> {{ platform.type }}</p>
            <p><strong>Formaten:</strong></p>
            <ul>
              <li v-for="format in platform.formats" :key="format">{{ format }}</li>
            </ul>
          </div>
          <div class="mt-4 bg-gray-100 p-4 rounded-md">
            <h4 class="font-semibold">Design Opleveringen</h4>
            <div v-if="designDeliverables.length">
              <div v-for="design in designDeliverables" :key="design.name" class="mt-2 flex flex-col">
                <div class="flex items-center">
                  <a :href="design.link" target="_blank" class="font-semibold text-blue-500">{{ design.name }}</a>
                  <span class="mx-2">Opgeleverd op: {{ formatDate(design.date) }}</span>
                  <span class="ml-2">{{ design.status || 'Geen status' }}</span>
                  <span :class="statusIndicatorClass(design.status)" class="ml-2 w-3 h-3 inline-block rounded-full"></span>
                  <div v-if="design.status === 'Onder review' && isProjectManager" class="ml-2">
                    <button @click="approveDeliverable(design)" class="bg-green-500 text-white px-2 py-1 rounded">Goedkeuren</button>
                    <button @click="showRejectForm(design)" class="bg-red-500 text-white px-2 py-1 rounded ml-2">Afkeuren</button>
                  </div>
                </div>
                <p v-if="design.comment" class="ml-8 mt-1 bg-gray-200 p-2 rounded">Commentaar: {{ design.comment }}</p>
              </div>
            </div>
            <div v-else class="flex items-center">
              <span>Nog geen werk opgeleverd</span>
              <span class="ml-2 w-3 h-3 inline-block rounded-full bg-red-500"></span>
            </div>
            <button v-if="canAddDesign" @click="showDesignForm = true" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Werk Toevoegen</button>
            <div v-if="showDesignForm" class="mt-2 bg-gray-100 p-4 rounded-md">
              <input v-model="newDesignName" placeholder="Naam Werk" class="border p-2 rounded" />
              <input v-model="newDesignLink" placeholder="Link Werk" class="border p-2 rounded ml-2" />
              <button @click="addDesign" class="bg-green-500 text-white px-4 py-2 rounded ml-2">Toevoegen</button>
            </div>
          </div>
          <div class="mt-4 bg-gray-100 p-4 rounded-md">
            <h4 class="font-semibold">Ontwikkeling Opleveringen</h4>
            <div v-if="developmentDeliverables.length">
              <div v-for="development in developmentDeliverables" :key="development.name" class="mt-2 flex flex-col">
                <div class="flex items-center">
                  <a :href="development.link" target="_blank" class="font-semibold text-blue-500">{{ development.name }}</a>
                  <span class="mx-2">Opgeleverd op: {{ formatDate(development.date) }}</span>
                  <span class="ml-2">{{ development.status || 'Geen status' }}</span>
                  <span :class="statusIndicatorClass(development.status)" class="ml-2 w-3 h-3 inline-block rounded-full"></span>
                  <div v-if="development.status === 'Onder review' && isProjectManager" class="ml-2">
                    <button @click="approveDeliverable(development)" class="bg-green-500 text-white px-2 py-1 rounded">Goedkeuren</button>
                    <button @click="showRejectForm(development)" class="bg-red-500 text-white px-2 py-1 rounded ml-2">Afkeuren</button>
                  </div>
                </div>
                <p v-if="development.comment" class="ml-8 mt-1 bg-gray-200 p-2 rounded">Commentaar: {{ development.comment }}</p>
              </div>
            </div>
            <div v-else class="flex items-center">
              <span>Nog geen werk opgeleverd</span>
              <span class="ml-2 w-3 h-3 inline-block rounded-full bg-red-500"></span>
            </div>
            <button v-if="canAddDevelopment" @click="showDevelopmentForm = true" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Werk Toevoegen</button>
            <div v-if="showDevelopmentForm" class="mt-2 bg-gray-100 p-4 rounded-md">
              <input v-model="newDevelopmentName" placeholder="Naam Werk" class="border p-2 rounded" />
              <input v-model="newDevelopmentLink" placeholder="Link Werk" class="border p-2 rounded ml-2" />
              <button @click="addDevelopment" class="bg-green-500 text-white px-4 py-2 rounded ml-2">Toevoegen</button>
            </div>
          </div>
        </ProjectBlock>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
      <!-- Add Member Form Modal -->
      <div v-if="showAddMemberFormVisible" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg w-1/3 max-h-96 overflow-y-auto">
          <h2 class="text-xl font-semibold mb-4">Voeg nieuwe {{ addMemberRole }} toe</h2>
          <input v-model="searchQuery" placeholder="Zoek profielen" class="border p-2 w-full rounded mb-4" />
          <ul>
            <li v-for="profile in filteredProfiles" :key="profile.id" class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2 cursor-pointer" @click="addMember(profile)">
                <ProfileAvatar :name="profile.name" />
                <span>{{ profile.name }}</span>
              </div>
            </li>
          </ul>
          <div class="flex justify-end">
            <button @click="closeAddMemberForm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
          </div>
        </div>
      </div>
      <!-- Reject Form Modal -->
      <div v-if="showRejectCommentForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Waarom afkeuren?</h2>
          <textarea v-model="rejectComment" placeholder="Commentaar" class="border p-2 w-full rounded mb-4"></textarea>
          <div class="flex justify-end">
            <button @click="submitReject" class="bg-red-500 text-white px-4 py-2 rounded mr-2">Afkeuren</button>
            <button @click="closeRejectForm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Header from '~/components/Header.vue'
import ProfileAvatar from '~/components/ProfileAvatar.vue'
import ProjectBlock from '~/components/ProjectBlock.vue'
import { getCurrentProfile } from '~/utils/profileManager'

const route = useRoute()
const project = ref(null)
const currentProfile = ref(getCurrentProfile())

const showDesignForm = ref(false)
const newDesignName = ref('')
const newDesignLink = ref('')

const showDevelopmentForm = ref(false)
const newDevelopmentName = ref('')
const newDevelopmentLink = ref('')

const showMaterialForm = ref(false)
const newMaterialName = ref('')
const newMaterialLink = ref('')

const showRejectCommentForm = ref(false)
const rejectComment = ref('')
const selectedDeliverable = ref(null)

const showAddMemberFormVisible = ref(false)
const addMemberRole = ref('')
const searchQuery = ref('')

const availableProfiles = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:4000/projects')
    project.value = response.data.find(p => p.id === route.params.id)
    if (!project.value.deliverables) {
      project.value.deliverables = []
    }
    currentProfile.value = getCurrentProfile() // Ensure current profile is set

    // Fetch available profiles
    const profilesResponse = await axios.get('http://localhost:4000/profiles')
    availableProfiles.value = profilesResponse.data

  } catch (error) {
    console.error('Error fetching project data:', error)
  }
})

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('nl-NL', options)
}

const statusIndicatorClass = (status) => {
  switch (status) {
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
}

const designDeliverables = computed(() => {
  return project.value?.deliverables?.filter(deliverable => deliverable.type === 'design') || []
})

const developmentDeliverables = computed(() => {
  return project.value?.deliverables?.filter(deliverable => deliverable.type === 'development') || []
})

const hasRole = (role) => {
  return project.value?.members.some(member => member.name === currentProfile.value.name && member.role === role)
}

const canAddDesign = computed(() => hasRole('Designer'))
const canAddDevelopment = computed(() => hasRole('Ontwikkelaar'))
const isProjectManager = computed(() => hasRole('Project Manager'))

const addDeliverable = async (type) => {
  const newDeliverable = {
    name: type === 'design' ? newDesignName.value : newDevelopmentName.value,
    link: type === 'design' ? newDesignLink.value : newDevelopmentLink.value,
    status: 'Onder review',
    date: new Date().toISOString(),
    comment: '',
    type
  }

  if (!project.value.deliverables) {
    project.value.deliverables = []
  }

  project.value.deliverables.push(newDeliverable)
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    deliverables: project.value.deliverables
  })

  if (type === 'design') {
    newDesignName.value = ''
    newDesignLink.value = ''
    showDesignForm.value = false
  } else {
    newDevelopmentName.value = ''
    newDevelopmentLink.value = ''
    showDevelopmentForm.value = false
  }
}

const addDesign = () => addDeliverable('design')
const addDevelopment = () => addDeliverable('development')

const addMaterial = async () => {
  const newMaterial = {
    name: newMaterialName.value,
    reference: newMaterialLink.value
  }

  if (!project.value.materials) {
    project.value.materials = []
  }

  project.value.materials.push(newMaterial)
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    materials: project.value.materials
  })

  newMaterialName.value = ''
  newMaterialLink.value = ''
  showMaterialForm.value = false
}

const approveDeliverable = async (deliverable) => {
  deliverable.status = 'Goedgekeurd'
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    deliverables: project.value.deliverables
  })
}

const showRejectForm = (deliverable) => {
  selectedDeliverable.value = deliverable
  showRejectCommentForm.value = true
}

const submitReject = async () => {
  if (!rejectComment.value) {
    alert('Commentaar is verplicht bij afkeuren.')
    return
  }

  selectedDeliverable.value.status = 'Afgewezen'
  selectedDeliverable.value.comment = rejectComment.value
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    deliverables: project.value.deliverables
  })

  rejectComment.value = ''
  selectedDeliverable.value = null
  showRejectCommentForm.value = false
}

const closeRejectForm = () => {
  rejectComment.value = ''
  selectedDeliverable.value = null
  showRejectCommentForm.value = false
}

const openAddMemberForm = (role) => {
  addMemberRole.value = role
  searchQuery.value = ''
  showAddMemberFormVisible.value = true
}

const closeAddMemberForm = () => {
  showAddMemberFormVisible.value = false
}

const filteredProfiles = computed(() => {
  return availableProfiles.value.filter(profile => {
    const alreadyAdded = project.value.members.some(member => member.name === profile.name && member.role === addMemberRole.value)
    return !alreadyAdded && profile.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const addMember = async (profile) => {
  project.value.members.push({ ...profile, role: addMemberRole.value })
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    members: project.value.members
  })
  closeAddMemberForm()
}
</script>
