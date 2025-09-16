<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-8 text-center" elevation="8">
          <v-card-title class="text-h3 mb-4 text-primary">
            🍎 Dobrodošli u Voćko
          </v-card-title>
          
          <v-card-text class="text-h6 mb-6">
            Otkrijte nevjerojatan svijet voća! Pregledajte našu sveobuhvatnu 
            kolekciju voća s detaljnim nutritivnim informacijama.
          </v-card-text>
          
          <v-divider class="my-6" />
          
          <!-- Technology Info -->
          <v-card-text class="text-body-2 text-medium-emphasis">
            <p class="mb-2">
              <strong>Tehnologije:</strong> Vue 3, Vuetify 3, Pinia, Vue Router
            </p>
            <p class="mb-0">
              <strong>Podaci:</strong> 
              <a 
                href="https://www.fruityvice.com/" 
                target="_blank" 
                class="text-primary text-decoration-none"
              >
                Fruityvice API
              </a>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
