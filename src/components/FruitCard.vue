<template>
  <v-card 
    class="fruit-card h-100" 
    elevation="2"
    @click="viewDetails"
    style="cursor: pointer;"
  >
    <v-card-title class="text-h6 text-primary">
      {{ fruit.name }}
    </v-card-title>
    
    <v-card-subtitle class="text-body-2 mb-2">
      {{ fruit.family }}
    </v-card-subtitle>
    
    <!-- Nutrition preview -->
    <v-card-text v-if="fruit.nutritions" class="pt-0">
      <div class="d-flex flex-wrap">
        <v-chip
          v-if="fruit.nutritions.calories"
          size="small"
          color="orange"
          variant="outlined"
          class="nutrition-chip"
        >
          {{ fruit.nutritions.calories }} cal
        </v-chip>
        <v-chip
          v-if="fruit.nutritions.sugar"
          size="small"
          color="green"
          variant="outlined"
          class="nutrition-chip"
        >
          {{ fruit.nutritions.sugar }}g sugar
        </v-chip>
        <v-chip
          v-if="fruit.nutritions.protein"
          size="small"
          color="blue"
          variant="outlined"
          class="nutrition-chip"
        >
          {{ fruit.nutritions.protein }}g protein
        </v-chip>
      </div>
    </v-card-text>
    
    <v-card-actions class="justify-end">
      <!-- Edit button for local fruits -->
      <v-btn
        v-if="fruit.id && typeof fruit.id === 'string' && fruit.id.startsWith('local_')"
        color="secondary"
        variant="text"
        @click.stop="editFruit"
        size="small"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'FruitCard',
  props: {
    fruit: {
      type: Object,
      required: true
    }
  },
  emits: ['edit'],
  setup(props, { emit }) {
    const router = useRouter()
    
    const viewDetails = () => {
      router.push(`/fruits/${encodeURIComponent(props.fruit.name)}`)
    }
    
    const editFruit = () => {
      emit('edit', props.fruit)
    }
    
    return {
      viewDetails,
      editFruit
    }
  }
}
</script>

<style scoped>
.fruit-card {
  transition: all 0.2s ease-in-out;
}

.fruit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nutrition-chip {
  margin: 2px;
}
</style>
