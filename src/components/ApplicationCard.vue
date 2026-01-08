<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ application.companyName }}</h3>
        <p class="text-sm text-gray-600">{{ application.businessType }}</p>
      </div>
      <StatusBadge :status="application.status" />
    </div>

    <!-- Location -->
    <div class="flex items-center text-sm text-gray-600 mb-3">
      <MapPinIcon class="h-4 w-4 mr-2" />
      {{ application.location }}
    </div>

    <!-- Dates -->
    <div class="space-y-2 mb-4">
      <div class="flex items-center text-sm text-gray-600">
        <CalendarIcon class="h-4 w-4 mr-2" />
        <span class="font-medium">Applied:</span>
        <span class="ml-1">{{ formatDate(application.appliedDate) }}</span>
      </div>
      
      <div v-if="application.interviewDate" class="flex items-center text-sm">
        <ClockIcon class="h-4 w-4 mr-2" />
        <span class="font-medium">Interview:</span>
        <span class="ml-1" :class="getInterviewDateClass()">
          {{ formatDate(application.interviewDate) }}
        </span>
        <span v-if="isUpcoming" class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <BellIcon class="h-3 w-3 mr-1" />
          Upcoming
        </span>
      </div>
    </div>

    <!-- Note -->
    <div v-if="application.note" class="mb-4">
      <p class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
        {{ application.note }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-2 pt-4 border-t border-gray-100">
      <button
        @click="$emit('edit', application)"
        class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
      >
        <PencilIcon class="h-4 w-4 mr-1" />
        Edit
      </button>
      <button
        @click="$emit('delete', application.id)"
        class="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
      >
        <TrashIcon class="h-4 w-4 mr-1" />
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon, 
  PencilIcon, 
  TrashIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import StatusBadge from './StatusBadge.vue'

export default {
  name: 'ApplicationCard',
  components: {
    StatusBadge,
    MapPinIcon,
    CalendarIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon,
    BellIcon
  },
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props) {
    // Check if interview is upcoming (within 7 days)
    const isUpcoming = computed(() => {
      if (!props.application.interviewDate || props.application.status !== 'interview') {
        return false
      }
      
      const now = new Date()
      const interviewDate = new Date(props.application.interviewDate)
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      return interviewDate >= now && interviewDate <= sevenDaysFromNow
    })

    const formatDate = (dateString) => {
      if (!dateString) return 'Not set'
      
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getInterviewDateClass = () => {
      if (!props.application.interviewDate) return 'text-gray-600'
      
      if (isUpcoming.value) {
        return 'text-orange-600 font-medium'
      }
      
      return 'text-gray-600'
    }

    return {
      isUpcoming,
      formatDate,
      getInterviewDateClass
    }
  }
}
</script>