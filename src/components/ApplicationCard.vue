<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
    <!-- Header - Fixed height -->
    <div class="flex justify-between items-start mb-4 min-h-[60px]">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{{ application.companyName }}</h3>
        <p class="text-sm text-gray-600 line-clamp-1">{{ application.businessType }}</p>
      </div>
      <StatusBadge :status="application.status" />
    </div>

    <!-- Location - Fixed height -->
    <div class="flex items-center text-sm text-gray-600 mb-3 min-h-[20px]">
      <MapPinIcon class="h-4 w-4 mr-2 flex-shrink-0" />
      <span class="line-clamp-1">{{ application.location }}</span>
    </div>

    <!-- Dates - Fixed height -->
    <div class="space-y-2 mb-4 min-h-[44px]">
      <div class="flex items-center text-sm text-gray-600">
        <CalendarIcon class="h-4 w-4 mr-2 flex-shrink-0" />
        <span class="font-medium">สมัครเมื่อ:</span>
        <span class="ml-1">{{ formatDate(application.appliedDate) }}</span>
      </div>
      
      <div v-if="application.interviewDate" class="flex items-center text-sm">
        <ClockIcon class="h-4 w-4 mr-2 flex-shrink-0" />
        <span class="font-medium">สัมภาษณ์:</span>
        <span class="ml-1" :class="getInterviewDateClass()">
          {{ formatDate(application.interviewDate) }}
        </span>
        <span v-if="isUpcoming" class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <BellIcon class="h-3 w-3 mr-1" />
          ใกล้ถึงแล้ว
        </span>
      </div>
    </div>

    <!-- Note - Flexible height but controlled -->
    <div v-if="application.note" class="mb-4 flex-grow">
      <div class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 h-full">
        <div class="max-h-[120px] overflow-hidden">
          <p v-if="!showFullNote && isNoteLong" class="mb-2">
            {{ truncatedNote }}
          </p>
          <p v-else class="whitespace-pre-wrap">
            {{ application.note }}
          </p>
        </div>
        
        <button
          v-if="isNoteLong"
          @click="showFullNote = !showFullNote"
          class="text-blue-600 hover:text-blue-800 text-xs font-medium mt-2 flex items-center transition-colors duration-200"
        >
          {{ showFullNote ? 'แสดงน้อยลง' : 'อ่านเพิ่มเติม' }}
          <ChevronDownIcon 
            v-if="!showFullNote" 
            class="h-3 w-3 ml-1" 
          />
          <ChevronUpIcon 
            v-else 
            class="h-3 w-3 ml-1" 
          />
        </button>
      </div>
    </div>

    <!-- Spacer for cards without notes -->
    <div v-else class="flex-grow min-h-[60px]"></div>

    <!-- Actions - Fixed height at bottom -->
    <div class="flex justify-end space-x-2 pt-4 border-t border-gray-100 mt-auto min-h-[52px] items-center">
      <button
        @click="$emit('edit', application)"
        class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
      >
        <PencilIcon class="h-4 w-4 mr-1" />
        แก้ไข
      </button>
      <button
        @click="$emit('delete', application.id)"
        class="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
      >
        <TrashIcon class="h-4 w-4 mr-1" />
        ลบ
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon, 
  PencilIcon, 
  TrashIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon
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
    BellIcon,
    ChevronDownIcon,
    ChevronUpIcon
  },
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props) {
    // Note expansion state
    const showFullNote = ref(false)
    const maxNoteLength = 100 // Maximum characters to show before truncating

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

    // Check if note is long enough to truncate
    const isNoteLong = computed(() => {
      return props.application.note && props.application.note.length > maxNoteLength
    })

    // Truncated version of the note
    const truncatedNote = computed(() => {
      if (!props.application.note) return ''
      return props.application.note.substring(0, maxNoteLength) + '...'
    })

    const formatDate = (dateString) => {
      if (!dateString) return 'ไม่ได้กำหนด'
      
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
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
      showFullNote,
      isUpcoming,
      isNoteLong,
      truncatedNote,
      formatDate,
      getInterviewDateClass
    }
  }
}
</script>