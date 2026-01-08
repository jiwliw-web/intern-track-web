<template>
  <div class="bg-orange-50 border border-orange-200 rounded-lg p-6">
    <div class="flex items-center mb-4">
      <BellIcon class="h-6 w-6 text-orange-600 mr-3" />
      <h3 class="text-lg font-semibold text-orange-900">สัมภาษณ์ที่จะมาถึง</h3>
    </div>
    
    <div class="space-y-3">
      <div
        v-for="application in applications"
        :key="application.id"
        class="flex items-center justify-between bg-white rounded-lg p-4 border border-orange-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CalendarIcon class="h-5 w-5 text-orange-600" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ application.companyName }}</p>
            <p class="text-sm text-gray-600">{{ formatInterviewDate(application.interviewDate) }}</p>
          </div>
        </div>
        
        <div class="flex items-center">
          <StatusBadge :status="application.status" />
          <span class="ml-3 text-sm text-orange-700 font-medium">
            {{ getDaysUntilInterview(application.interviewDate) }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="mt-4 text-sm text-orange-700">
      <p class="flex items-center">
        <ClockIcon class="h-4 w-4 mr-2" />
        แสดงการสัมภาษณ์ที่กำหนดไว้ใน 7 วันข้างหน้า
      </p>
    </div>
  </div>
</template>

<script>
import { BellIcon, CalendarIcon, ClockIcon } from '@heroicons/vue/24/outline'
import StatusBadge from './StatusBadge.vue'

export default {
  name: 'InterviewReminders',
  components: {
    BellIcon,
    CalendarIcon,
    ClockIcon,
    StatusBadge
  },
  props: {
    applications: {
      type: Array,
      required: true
    }
  },
  setup() {
    const formatInterviewDate = (dateString) => {
      const date = new Date(dateString)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      // Check if it's today
      if (date.toDateString() === today.toDateString()) {
        return `วันนี้ เวลา ${date.toLocaleTimeString('th-TH', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: false 
        })}`
      }
      
      // Check if it's tomorrow
      if (date.toDateString() === tomorrow.toDateString()) {
        return `พรุ่งนี้ เวลา ${date.toLocaleTimeString('th-TH', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: false 
        })}`
      }
      
      // Otherwise show full date
      return date.toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getDaysUntilInterview = (dateString) => {
      const interviewDate = new Date(dateString)
      const today = new Date()
      const diffTime = interviewDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'วันนี้'
      if (diffDays === 1) return 'พรุ่งนี้'
      if (diffDays > 1) return `ใน ${diffDays} วัน`
      return 'เลยกำหนดแล้ว'
    }

    return {
      formatInterviewDate,
      getDaysUntilInterview
    }
  }
}
</script>