<template>
    <div class="parent">
        父级组件：
        {{ name }}--{{ props.objInfo.age }}
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps(['objInfo'])

const { name } = toRefs(props.objInfo)
</script>

<style scoped lang="less"></style>
