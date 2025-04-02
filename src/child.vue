<template>
    <div class="parent">
        <p>子级组件：{{ props.objInfo.name }}--{{ age }}</p>

        <hr />
        <p>{{ props.objInfo.age + 10 }}</p>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps({ objInfo: { type: Object, required: false } })

const { age } = toRefs(props.objInfo)
</script>

<style scoped lang="less"></style>
