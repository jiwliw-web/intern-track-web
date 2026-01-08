<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center">
      <div :class="iconClasses" class="flex-shrink-0">
        <component :is="iconComponent" class="h-6 w-6" />
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 truncate">{{ title }}</dt>
          <dd class="text-2xl font-semibold text-gray-900">{{ value }}</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from '@heroicons/vue/24/outline'

export default {
  name: 'StatCard',
  components: {
    BriefcaseIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'blue',
      validator: (value) => ['blue', 'yellow', 'green', 'orange', 'red'].includes(value)
    }
  },
  setup(props) {
    const colorClasses = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    }

    const iconClasses = computed(() => {
      return `${colorClasses[props.color]} rounded-md p-3 text-white`
    })

    const iconComponent = computed(() => {
      const iconMap = {
        BriefcaseIcon: 'BriefcaseIcon',
        CalendarIcon: 'CalendarIcon',
        CheckCircleIcon: 'CheckCircleIcon',
        ClockIcon: 'ClockIcon'
      }
      return iconMap[props.icon] || 'BriefcaseIcon'
    })

    return {
      iconClasses,
      iconComponent
    }
  }
}
</script>