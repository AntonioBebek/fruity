import { defineStore } from 'pinia'

const STORAGE_KEY = 'fruity.localFruits'

export const useLocalFruitsStore = defineStore('localFruits', {
  state: () => ({
    fruits: []
  }),

  actions: {
    // Load fruits from localStorage
    load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        this.fruits = stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error('Error loading local fruits:', error)
        this.fruits = []
      }
    },

    // Save fruits to localStorage
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.fruits))
      } catch (error) {
        console.error('Error saving local fruits:', error)
      }
    },

    // Add new fruit
    add(fruit) {
      const newFruit = {
        id: `local_${Date.now()}`, // Generate unique ID
        name: fruit.name,
        family: fruit.family,
        genus: fruit.genus || '',
        order: fruit.order || '',
        nutritions: fruit.nutritions || {}
      }
      this.fruits.push(newFruit)
      this.persist()
      return newFruit
    },

    // Update existing fruit
    update(id, fruit) {
      const index = this.fruits.findIndex(f => f.id === id)
      if (index !== -1) {
        this.fruits[index] = {
          ...this.fruits[index],
          name: fruit.name,
          family: fruit.family,
          genus: fruit.genus || '',
          order: fruit.order || '',
          nutritions: fruit.nutritions || {}
        }
        this.persist()
        return this.fruits[index]
      }
      return null
    },

    // Remove fruit
    remove(id) {
      const index = this.fruits.findIndex(f => f.id === id)
      if (index !== -1) {
        this.fruits.splice(index, 1)
        this.persist()
        return true
      }
      return false
    },

    // Get fruit by ID
    getById(id) {
      return this.fruits.find(f => f.id === id)
    },

    // Get all unique families from local fruits
    getFamilies() {
      const families = this.fruits.map(fruit => fruit.family).filter(Boolean)
      return [...new Set(families)].sort()
    }
  }
})
