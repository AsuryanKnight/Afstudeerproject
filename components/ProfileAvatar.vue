<template>
    <div class="relative group">
      <div :class="[bgColor, 'w-8 h-8 text-white flex items-center justify-center rounded-full']">
        {{ initials }}
      </div>
      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
        {{ name }} - {{ title }}
      </div>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false
    }
  })
  
  const initials = computed(() => {
    return props.name.split(' ').map(n => n[0]).join('').toUpperCase()
  })
  
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500']
  
  const hashString = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
      hash = hash & hash
    }
    return hash
  }
  
  const bgColor = computed(() => {
    const index = Math.abs(hashString(props.name)) % colors.length
    return colors[index]
  })
  </script>
  