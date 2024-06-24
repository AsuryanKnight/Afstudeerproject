<template>
  <div>
    <Header />
    <div class="container mx-auto mt-4">
      <ProjectBlock title="Algemene info" :initiallyOpen="true">
        <div class="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-md">
          <div>
            <label><strong>Projectnaam <span class="text-red-500">*</span>:</strong></label>
            <input v-model="project.name" class="border p-2 rounded w-full" />
          </div>
          <div>
            <label><strong>Klant <span class="text-red-500">*</span>:</strong></label>
            <input v-model="project.client" class="border p-2 rounded w-full" />
          </div>
          <div>
            <label><strong>Projectgroep:</strong></label>
            <input v-model="project.group" class="border p-2 rounded w-full" />
          </div>
          <div>
            <label><strong>Geplande opleverdatum <span class="text-red-500">*</span>:</strong></label>
            <input type="date" v-model="project.dueDate" class="border p-2 rounded w-full" />
          </div>
        </div>
        <div class="mt-4 bg-gray-100 p-4 rounded-md">
          <label><h3 class="font-bold">Briefing/Projectbeschrijving <span class="text-red-500">*</span>:</h3></label>
          <textarea v-model="project.description" class="border p-2 rounded w-full"></textarea>
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
                    @click="confirmRemoveMember(member)"
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >x</button>
                </div>
                <button 
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
                    @click="confirmRemoveMember(member)"
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >x</button>
                </div>
                <button 
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
                    @click="confirmRemoveMember(member)"
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >x</button>
                </div>
                <button 
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
    <li v-for="(material, index) in project.materials" :key="material.name" class="flex justify-between items-center mb-2">
      <div>
        <strong>{{ material.name }}:</strong> 
        <a :href="material.reference" target="_blank" class="ml-2 text-blue-500">{{ material.reference }}</a>
      </div>
      <button @click="confirmRemoveMaterial(index)" class="bg-red-500 text-white px-3 py-1 rounded">Verwijderen</button>
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
          <p><strong>Platform:</strong> {{ platform.name }}</p>
          <p><strong>Type:</strong> {{ platform.type }}</p>
          <p><strong>Formaten:</strong></p>
          <ul>
            <li v-for="format in platform.formats" :key="format">{{ format }}</li>
          </ul>
          <div class="mt-2 flex space-x-2">
            <button @click="openEditPlatformForm(index)" class="bg-yellow-500 text-white px-4 py-2 rounded">Bewerken</button>
            <button @click="confirmRemovePlatform(index)" class="bg-red-500 text-white px-4 py-2 rounded">Verwijderen</button>
          </div>
        </div>
        <button @click="openAddPlatformForm" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Technische details toevoegen</button>
      </ProjectBlock>

      <div class="mt-4 flex justify-end space-x-2">
        <button @click="createTask" :disabled="!isFormValid" :class="['bg-green-500 text-white px-4 py-2 rounded', { 'opacity-50': !isFormValid }]">Taak aanmaken</button>
        <button @click="cancel" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
      </div>
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

    <!-- Remove Material Confirmation Modal -->
    <div v-if="showRemoveMaterialConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-4 rounded shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Bevestiging</h2>
        <p>Weet je zeker dat je dit materiaal wilt verwijderen?</p>
        <div class="flex justify-end mt-4">
          <button @click="removeMaterial" class="bg-red-500 text-white px-4 py-2 rounded mr-2">Ja</button>
          <button @click="closeRemoveMaterialConfirm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
        </div>
      </div>
    </div>

    <!-- Remove Platform Confirmation Modal -->
    <div v-if="showRemovePlatformConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-4 rounded shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Bevestiging</h2>
        <p>Weet je zeker dat je dit platform wilt verwijderen?</p>
        <div class="flex justify-end mt-4">
          <button @click="removePlatform" class="bg-red-500 text-white px-4 py-2 rounded mr-2">Ja</button>
          <button @click="closeRemovePlatformConfirm" class="bg-gray-500 text-white px-4 py-2 rounded">Annuleren</button>
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

const showAddMemberFormVisible = ref(false)
const addMemberRole = ref('')
const searchQuery = ref('')
const availableProfiles = ref([])

const showMaterialForm = ref(false)
const newMaterialName = ref('')
const newMaterialLink = ref('')

const showAddPlatformForm = ref(false)
const showEditPlatformForm = ref(false)
const selectedPlatform = ref('')
const selectedFormats = ref([])
const availablePlatforms = ref([])
const platformIndexToEdit = ref(null)

const showRemoveMemberConfirm = ref(false)
const memberToRemove = ref(null)

const showRemoveMaterialConfirm = ref(false)
const materialIndexToRemove = ref(null)

const showRemovePlatformConfirm = ref(false)
const platformIndexToRemove = ref(null)

onMounted(async () => {
  try {
    const profilesResponse = await axios.get('http://localhost:4000/profiles')
    availableProfiles.value = profilesResponse.data

    const platformsResponse = await axios.get('http://localhost:4000/platforms')
    availablePlatforms.value = platformsResponse.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

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

const addMember = (profile) => {
  project.value.members.push({ ...profile, role: addMemberRole.value })
  closeAddMemberForm()
}

const confirmRemoveMember = (member) => {
  memberToRemove.value = member
  showRemoveMemberConfirm.value = true
}

const removeMember = () => {
  project.value.members = project.value.members.filter(member => member !== memberToRemove.value)
  closeRemoveMemberConfirm()
}

const closeRemoveMemberConfirm = () => {
  showRemoveMemberConfirm.value = false
  memberToRemove.value = null
}

const addMaterial = () => {
  project.value.materials.push({ name: newMaterialName.value, reference: newMaterialLink.value })
  newMaterialName.value = ''
  newMaterialLink.value = ''
  showMaterialForm.value = false
}

const confirmRemoveMaterial = (index) => {
  materialIndexToRemove.value = index
  showRemoveMaterialConfirm.value = true
}

const removeMaterial = () => {
  project.value.materials.splice(materialIndexToRemove.value, 1)
  closeRemoveMaterialConfirm()
}

const closeRemoveMaterialConfirm = () => {
  showRemoveMaterialConfirm.value = false
  materialIndexToRemove.value = null
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

const addPlatform = () => {
  const newPlatform = {
    name: selectedPlatform.value.name,
    type: selectedPlatform.value.type,
    formats: selectedFormats.value
  }

  project.value.platforms.push(newPlatform)

  selectedPlatform.value = ''
  selectedFormats.value = []
  showAddPlatformForm.value = false
}

const savePlatformChanges = () => {
  const updatedPlatform = {
    ...selectedPlatform.value,
    formats: selectedFormats.value
  }

  project.value.platforms.splice(platformIndexToEdit.value, 1, updatedPlatform)

  closeEditPlatformForm()
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

const createTask = async () => {
  try {
    const response = await axios.post('http://localhost:4000/projects', project.value)
    router.push(`/projects/${response.data.id}`)
  } catch (error) {
    console.error('Error creating project:', error)
  }
}

const cancel = () => {
  router.push('/projects')
}

const isFormValid = computed(() => {
  return project.value.name && project.value.client && project.value.dueDate && project.value.description
})
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
