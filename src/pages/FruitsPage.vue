<template>
  <v-container>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <p class="text-body-1 text-medium-emphasis">
          Otkrijte svijet voća! Pregledajte našu bogatu kolekciju s detaljnim nutritivnim informacijama
        </p>
      </v-col>
    </v-row>

    <!-- Search and Filter Controls -->
    <v-row class="mb-6">
      <v-col cols="12" md="5">
        <v-text-field
          v-model="searchQuery"
          label="Pretraži voće po nazivu"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedFamily"
          :items="familyOptions"
          label="Filtriraj po porodici"
          variant="outlined"
          hide-details
        />
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-switch
          v-model="showLocalOnly"
          label="Samo lokalno"
          color="primary"
          hide-details
        />
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center gap-2">
        <v-btn
          v-if="hasActiveFilters"
          color="grey"
          variant="outlined"
          @click="clearFilters"
          size="small"
        >
          <v-icon left>mdi-filter-remove</v-icon>
          Poništi
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="openAddDialog"
          size="small"
        >
          <v-icon left>mdi-plus</v-icon>
          Dodaj
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <div v-if="fruitsStore.loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-body-1">Učitavanje voća...</p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="fruitsStore.error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ fruitsStore.error }}
    </v-alert>

    <!-- No Results -->
    <v-card v-else-if="filteredFruits.length === 0" class="text-center pa-8" elevation="2">
      <v-icon size="64" color="grey">mdi-fruit-apple</v-icon>
      <h3 class="text-h5 mt-4 mb-2">Nije pronađeno voće</h3>
      <p class="text-body-1 text-medium-emphasis">
        Pokušajte prilagoditi kriterije pretraživanja ili filtriranja
      </p>
    </v-card>

    <!-- Fruits Grid -->
    <v-row v-else>
      <v-col
        v-for="fruit in paginatedFruits"
        :key="fruit.id || fruit.name"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <FruitCard
          :fruit="fruit"
          @edit="editFruit"
        />
      </v-col>
    </v-row>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container mt-8">
      <v-btn
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        variant="outlined"
      >
        <v-icon>mdi-chevron-left</v-icon>
        Prethodna
      </v-btn>
      
      <div class="d-flex align-center mx-4">
        <span class="text-body-2 mr-2">Stranica</span>
        <v-select
          :model-value="currentPage"
          :items="pageNumbers"
          @update:model-value="goToPage"
          variant="outlined"
          density="compact"
          hide-details
          style="min-width: 80px;"
        />
        <span class="text-body-2 ml-2">of {{ totalPages }}</span>
      </div>
      
      <v-btn
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        variant="outlined"
      >
        Sljedeća
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialogOpen" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">
          {{ editingFruit ? 'Uredi voće' : 'Dodaj novo voće' }}
        </v-card-title>
        
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
            @click="closeDialog"
          >
            Odustani
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!formValid"
            @click="saveFruit"
          >
            {{ editingFruit ? 'Ažuriraj' : 'Spremi' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFruitsStore } from '../stores/fruits.js'
import { useLocalFruitsStore } from '../stores/localFruits.js'
import FruitCard from '../components/FruitCard.vue'
import Swal from 'sweetalert2'

export default {
  name: 'FruitsPage',
  components: {
    FruitCard
  },
  setup() {
    const route = useRoute()
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
    const searchQuery = ref('')
    const selectedFamily = ref('Sve porodice')
    const showLocalOnly = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(12)
    const dialogOpen = ref(false)
    const editingFruit = ref(null)
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
    
    // Debounced search
    let searchTimeout = null
    watch(searchQuery, (newValue) => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        currentPage.value = 1 // Reset to first page on search
      }, 300)
    })
    
    // Watch family filter
    watch(selectedFamily, () => {
      currentPage.value = 1 // Reset to first page on filter change
    })
    
    // Computed properties
    const allFruits = computed(() => {
      return [...fruitsStore.all, ...localFruitsStore.fruits]
    })
    
    const filteredFruits = computed(() => {
      let filtered = allFruits.value
      
      // Apply local only filter
      if (showLocalOnly.value) {
        filtered = filtered.filter(fruit => 
          fruit.id && typeof fruit.id === 'string' && fruit.id.startsWith('local_')
        )
      }
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(fruit => 
          fruit.name.toLowerCase().includes(query)
        )
      }
      
      // Apply family filter
      if (selectedFamily.value && selectedFamily.value !== 'Sve porodice') {
        filtered = filtered.filter(fruit => 
          fruit.family === selectedFamily.value
        )
      }
      
      return filtered
    })
    
    const totalPages = computed(() => {
      return Math.ceil(filteredFruits.value.length / pageSize.value)
    })
    
    const paginatedFruits = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredFruits.value.slice(start, end)
    })
    
    const familyOptions = computed(() => {
      const apiFamilies = fruitsStore.families
      const localFamilies = localFruitsStore.getFamilies()
      const allFamilies = [...new Set([...apiFamilies, ...localFamilies])].sort()
      return ['Sve porodice', ...allFamilies]
    })
    
    const pageNumbers = computed(() => {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    })
    
    const hasActiveFilters = computed(() => {
      return searchQuery.value !== '' || 
             selectedFamily.value !== 'Sve porodice' || 
             showLocalOnly.value === true
    })
    
    // Methods
    const clearFilters = () => {
      searchQuery.value = ''
      selectedFamily.value = 'Sve porodice'
      showLocalOnly.value = false
      currentPage.value = 1
      // Update URL query parameter
      router.push({ 
        path: '/fruits', 
        query: { page: '1' } 
      })
    }
    
    const goToPage = (page) => {
      currentPage.value = page
      // Update URL query parameter
      router.push({ 
        path: '/fruits', 
        query: { page: page.toString() } 
      })
    }
    
    const openAddDialog = () => {
      editingFruit.value = null
      resetForm()
      dialogOpen.value = true
    }
    
    const editFruit = (fruit) => {
      editingFruit.value = fruit
      form.value = {
        name: fruit.name,
        family: fruit.family,
        genus: fruit.genus || '',
        order: fruit.order || '',
        nutritions: { ...fruit.nutritions }
      }
      dialogOpen.value = true
    }
    
    const closeDialog = () => {
      dialogOpen.value = false
      editingFruit.value = null
      resetForm()
    }
    
    const resetForm = () => {
      form.value = {
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
      }
      if (formRef.value) {
        formRef.value.resetValidation()
      }
    }
    
    const saveFruit = async () => {
      if (!formValid.value) return
      
      try {
        if (editingFruit.value) {
          // Update existing fruit
          localFruitsStore.update(editingFruit.value.id, form.value)
          showSuccess('Voće je uspješno ažurirano!')
        } else {
          // Add new fruit
          localFruitsStore.add(form.value)
          showSuccess('Voće je uspješno dodano!')
        }
        closeDialog()
      } catch (error) {
        showError('Greška pri spremanju voća: ' + error.message)
      }
    }
    
    // Initialize
    onMounted(async () => {
      // Load local fruits
      localFruitsStore.load()
      
      // Fetch API fruits
      try {
        await fruitsStore.fetchAll()
      } catch (error) {
        showError('Neuspješno učitavanje voća: ' + error.message)
      }
      
      // Set initial page from URL query
      if (route.query.page) {
        const page = parseInt(route.query.page)
        if (page > 0 && page <= totalPages.value) {
          currentPage.value = page
        }
      }
    })
    
    return {
      // Stores
      fruitsStore,
      
      // Reactive data
      searchQuery,
      selectedFamily,
      showLocalOnly,
      currentPage,
      dialogOpen,
      editingFruit,
      formValid,
      formRef,
      form,
      
      // Computed
      filteredFruits,
      paginatedFruits,
      totalPages,
      familyOptions,
      pageNumbers,
      hasActiveFilters,
      
      // Methods
      clearFilters,
      goToPage,
      openAddDialog,
      editFruit,
      closeDialog,
      saveFruit
    }
  }
}
</script>

<style scoped>
.search-filter-container {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
</style>
