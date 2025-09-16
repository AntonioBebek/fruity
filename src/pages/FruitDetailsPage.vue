<template>
  <v-container>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-body-1">Učitavanje detalja voća...</p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ error }}
    </v-alert>

    <!-- Fruit Not Found -->
    <v-card v-else-if="!fruit" class="text-center pa-8" elevation="2">
      <v-icon size="64" color="grey">mdi-fruit-apple</v-icon>
      <h3 class="text-h5 mt-4 mb-2">Voće nije pronađeno</h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        Voće "{{ name }}" nije moglo biti pronađeno.
      </p>
      <v-btn color="primary" @click="goBack">
        <v-icon left>mdi-arrow-left</v-icon>
        Natrag
      </v-btn>
    </v-card>

    <!-- Fruit Details -->
    <div v-else>
      <!-- Back Button -->
      <v-btn
        color="primary"
        variant="text"
        @click="goBack"
        class="mb-4"
      >
        <v-icon left>mdi-arrow-left</v-icon>
        Natrag
      </v-btn>

      <!-- Fruit Header -->
      <v-card class="mb-6" elevation="2">
        <v-card-title class="text-h3 text-primary">
          {{ fruit.name }}
        </v-card-title>
        <v-card-subtitle class="text-h6">
          {{ fruit.family }}
        </v-card-subtitle>
      </v-card>

      <!-- Fruit Information Grid -->
      <v-row>
        <!-- Basic Information -->
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="text-h5">
              <v-icon left>mdi-information</v-icon>
              Osnovne informacije
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Naziv</v-list-item-title>
                  <v-list-item-subtitle>{{ fruit.name }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Porodica</v-list-item-title>
                  <v-list-item-subtitle>{{ fruit.family }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="fruit.genus">
                  <v-list-item-title>Rod</v-list-item-title>
                  <v-list-item-subtitle>{{ fruit.genus }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="fruit.order">
                  <v-list-item-title>Red</v-list-item-title>
                  <v-list-item-subtitle>{{ fruit.order }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="fruit.id">
                  <v-list-item-title>Izvor</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip
                      :color="(typeof fruit.id === 'string' && fruit.id.startsWith('local_')) ? 'orange' : 'green'"
                      size="small"
                      variant="tonal"
                    >
                      {{ (typeof fruit.id === 'string' && fruit.id.startsWith('local_')) ? 'Lokalno' : 'API' }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Nutritional Information -->
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="text-h5">
              <v-icon left>mdi-chart-line</v-icon>
              Nutritivne informacije
            </v-card-title>
            <v-card-text>
              <div v-if="fruit.nutritions && Object.keys(fruit.nutritions).length > 0">
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    v-if="fruit.nutritions.calories"
                    color="orange"
                    variant="tonal"
                    size="large"
                  >
                    <v-icon left>mdi-fire</v-icon>
                    {{ fruit.nutritions.calories }} kal
                  </v-chip>
                  <v-chip
                    v-if="fruit.nutritions.fat"
                    color="red"
                    variant="tonal"
                    size="large"
                  >
                    <v-icon left>mdi-oil</v-icon>
                    {{ fruit.nutritions.fat }}g masti
                  </v-chip>
                  <v-chip
                    v-if="fruit.nutritions.sugar"
                    color="green"
                    variant="tonal"
                    size="large"
                  >
                    <v-icon left>mdi-candy</v-icon>
                    {{ fruit.nutritions.sugar }}g šećera
                  </v-chip>
                  <v-chip
                    v-if="fruit.nutritions.carbohydrates"
                    color="blue"
                    variant="tonal"
                    size="large"
                  >
                    <v-icon left>mdi-grain</v-icon>
                    {{ fruit.nutritions.carbohydrates }}g ugljikohidrata
                  </v-chip>
                  <v-chip
                    v-if="fruit.nutritions.protein"
                    color="purple"
                    variant="tonal"
                    size="large"
                  >
                    <v-icon left>mdi-dumbbell</v-icon>
                    {{ fruit.nutritions.protein }}g proteina
                  </v-chip>
                </div>
              </div>
              <div v-else class="text-body-2 text-medium-emphasis">
                Nema dostupnih nutritivnih informacija
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Actions for Local Fruits -->
      <v-card v-if="fruit.id && typeof fruit.id === 'string' && fruit.id.startsWith('local_')" class="mt-6" elevation="2">
        <v-card-title class="text-h5">
          <v-icon left>mdi-cog</v-icon>
          Akcije
        </v-card-title>
        <v-card-text>
          <v-btn
            color="primary"
            variant="elevated"
            @click="editFruit"
            class="mr-4"
          >
            <v-icon left>mdi-pencil</v-icon>
            Uredi voće
          </v-btn>
          <v-btn
            color="error"
            variant="outlined"
            @click="deleteFruit"
          >
            <v-icon left>mdi-delete</v-icon>
            Obriši voće
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialogOpen" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Uredi voće</v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Naziv Voća"
                  :rules="[v => !!v || 'Naziv je obavezan']"
                  variant="outlined"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.family"
                  label="Porodica"
                  :rules="[v => !!v || 'Porodica je obavezna']"
                  variant="outlined"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.genus"
                  label="Rod (opcionalno)"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.order"
                  label="Red (opcionalno)"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            
            <v-divider class="my-4" />
            <h4 class="text-h6 mb-3">Nutritivne informacije (opcionalno)</h4>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.nutritions.calories"
                  label="Kalorije"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.nutritions.fat"
                  label="Masti (g)"
                  type="number"
                  step="0.1"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.nutritions.sugar"
                  label="Šećer (g)"
                  type="number"
                  step="0.1"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.nutritions.carbohydrates"
                  label="Ugljikohidrati (g)"
                  type="number"
                  step="0.1"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.nutritions.protein"
                  label="Proteini (g)"
                  type="number"
                  step="0.1"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="closeEditDialog"
          >
            Odustani
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!formValid"
            @click="saveFruit"
          >
            Ažuriraj
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialogOpen" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Potvrdi brisanje</v-card-title>
        <v-card-text>
          Jeste li sigurni da želite obrisati "{{ fruit?.name }}"? Ova akcija se ne može poništiti.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="deleteDialogOpen = false"
          >
            Odustani
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="confirmDelete"
          >
            Obriši
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFruitsStore } from '../stores/fruits.js'
import { useLocalFruitsStore } from '../stores/localFruits.js'
import Swal from 'sweetalert2'

export default {
  name: 'FruitDetailsPage',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const fruitsStore = useFruitsStore()
    const localFruitsStore = useLocalFruitsStore()
    // SweetAlert2 functions
    const showSuccess = (message) => {
      Swal.fire({
        icon: 'success',
        title: 'Uspjeh!',
        text: message,
        timer: 3000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
      })
    }
    
    const showError = (message) => {
      Swal.fire({
        icon: 'error',
        title: 'Greška!',
        text: message,
        confirmButtonText: 'U redu',
        position: 'top-end',
        toast: true
      })
    }
    
    // Reactive data
    const loading = ref(false)
    const error = ref(null)
    const editDialogOpen = ref(false)
    const deleteDialogOpen = ref(false)
    const formValid = ref(false)
    const formRef = ref(null)
    
    // Form data
    const form = ref({
      name: '',
      family: '',
      genus: '',
      order: '',
      nutritions: {
        calories: null,
        fat: null,
        sugar: null,
        carbohydrates: null,
        protein: null
      }
    })
    
    // Computed
    const fruit = computed(() => {
      // First check local fruits
      const localFruit = localFruitsStore.fruits.find(f => 
        f.name.toLowerCase() === props.name.toLowerCase()
      )
      if (localFruit) return localFruit
      
      // Then check API fruits
      const apiFruit = fruitsStore.all.find(f => 
        f.name.toLowerCase() === props.name.toLowerCase()
      )
      return apiFruit
    })
    
    // Methods
    const goBack = () => {
      router.push('/fruits')
    }
    
    const editFruit = () => {
      if (!fruit.value) return
      
      form.value = {
        name: fruit.value.name,
        family: fruit.value.family,
        genus: fruit.value.genus || '',
        order: fruit.value.order || '',
        nutritions: { ...fruit.value.nutritions }
      }
      editDialogOpen.value = true
    }
    
    const closeEditDialog = () => {
      editDialogOpen.value = false
      if (formRef.value) {
        formRef.value.resetValidation()
      }
    }
    
    const saveFruit = async () => {
      if (!formValid.value || !fruit.value) return
      
      try {
        localFruitsStore.update(fruit.value.id, form.value)
        showSuccess('Voće je uspješno ažurirano!')
        closeEditDialog()
      } catch (error) {
        showError('Greška pri ažuriranju voća: ' + error.message)
      }
    }
    
    const deleteFruit = () => {
      deleteDialogOpen.value = true
    }
    
    const confirmDelete = () => {
      if (!fruit.value) return
      
      try {
        localFruitsStore.remove(fruit.value.id)
        showSuccess('Voće je uspješno obrisano!')
        deleteDialogOpen.value = false
        goBack()
      } catch (error) {
        showError('Greška pri brisanju voća: ' + error.message)
      }
    }
    
    // Initialize
    onMounted(async () => {
      // Load local fruits
      localFruitsStore.load()
      
      // If fruit not found in cache, try to fetch from API
      if (!fruit.value) {
        loading.value = true
        try {
          await fruitsStore.fetchAll()
        } catch (err) {
          error.value = err.message
        } finally {
          loading.value = false
        }
      }
    })
    
    return {
      // Reactive data
      loading,
      error,
      editDialogOpen,
      deleteDialogOpen,
      formValid,
      formRef,
      form,
      
      // Computed
      fruit,
      
      // Methods
      goBack,
      editFruit,
      closeEditDialog,
      saveFruit,
      deleteFruit,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
