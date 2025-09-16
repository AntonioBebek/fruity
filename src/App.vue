<template>
  <v-app>
    <!-- App Header -->
    <AppHeader 
      :show-fruits-button="showFruitsButton"
      :show-home-button="showHomeButton"
    />


    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  },
  setup() {
    const route = useRoute()
    
    
    // Determine which buttons to show based on current route
    const showFruitsButton = computed(() => {
      return route.name === 'landing'
    })
    
    const showHomeButton = computed(() => {
      return route.name === 'fruits' || route.name === 'fruit-details'
    })
    
    
    return {
      showFruitsButton,
      showHomeButton
    }
  }
}
</script>

<style>
/* Global styles */
.v-application {
  font-family: 'Roboto', sans-serif;
}

/* Smooth transitions */
.v-card {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Custom styles for fruit cards */
.fruit-card {
  transition: transform 0.2s ease-in-out;
}

.fruit-card:hover {
  transform: translateY(-2px);
}

/* Search and filter container */
.search-filter-container {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

/* Pagination styles */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

/* Nutrition chips */
.nutrition-chip {
  margin: 2px;
}

/* Loading skeleton */
.loading-skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* Gap utility */
.gap-2 {
  gap: 8px;
}
</style>