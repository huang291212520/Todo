<template>
    <div class="undo-panel">
        <div class="undo-item" v-for="(item, index) in doneList">
            <div class="label">
                <el-input v-model="item.text" ref="inputsRefs" disabled />
            </div>
            <div class="opera">
                <el-icon class="reTodo" @click="reToDo(item.id)"><RefreshLeft /></el-icon>
                <el-icon class="close" @click="deleteToDo(item.id, 'done')"><Close /></el-icon>
            </div>
        </div>
        <el-empty :image-size="100" v-if="!doneList.length" description="没有已完成的待办" />
        <div class="blank"></div>
    </div>
</template>

<script setup lang="ts">
import { Close, RefreshLeft } from '@element-plus/icons-vue'
import useToDo from '../compositonApi/useToDo'
const { doneList, deleteToDo, reToDo } = useToDo()
</script>

<style lang="less" scoped>
.blank {
    height: 48px;
}
.undo-panel {
    --el-text-color-regular: #fff;
    --el-fill-color-blank: transparent;
    --el-border-color: transparent;
    --el-color-primary: transparent;
    --el-border-color-hover: transparent;
    --el-disabled-bg-color: transparent;
    --el-disabled-border-color: transparent;
    --el-disabled-text-color: #fff;
    --el-font-size-base: 14px;
    max-height: calc(100vh - 40px - 15px - 1px);
    overflow-y: scroll;
    height: 100%;
    .undo-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        padding: 8px;
        .label {
            flex: 1;
        }
        .opera {
            display: flex;
            align-items: center;
            .el-icon {
                padding: 4px;
                border-radius: 50%;
                margin-left: 6px;
                cursor: pointer;
                &.reTodo {
                    background: #e6a23c;
                }
                &.close {
                    background: #f56c6c;
                }
            }
        }
    }
    .add-panel {
        padding: 8px;
    }
}
</style>
