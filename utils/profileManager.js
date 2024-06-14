import axios from 'axios'

let profiles = []
let currentProfile = null

export async function fetchProfiles() {
  try {
    const response = await axios.get('http://localhost:4000/profiles')
    profiles = response.data

    // Controleer of er een profiel in localStorage is
    const storedProfile = localStorage.getItem('currentProfile')
    if (storedProfile) {
      currentProfile = JSON.parse(storedProfile)
    } else {
      currentProfile = profiles[0] || { id: 0, name: 'Default User' } // Fallback profiel
      localStorage.setItem('currentProfile', JSON.stringify(currentProfile))
    }
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}

export function getCurrentProfile() {
  return currentProfile
}

export function setCurrentProfile(profile) {
  currentProfile = profile
  localStorage.setItem('currentProfile', JSON.stringify(profile))
}

export function getProfiles() {
  return profiles
}
