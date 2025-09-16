<template>
  <v-app-bar
    color="primary"
    density="comfortable"
    elevation="1"
  >
    <v-app-bar-title class="d-flex align-center">
      <v-icon class="mr-2" size="large">🍎</v-icon>
      <span class="text-h5 font-weight-bold">Voćko</span>
    </v-app-bar-title>
    
    <v-spacer />
    
    <v-btn
      v-if="showFruitsButton"
      color="white"
      variant="elevated"
      @click="goToFruits"
      class="mr-2"
    >
      <v-icon left>mdi-fruit-apple</v-icon>
      Istraži
    </v-btn>
    
    <v-btn
      v-if="showHomeButton"
      color="white"
      variant="outlined"
      @click="goHome"
    >
      <v-icon left>mdi-home</v-icon>
      Početna
    </v-btn>
  </v-app-bar>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  props: {
    showFruitsButton: {
      type: Boolean,
      default: false
    },
    showHomeButton: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter()
    
    const goToFruits = () => {
      router.push('/fruits')
    }
    
    const goHome = () => {
      router.push('/')
    }
    
    return {
      goToFruits,
      goHome
    }
  }
}
</script>
