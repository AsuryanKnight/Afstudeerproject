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
            <h3 class="font-bold">Briefing/Projectbeschrijving</h3>
            <p>{{ project.description }}</p>
          </div>
          <div class="mt-4 bg-gray-100 p-4 rounded-md">
            <h3 class="font-bold">Betrokkenen</h3>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <h4 class="font-semibold">Projectmanager</h4>
                <div class="flex space-x-2 items-center">
                  <div 
                    v-for="member in project.members.filter(m => m.role === 'Project Manager')" 
                    :key="member.name" 
                    class="relative group"
                  >
                    <ProfileAvatar :name="member.name" :title="member.role" />
                    <button 
                      v-if="isProjectManager" 
                      @click="confirmRemoveMember(member)"
                      class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >x</button>
                  </div>
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
                  <div 
                    v-for="member in project.members.filter(m => m.role === 'Designer')" 
                    :key="member.name" 
                    class="relative group"
                  >
                    <ProfileAvatar :name="member.name" :title="member.role" />
                    <button 
                      v-if="isProjectManager" 
                      @click="confirmRemoveMember(member)"
                      class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >x</button>
                  </div>
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
                  <div 
                    v-for="member in project.members.filter(m => m.role === 'Ontwikkelaar')" 
                    :key="member.name" 
                    class="relative group"
                  >
                    <ProfileAvatar :name="member.name" :title="member.role" />
                    <button 
                      v-if="isProjectManager" 
                      @click="confirmRemoveMember(member)"
                      class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >x</button>
                  </div>
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
    <li v-for="(material, index) in project.materials" :key="index" class="flex items-center justify-between mb-2">
      <div>
        <strong>{{ material.name }}:</strong>
        <a :href="material.reference" target="_blank" class="ml-2 text-blue-500">{{ material.reference }}</a>
      </div>
      <button 
        v-if="isProjectManager" 
        @click="confirmRemoveMaterial(index)" 
        class="bg-red-500 text-white px-3 py-1 rounded"
      >Verwijderen</button>
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
          <div v-for="(platform, index) in project.platforms" :key="platform.name" class="mt-4 bg-gray-100 p-4 rounded-md">
            <p><strong>Platform:</strong> {{ platform.name }}</p>
            <p><strong>Type:</strong> {{ platform.type }}</p>
            <p><strong>Formaten:</strong></p>
            <ul>
              <li v-for="format in platform.formats" :key="format">{{ format }}</li>
            </ul>
            <div v-if="isProjectManager" class="mt-2 flex space-x-2">
              <button @click="openEditPlatformForm(index)" class="bg-yellow-500 text-white px-4 py-2 rounded">Bewerken</button>
              <button @click="confirmRemovePlatform(index)" class="bg-red-500 text-white px-4 py-2 rounded">Verwijderen</button>
            </div>
          </div>
          <button v-if="isProjectManager" @click="openAddPlatformForm" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Technische details toevoegen</button>
        </ProjectBlock>

        <ProjectBlock title="Opleveringen" :initiallyOpen="false">
          <div class="mt-4">
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
          <div class="mt-4">
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
      <!-- Remove Member Confirmation Modal -->
      <div v-if="showRemoveMemberConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Bevestiging</h2>
          <p>Wil je {{ memberToRemove?.name }} verwijderen als {{ memberToRemove?.role }}?</p>
          <div class="flex justify-end mt-4">
            <button @click="removeMember" class="bg-red-500 text-white px-4 py-2 rounded mr-2">Ja</button>
            <button @click="closeRemoveMemberConfirm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
          </div>
        </div>
      </div>
      <!-- Remove Material Confirmation Modal -->
      <div v-if="showRemoveMaterialConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Bevestiging</h2>
          <p>Wil je dit materiaal verwijderen?</p>
          <div class="flex justify-end mt-4">
            <button @click="removeMaterial" class="bg-red-500 text-white px-4 py-2 rounded mr-2">Ja</button>
            <button @click="closeRemoveMaterialConfirm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
          </div>
        </div>
      </div>
      <!-- Add Platform Form Modal -->
      <div v-if="showAddPlatformForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg w-1/3 max-h-96 overflow-y-auto">
          <h2 class="text-xl font-semibold mb-4">Technische details toevoegen</h2>
          <select v-model="selectedPlatform" @change="updateSelectedFormats" class="border p-2 w-full rounded mb-4">
            <option disabled value="">Selecteer een platform</option>
            <option v-for="platform in availablePlatforms" :key="platform.name" :value="platform">{{ platform.name }}</option>
          </select>
          <div v-if="selectedPlatform">
            <p><strong>Type:</strong> {{ selectedPlatform.type }}</p>
            <div v-for="format in selectedPlatform.formats" :key="format" class="flex items-center">
              <input type="checkbox" v-model="selectedFormats" :value="format" class="mr-2" checked />
              <span>{{ format }}</span>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="addPlatform" :disabled="!selectedPlatform" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Toevoegen</button>
            <button @click="closeAddPlatformForm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
          </div>
        </div>
      </div>
      <!-- Edit Platform Form Modal -->
      <div v-if="showEditPlatformForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg w-1/3 max-h-96 overflow-y-auto">
          <h2 class="text-xl font-semibold mb-4">Technische details bewerken</h2>
          <select v-model="selectedPlatform" @change="updateSelectedFormats" class="border p-2 w-full rounded mb-4" disabled>
            <option v-for="platform in availablePlatforms" :key="platform.name" :value="platform">{{ platform.name }}</option>
          </select>
          <div v-if="selectedPlatform">
            <p><strong>Type:</strong> {{ selectedPlatform.type }}</p>
            <div v-for="format in availablePlatforms.find(p => p.name === selectedPlatform.name).formats" :key="format" class="flex items-center">
              <input type="checkbox" v-model="selectedFormats" :value="format" class="mr-2" />
              <span>{{ format }}</span>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="savePlatformChanges" :disabled="!selectedPlatform" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Opslaan</button>
            <button @click="closeEditPlatformForm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
          </div>
        </div>
      </div>
      <!-- Remove Platform Confirmation Modal -->
      <div v-if="showRemovePlatformConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Bevestiging</h2>
          <p>Wil je dit platform verwijderen?</p>
          <div class="flex justify-end mt-4">
            <button @click="removePlatform" class="bg-red-500 text-white px-4 py-2 rounded mr-2">Ja</button>
            <button @click="closeRemovePlatformConfirm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
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

const showRemoveMemberConfirm = ref(false)
const memberToRemove = ref(null)

const showRemoveMaterialConfirm = ref(false)
const selectedMaterialIndex = ref(null)

const showAddPlatformForm = ref(false)
const showEditPlatformForm = ref(false)
const showRemovePlatformConfirm = ref(false)
const selectedPlatform = ref('')
const selectedFormats = ref([])
const availableProfiles = ref([])
const availablePlatforms = ref([])
const platformIndexToEdit = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:4000/projects')
    project.value = response.data.find(p => p.id === route.params.id)
    if (!project.value.deliverables) {
      project.value.deliverables = []
    }
    currentProfile.value = getCurrentProfile() // Ensure current profile is set

    const profilesResponse = await axios.get('http://localhost:4000/profiles')
    availableProfiles.value = profilesResponse.data

    const platformsResponse = await axios.get('http://localhost:4000/platforms')
    availablePlatforms.value = platformsResponse.data
  } catch (error) {
    console.error('Error fetching data:', error)
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

const confirmRemoveMember = (member) => {
  memberToRemove.value = member
  showRemoveMemberConfirm.value = true
}

const removeMember = async () => {
  project.value.members = project.value.members.filter(member => member !== memberToRemove.value)
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    members: project.value.members
  })
  closeRemoveMemberConfirm()
}

const closeRemoveMemberConfirm = () => {
  showRemoveMemberConfirm.value = false
  memberToRemove.value = null
}

const confirmRemoveMaterial = (index) => {
  selectedMaterialIndex.value = index
  showRemoveMaterialConfirm.value = true
}

const removeMaterial = async () => {
  project.value.materials.splice(selectedMaterialIndex.value, 1)
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    materials: project.value.materials
  })
  closeRemoveMaterialConfirm()
}

const closeRemoveMaterialConfirm = () => {
  showRemoveMaterialConfirm.value = false
  selectedMaterialIndex.value = null
}

const openAddPlatformForm = () => {
  selectedPlatform.value = ''
  selectedFormats.value = []
  showAddPlatformForm.value = true
}

const closeAddPlatformForm = () => {
  showAddPlatformForm.value = false
}

const openEditPlatformForm = (index) => {
  platformIndexToEdit.value = index
  selectedPlatform.value = project.value.platforms[index]
  selectedFormats.value = [...project.value.platforms[index].formats]
  showEditPlatformForm.value = true
}

const closeEditPlatformForm = () => {
  showEditPlatformForm.value = false
  platformIndexToEdit.value = null
}

const updateSelectedFormats = () => {
  if (selectedPlatform.value) {
    selectedFormats.value = [...selectedPlatform.value.formats]
  }
}

const addPlatform = async () => {
  const newPlatform = {
    name: selectedPlatform.value.name,
    type: selectedPlatform.value.type,
    formats: selectedFormats.value
  }

  if (!project.value.platforms) {
    project.value.platforms = []
  }

  project.value.platforms.push(newPlatform)
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    platforms: project.value.platforms
  })

  selectedPlatform.value = ''
  selectedFormats.value = []
  showAddPlatformForm.value = false
}

const savePlatformChanges = async () => {
  const updatedPlatform = {
    ...selectedPlatform.value,
    formats: selectedFormats.value
  }

  project.value.platforms.splice(platformIndexToEdit.value, 1, updatedPlatform)
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    platforms: project.value.platforms
  })

  closeEditPlatformForm()
}

const confirmRemovePlatform = (index) => {
  platformIndexToEdit.value = index
  showRemovePlatformConfirm.value = true
}

const removePlatform = async () => {
  project.value.platforms.splice(platformIndexToEdit.value, 1)
  await axios.patch(`http://localhost:4000/projects/${route.params.id}`, {
    platforms: project.value.platforms
  })
  closeRemovePlatformConfirm()
}

const closeRemovePlatformConfirm = () => {
  showRemovePlatformConfirm.value = false
  platformIndexToEdit.value = null
}
</script>

<style scoped>
.cursor-pointer:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  position: relative;
}

.profile-avatar:hover .remove-icon {
  opacity: 1;
}

.remove-icon {
  position: absolute;
  top: 0;
  right: 0;
  background: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}
</style>
