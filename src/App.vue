<template>
    <div class="todoApp">
        <div class="dragBox"></div>
        <el-tabs v-model="Active" type="card">
            <el-tab-pane name="ToDo" label="ToDo">
                <undo />
            </el-tab-pane>
            <el-tab-pane name="Done" label="Done">
                <done />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { ElTabs, ElTabPane } from 'element-plus'
import undo from './views/undo.vue'
import done from './views/done.vue'
import { ref } from 'vue'
const Active = ref('ToDo')
</script>

<style scoped lang="less">
.todoApp {
    --el-border-color-light: transparent;
    --el-bg-color: transparent;
    --el-color-primary: #fff;
    --el-font-size-base: 18px;
    --el-text-color-primary: rgba(255, 255, 255, 0.5);
    box-shadow: 6px 6px 2px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19);
    transition: 0.2s;
    background: rgba(0, 0, 0, 0.1);
    position: relative;
    height: 100%;
    border-radius: 4px;
    padding: 4px 0;
    &:hover {
        background: rgba(0, 0, 0, 0.2);
    }
    :deep(.el-tabs) {
        height: calc(100%);
        .el-tabs__content {
            height: 100%;
            .el-tab-pane {
                height: 100%;
            }
            .el-empty {
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
                margin: auto;
            }
        }
        .el-tabs__item {
            position: relative;
            z-index: 100;
            .el-tab-pane {
                height: 100%;
            }
        }
    }
    .dragBox {
        -webkit-app-region: drag;
        position: absolute;
        height: 41px;
        background: rgba(0, 0, 0, 0.4);
        width: calc(100% - 172px);
        right: 0;
        z-index: -1;
    }
}
</style>
