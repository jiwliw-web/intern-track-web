<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <BriefcaseIcon class="h-8 w-8 text-blue-600 mr-3" />
            <h1 class="text-2xl font-bold text-gray-900">InternTrack</h1>
          </div>
          <button
            @click="showAddForm = true"
            class="btn-primary flex items-center"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            เพิ่มใบสมัคร
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="ใบสมัครทั้งหมด"
          :value="applications.length"
          icon="BriefcaseIcon"
          color="blue"
        />
        <StatCard
          title="สัมภาษณ์"
          :value="interviewCount"
          icon="CalendarIcon"
          color="yellow"
        />
        <StatCard
          title="ได้รับการตอบรับ"
          :value="acceptedCount"
          icon="CheckCircleIcon"
          color="green"
        />
        <StatCard
          title="สัมภาษณ์ที่จะมาถึง"
          :value="upcomingInterviews"
          icon="ClockIcon"
          color="orange"
        />
      </div>

      <!-- Interview Reminders -->
      <InterviewReminders
        v-if="upcomingInterviewApplications.length > 0"
        :applications="upcomingInterviewApplications"
        class="mb-8"
      />

      <!-- Applications List -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">ใบสมัครงาน</h2>
          <div class="flex items-center space-x-4">
            <!-- Filter by status -->
            <select
              v-model="statusFilter"
              class="input-field w-auto"
            >
              <option value="">สถานะทั้งหมด</option>
              <option value="applied">ส่งใบสมัครแล้ว</option>
              <option value="interview">สัมภาษณ์</option>
              <option value="accepted">ได้รับการตอบรับ</option>
              <option value="rejected">ถูกปฏิเสธ</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">กำลังโหลดใบสมัคร...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredApplications.length === 0" class="text-center py-12">
          <BriefcaseIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบใบสมัครงาน</h3>
          <p class="text-gray-500 mb-4">เริ่มต้นด้วยการเพิ่มใบสมัครฝึกงานแรกของคุณ</p>
          <button @click="showAddForm = true" class="btn-primary">
            เพิ่มใบสมัคร
          </button>
        </div>

        <!-- Applications Grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <ApplicationCard
            v-for="application in filteredApplications"
            :key="application.id"
            :application="application"
            @edit="editApplication"
            @delete="deleteApplication"
          />
        </div>
      </div>
    </main>

    <!-- Add/Edit Application Modal -->
    <ApplicationForm
      v-if="showAddForm || editingApplication"
      :application="editingApplication"
      @save="saveApplication"
      @cancel="cancelForm"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { firestoreService } from './services/firebase.js'
import { BriefcaseIcon, PlusIcon, CalendarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'
import ApplicationCard from './components/ApplicationCard.vue'
import ApplicationForm from './components/ApplicationForm.vue'
import StatCard from './components/StatCard.vue'
import InterviewReminders from './components/InterviewReminders.vue'

export default {
  name: 'App',
  components: {
    ApplicationCard,
    ApplicationForm,
    StatCard,
    InterviewReminders,
    BriefcaseIcon,
    PlusIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon
  },
  setup() {
    // Reactive data
    const applications = ref([])
    const loading = ref(true)
    const showAddForm = ref(false)
    const editingApplication = ref(null)
    const statusFilter = ref('')

    // Computed properties
    const filteredApplications = computed(() => {
      if (!statusFilter.value) return applications.value
      return applications.value.filter(app => app.status === statusFilter.value)
    })

    const interviewCount = computed(() => {
      return applications.value.filter(app => app.status === 'interview').length
    })

    const acceptedCount = computed(() => {
      return applications.value.filter(app => app.status === 'accepted').length
    })

    // Get applications with upcoming interviews (within 7 days)
    const upcomingInterviewApplications = computed(() => {
      const now = new Date()
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      return applications.value.filter(app => {
        if (!app.interviewDate || app.status !== 'interview') return false
        
        const interviewDate = new Date(app.interviewDate)
        return interviewDate >= now && interviewDate <= sevenDaysFromNow
      })
    })

    const upcomingInterviews = computed(() => upcomingInterviewApplications.value.length)

    // Methods
    const loadApplications = async () => {
      try {
        loading.value = true
        applications.value = await firestoreService.getApplications()
      } catch (error) {
        console.error('Failed to load applications:', error)
      } finally {
        loading.value = false
      }
    }

    const saveApplication = async (applicationData) => {
      try {
        if (editingApplication.value) {
          // Update existing application
          await firestoreService.updateApplication(editingApplication.value.id, applicationData)
        } else {
          // Add new application
          await firestoreService.addApplication(applicationData)
        }
        
        // Reload applications
        await loadApplications()
        cancelForm()
      } catch (error) {
        console.error('Failed to save application:', error)
      }
    }

    const editApplication = (application) => {
      editingApplication.value = application
    }

    const deleteApplication = async (applicationId) => {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบใบสมัครนี้?')) {
        try {
          await firestoreService.deleteApplication(applicationId)
          await loadApplications()
        } catch (error) {
          console.error('Failed to delete application:', error)
        }
      }
    }

    const cancelForm = () => {
      showAddForm.value = false
      editingApplication.value = null
    }

    // Load applications on component mount
    onMounted(() => {
      loadApplications()
    })

    return {
      applications,
      loading,
      showAddForm,
      editingApplication,
      statusFilter,
      filteredApplications,
      interviewCount,
      acceptedCount,
      upcomingInterviews,
      upcomingInterviewApplications,
      saveApplication,
      editApplication,
      deleteApplication,
      cancelForm
    }
  }
}
</script>