<template>
    <div class="todoApp">
        <SelectcalendarInput v-model="value" />
    </div>
</template>
<script setup>
import SelectcalendarInput from './rili/selectCalendarInput.vue'
import { ref } from 'vue'
const value = ref('')
</script>
