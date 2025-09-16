import { defineStore } from 'pinia'
import api from '../api/axios.js'
import { uniq } from 'lodash-es'

export const useFruitsStore = defineStore('fruits', {
  state: () => ({
    all: [], // All fruits from API
    loading: false,
    error: null
  }),

  getters: {
    // Get unique families from API fruits
    families: (state) => {
      if (!Array.isArray(state.all)) {
        return []
      }
      const families = state.all.map(fruit => fruit.family).filter(Boolean)
      return uniq(families).sort()
    }
  },

  actions: {
    // Fetch all fruits from API (cache after first load)
    async fetchAll() {
      if (this.all.length > 0) {
        return // Already cached
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.get('/fruit/all')
        this.all = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Get fruit by name (from cached data or API)
    async getFruitByName(name) {
      // First check cached data
      const cachedFruit = this.all.find(fruit => 
        fruit.name.toLowerCase() === name.toLowerCase()
      )
      if (cachedFruit) {
        return cachedFruit
      }

      // If not found in cache, fetch from API
      try {
        const response = await api.get(`/fruit/${name}`)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
})
