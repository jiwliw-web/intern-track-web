<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'Edit Application' : 'Add New Application' }}
        </h3>
        <button
          @click="$emit('cancel')"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Company Name -->
        <div>
          <label for="companyName" class="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            id="companyName"
            v-model="form.companyName"
            type="text"
            required
            class="input-field"
            placeholder="Enter company name"
          />
        </div>

        <!-- Business Type -->
        <div>
          <label for="businessType" class="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <input
            id="businessType"
            v-model="form.businessType"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Technology, Finance, Healthcare"
          />
        </div>

        <!-- Location -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            required
            class="input-field"
            placeholder="e.g., San Francisco, CA or Remote"
          />
        </div>

        <!-- Dates Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Applied Date -->
          <div>
            <label for="appliedDate" class="block text-sm font-medium text-gray-700 mb-2">
              Applied Date *
            </label>
            <input
              id="appliedDate"
              v-model="form.appliedDate"
              type="date"
              required
              class="input-field"
            />
          </div>

          <!-- Interview Date -->
          <div>
            <label for="interviewDate" class="block text-sm font-medium text-gray-700 mb-2">
              Interview Date
            </label>
            <input
              id="interviewDate"
              v-model="form.interviewDate"
              type="date"
              class="input-field"
            />
          </div>
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            id="status"
            v-model="form.status"
            required
            class="input-field"
          >
            <option value="">Select status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <!-- Interview Reminder -->
        <div v-if="form.status === 'interview' && form.interviewDate" class="flex items-center">
          <input
            id="reminderEnabled"
            v-model="form.reminderEnabled"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="reminderEnabled" class="ml-2 block text-sm text-gray-700">
            Enable interview reminder
          </label>
        </div>

        <!-- Note -->
        <div>
          <label for="note" class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="note"
            v-model="form.note"
            rows="3"
            class="input-field resize-none"
            placeholder="Add any additional notes about this application..."
          ></textarea>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('cancel')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="!isFormValid"
          >
            {{ isEditing ? 'Update Application' : 'Add Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ApplicationForm',
  components: {
    XMarkIcon
  },
  props: {
    application: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    // Form data
    const form = ref({
      companyName: '',
      businessType: '',
      location: '',
      appliedDate: '',
      interviewDate: '',
      status: '',
      reminderEnabled: false,
      note: ''
    })

    // Computed properties
    const isEditing = computed(() => !!props.application)
    
    const isFormValid = computed(() => {
      return form.value.companyName.trim() &&
             form.value.businessType.trim() &&
             form.value.location.trim() &&
             form.value.appliedDate &&
             form.value.status
    })

    // Initialize form with existing data if editing
    const initializeForm = () => {
      if (props.application) {
        form.value = {
          companyName: props.application.companyName || '',
          businessType: props.application.businessType || '',
          location: props.application.location || '',
          appliedDate: props.application.appliedDate || '',
          interviewDate: props.application.interviewDate || '',
          status: props.application.status || '',
          reminderEnabled: props.application.reminderEnabled || false,
          note: props.application.note || ''
        }
      } else {
        // Set default applied date to today for new applications
        const today = new Date().toISOString().split('T')[0]
        form.value.appliedDate = today
      }
    }

    // Watch for status changes to handle interview reminder visibility
    watch(() => form.value.status, (newStatus) => {
      if (newStatus !== 'interview') {
        form.value.reminderEnabled = false
      }
    })

    // Handle form submission
    const handleSubmit = () => {
      if (!isFormValid.value) return

      // Create clean form data
      const formData = {
        companyName: form.value.companyName.trim(),
        businessType: form.value.businessType.trim(),
        location: form.value.location.trim(),
        appliedDate: form.value.appliedDate,
        interviewDate: form.value.interviewDate || null,
        status: form.value.status,
        reminderEnabled: form.value.reminderEnabled,
        note: form.value.note.trim()
      }

      emit('save', formData)
    }

    // Initialize form on mount
    onMounted(() => {
      initializeForm()
    })

    return {
      form,
      isEditing,
      isFormValid,
      handleSubmit
    }
  }
}
</script>