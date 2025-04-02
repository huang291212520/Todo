<template>
    <div class="undo-panel">
        <div class="undo-item" v-for="(item, index) in toDoList">
            <div class="label">
                <el-input v-model="item.text" ref="inputsRefs" @keydown.enter="editEnd(item.id, item.text)" />
            </div>
            <div class="opera">
                <el-icon class="success" @click="finishTodo(item.id)"><Check /></el-icon>
                <el-icon class="edit" @click="toEdit(index)"><Edit /></el-icon>
                <el-icon class="top" :class="{ disabled: item.isTop }" @click="setToDoTop(item.id)">
                    <Top />
                </el-icon>
                <el-icon class="close" @click="deleteToDo(item.id)"><Close /></el-icon>
            </div>
        </div>
        <el-empty :image-size="100" v-if="!toDoList.length" description="没有待办信息" />
        <div class="add-panel">
            <el-input v-model="addValue" @keydown.enter="addToDoFun" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Close, Edit, Check, Top } from '@element-plus/icons-vue'
import { ref } from 'vue'
import useToDo from '../compositonApi/useToDo'
const { toDoList, addToDo, deleteToDo, setToDoTop, editToDo, finishTodo } = useToDo()

const addValue = ref('')
const addToDoFun = () => {
    if (addValue.value) {
        addToDo(addValue.value)
        addValue.value = ''
    }
}

const inputsRefs = ref([])
const toEdit = (index: number) => {
    inputsRefs.value[index].focus()
}
const editEnd = (id: string, text: string) => {
    const index = toDoList.value.findIndex((item) => item.id === id)
    editToDo(id, text)
    inputsRefs.value[index].blur()
}
</script>

<style lang="less" scoped>
.undo-panel {
    --el-text-color-regular: #fff;
    --el-fill-color-blank: transparent;
    --el-border-color: transparent;
    --el-color-primary: transparent;
    --el-border-color-hover: transparent;
    --el-font-size-base: 14px;
    max-height: calc(100vh - 40px - 15px - 1px);
    overflow-y: scroll;
    .undo-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        padding: 8px;
        .label {
            flex: 1;
            :deep(.el-input) {
                .el-input__wrapper {
                    background: rgba(0, 0, 0, 0.4);
                }
            }
        }
        .opera {
            display: flex;
            align-items: center;
            .el-icon {
                padding: 4px;
                border-radius: 50%;
                margin-left: 6px;
                cursor: pointer;
                &.success {
                    background: #67c23a;
                }
                &.top {
                    background: #409eff;
                    &.disabled {
                        background: #606266;
                    }
                }
                &.edit {
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
