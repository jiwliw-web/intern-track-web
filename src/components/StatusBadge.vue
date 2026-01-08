<template>
  <span :class="badgeClasses" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
    <component :is="statusIcon" class="h-3 w-3 mr-1" />
    {{ statusText }}
  </span>
</template>

<script>
import { computed } from 'vue'
import { 
  ClockIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from '@heroicons/vue/24/solid'

export default {
  name: 'StatusBadge',
  components: {
    ClockIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon
  },
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['applied', 'interview', 'accepted', 'rejected'].includes(value)
    }
  },
  setup(props) {
    const statusConfig = {
      applied: {
        text: 'ส่งใบสมัครแล้ว',
        classes: 'bg-blue-100 text-blue-800',
        icon: 'ClockIcon'
      },
      interview: {
        text: 'สัมภาษณ์',
        classes: 'bg-yellow-100 text-yellow-800',
        icon: 'CalendarIcon'
      },
      accepted: {
        text: 'ได้รับการตอบรับ',
        classes: 'bg-green-100 text-green-800',
        icon: 'CheckCircleIcon'
      },
      rejected: {
        text: 'ถูกปฏิเสธ',
        classes: 'bg-red-100 text-red-800',
        icon: 'XCircleIcon'
      }
    }

    const badgeClasses = computed(() => statusConfig[props.status]?.classes || 'bg-gray-100 text-gray-800')
    const statusText = computed(() => statusConfig[props.status]?.text || props.status)
    const statusIcon = computed(() => statusConfig[props.status]?.icon || 'ClockIcon')

    return {
      badgeClasses,
      statusText,
      statusIcon
    }
  }
}
</script>