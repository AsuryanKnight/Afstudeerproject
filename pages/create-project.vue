<template>
  <div>
    <Header />
    <div class="container mx-auto mt-4">
      <ProjectBlock title="Algemene info" :initiallyOpen="true">
        <div class="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-md">
          <div>
            <label for="projectName"><strong>Projectnaam<span class="text-red-500">*</span>:</strong></label>
            <input id="projectName" v-model="project.name" type="text" class="border p-2 rounded w-full" />
          </div>
          <div>
            <label for="projectClient"><strong>Klant<span class="text-red-500">*</span>:</strong></label>
            <input id="projectClient" v-model="project.client" type="text" class="border p-2 rounded w-full" />
          </div>
          <div>
            <label for="projectGroup"><strong>Projectgroep:</strong></label>
            <input id="projectGroup" v-model="project.group" type="text" class="border p-2 rounded w-full" />
          </div>
          <div>
            <label for="projectDueDate"><strong>Geplande opleverdatum<span class="text-red-500">*</span>:</strong></label>
            <input id="projectDueDate" v-model="project.dueDate" type="date" class="border p-2 rounded w-full" />
          </div>
        </div>
        <div class="mt-4 bg-gray-100 p-4 rounded-md">
          <label for="projectDescription"><h3 class="font-bold">Briefing/Projectbeschrijving<span class="text-red-500">*</span></h3></label>
          <textarea id="projectDescription" v-model="project.description" class="border p-2 rounded w-full" rows="4"></textarea>
        </div>
        <div class="mt-4 bg-gray-100 p-4 rounded-md">
          <h3 class="font-bold">Betrokkenen</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <h4 class="font-semibold">Projectmanager</h4>
              <div class="flex space-x-2">
                <ProfileAvatar v-for="member in project.members.filter(m => m.role === 'Project Manager')" :key="member.name" :name="member.name" :title="member.role" />
                <button @click="openAddMemberForm('Project Manager')" class="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">+</button>
              </div>
            </div>
            <div>
              <h4 class="font-semibold">Designers</h4>
              <div class="flex space-x-2">
                <ProfileAvatar v-for="member in project.members.filter(m => m.role === 'Designer')" :key="member.name" :name="member.name" :title="member.role" />
                <button @click="openAddMemberForm('Designer')" class="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">+</button>
              </div>
            </div>
            <div>
              <h4 class="font-semibold">Ontwikkelaars</h4>
              <div class="flex space-x-2">
                <ProfileAvatar v-for="member in project.members.filter(m => m.role === 'Ontwikkelaar')" :key="member.name" :name="member.name" :title="member.role" />
                <button @click="openAddMemberForm('Ontwikkelaar')" class="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">+</button>
              </div>
            </div>
          </div>
        </div>
      </ProjectBlock>

      <ProjectBlock title="Materialen" :initiallyOpen="false">
        <ul class="bg-gray-100 p-4 rounded-md">
          <li v-for="(material, index) in project.materials" :key="material.name" class="flex items-center">
            <div class="flex-1">
              <strong>{{ material.name }}:</strong>
              <a :href="material.reference" target="_blank" class="ml-2 text-blue-500">{{ material.reference }}</a>
            </div>
            <button @click="removeMaterial(index)" class="ml-2 bg-red-500 text-white px-2 py-1 rounded">Verwijderen</button>
          </li>
        </ul>
        <div v-if="!project.materials || project.materials.length === 0" class="mt-2 bg-gray-100 p-4 rounded-md">
          <p>Geen materialen beschikbaar</p>
        </div>
        <button @click="showMaterialForm = true" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Materiaal Toevoegen</button>
        <div v-if="showMaterialForm" class="mt-2 bg-gray-100 p-4 rounded-md">
          <input v-model="newMaterialName" placeholder="Naam Materiaal" class="border p-2 rounded" />
          <input v-model="newMaterialLink" placeholder="Link Materiaal" class="border p-2 rounded ml-2" />
          <button @click="addMaterial" class="bg-green-500 text-white px-4 py-2 rounded ml-2">Toevoegen</button>
        </div>
      </ProjectBlock>

      <ProjectBlock title="Technische details" :initiallyOpen="false">
        <div v-for="(platform, index) in project.platforms" :key="platform.name" class="mt-4 bg-gray-100 p-4 rounded-md">
          <h4 class="font-semibold">{{ platform.name }}</h4>
          <p><strong>Type:</strong> {{ platform.type }}</p>
          <p><strong>Formaten:</strong></p>
          <ul>
            <li v-for="format in platform.formats" :key="format">{{ format }}</li>
          </ul>
          <div class="flex space-x-2 mt-2">
            <button @click="openEditPlatformForm(index)" class="bg-yellow-500 text-white px-2 py-1 rounded">Bewerken</button>
            <button @click="confirmRemovePlatform(index)" class="bg-red-500 text-white px-2 py-1 rounded">Verwijderen</button>
          </div>
        </div>
        <button v-if="isProjectManager" @click="openAddPlatformForm" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Technische details toevoegen</button>
      </ProjectBlock>

      <div class="flex justify-end mt-4">
        <button @click="createProject" :disabled="!canCreateProject" :class="{'opacity-60': !canCreateProject, 'cursor-not-allowed': !canCreateProject}" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Taak aanmaken</button>
        <button @click="cancel" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
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
            <button @click="savePlatformChanges" :disabled="!selectedPlatform" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Opslaan</button>
            <button @click="closeEditPlatformForm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
          </div>
        </div>
      </div>

      <!-- Remove Platform Confirm Modal -->
      <div v-if="showRemovePlatformConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg w-1/3 max-h-96 overflow-y-auto">
          <h2 class="text-xl font-semibold mb-4">Platform verwijderen</h2>
          <p>Weet je zeker dat je dit platform wilt verwijderen?</p>
          <div class="flex justify-end mt-4">
            <button @click="removePlatform" class="bg-red-500 text-white px-4 py-2 rounded mr-2">Verwijderen</button>
            <button @click="closeRemovePlatformConfirm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Header from '~/components/Header.vue'
import ProfileAvatar from '~/components/ProfileAvatar.vue'
import ProjectBlock from '~/components/ProjectBlock.vue'
import { getCurrentProfile } from '~/utils/profileManager'

const router = useRouter()
const currentProfile = ref(getCurrentProfile())

const project = ref({
  name: '',
  client: '',
  group: '',
  dueDate: '',
  description: '',
  members: [{ ...currentProfile.value, role: 'Project Manager' }],
  materials: [],
  platforms: []
})

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
const filteredProfiles = computed(() => {
  return availableProfiles.value.filter(profile => {
    const alreadyAdded = project.value.members.some(member => member.name === profile.name && member.role === addMemberRole.value)
    return !alreadyAdded && profile.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const showAddPlatformForm = ref(false)
const selectedPlatform = ref('')
const selectedFormats = ref([])
const availablePlatforms = ref([])
const showEditPlatformForm = ref(false)
const platformIndexToEdit = ref(null)
const platformIndexToRemove = ref(null)
const showRemovePlatformConfirm = ref(false)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:4000/profiles')
    availableProfiles.value = response.data
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
  newMaterialName.value = ''
  newMaterialLink.value = ''
  showMaterialForm.value = false
}

const removeMaterial = (index) => {
  project.value.materials.splice(index, 1)
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

const addMember = (profile) => {
  project.value.members.push({ ...profile, role: addMemberRole.value })
  closeAddMemberForm()
}

const openAddPlatformForm = () => {
  selectedPlatform.value = ''
  selectedFormats.value = []
  showAddPlatformForm.value = true
}

const closeAddPlatformForm = () => {
  selectedPlatform.value = ''
  selectedFormats.value = []
  showAddPlatformForm.value = false
}

const openEditPlatformForm = (index) => {
  platformIndexToEdit.value = index
  selectedPlatform.value = project.value.platforms[index]
  selectedFormats.value = [...selectedPlatform.value.formats]
  showEditPlatformForm.value = true
}

const closeEditPlatformForm = () => {
  platformIndexToEdit.value = null
  selectedPlatform.value = ''
  selectedFormats.value = []
  showEditPlatformForm.value = false
}

const updateSelectedFormats = () => {
  if (selectedPlatform.value && selectedPlatform.value.formats) {
    selectedFormats.value = [...selectedPlatform.value.formats]
  }
}

const addPlatform = () => {
  if (selectedPlatform.value && selectedFormats.value.length) {
    project.value.platforms.push({
      name: selectedPlatform.value.name,
      type: selectedPlatform.value.type,
      formats: selectedFormats.value
    })
    closeAddPlatformForm()
  }
}

const savePlatformChanges = () => {
  if (selectedPlatform.value && selectedFormats.value.length && platformIndexToEdit.value !== null) {
    project.value.platforms[platformIndexToEdit.value] = {
      name: selectedPlatform.value.name.name,
      type: selectedPlatform.value.type,
      formats: selectedFormats.value
    }
    closeEditPlatformForm()
  }
}

const confirmRemovePlatform = (index) => {
  platformIndexToRemove.value = index
  showRemovePlatformConfirm.value = true
}

const removePlatform = () => {
  project.value.platforms.splice(platformIndexToRemove.value, 1)
  closeRemovePlatformConfirm()
}

const closeRemovePlatformConfirm = () => {
  showRemovePlatformConfirm.value = false
  platformIndexToRemove.value = null
}

const createProject = async () => {
  if (canCreateProject.value) {
    const response = await axios.post('http://localhost:4000/projects', project.value)
    const newProjectId = response.data.id
    router.push(`/projects/${newProjectId}`)
  }
}

const cancel = () => {
  router.push('/')
}

const canCreateProject = computed(() => {
  return project.value.name && project.value.client && project.value.dueDate && project.value.description
})
</script>
