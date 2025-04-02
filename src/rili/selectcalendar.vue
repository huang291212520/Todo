<template>
    <div class="selectCalendar">
        <div class="titleBox">
            <div class="time">{{ currentTimeStr }}</div>
            <div class="opera">
                <div class="icon prev" @click="addMonth(-1)"><span><</span></div>
                <div class="icon next" @click="addMonth(1)"><span>></span></div>
            </div>
        </div>
        <calendar :month="currentMonth" :showLastMonthDay="true">
            <template v-slot:day="{ info }">
                <div
                    class="day"
                    @click="selectDay(info)"
                    :class="{
                        select: info.yearMonthDay === selectDayValue
                    }"
                >
                    {{ info.day }}
                </div>
            </template>
        </calendar>
    </div>
</template>

<script>
import Calendar, { formatDate } from '@/rili/calendar.vue'

export default {
    components: { Calendar },
    data() {
        return {
            selectDayValue: null,
            currentMonth: ''
        }
    },
    watch: {
        modelValue: {
            handler(val) {
                this.selectDayValue = val
                this.currentMonth = formatDate(val, 'YYYY-MM')
            },
            immediate: true
        }
    },
    props: {
        modelValue: {
            type: String
        }
    },
    computed: {
        currentTimeStr() {
            let arr = this.currentMonth.split('-')
            return `${arr[0]}年${arr[1]}月`
        }
    },
    methods: {
        addMonth(value) {
            let current = new Date(this.currentMonth)
            current.setMonth(current.getMonth() + value)
            this.currentMonth = formatDate(current, 'YYYY-MM')
        },
        selectDay(info) {
            this.selectDayValue = info.yearMonthDay
            this.$emit('update:modelValue', info.yearMonthDay)
            this.$emit('select', info.yearMonthDay)
        }
    }
}
</script>

<style lang="scss" scoped>
.selectCalendar {
    --daySize: 36px;
    --selectColor: #3471ff;
    --operaSize: 22px;
    padding: 12px 0;
    border-radius: 4px;
    overflow: hidden;
    .titleBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc(93%);
        margin: 0 auto 12px;
        .time {
            font-weight: bold;
        }
        .opera {
            display: flex;
            .icon {
                user-select: none;
                display: block;
                height: var(--operaSize);
                width: var(--operaSize);
                line-height: var(--operaSize);
                border: 1px solid #999;
                text-align: center;
                justify-content: center;
                border-radius: 50%;
                cursor: pointer;
                &.next {
                    margin-left: 12px;
                }
                span {
                    color: #000;
                    height: calc(var(--operaSize) * 0.8);
                    display: block;
                    transform: scaleY(1.5);
                    position: relative;
                    top: -2px;
                }
            }
        }
    }
    .day {
        text-align: center;
        font-size: 14px;
        width: var(--daySize);
        height: var(--daySize);
        line-height: var(--daySize);
        border: 1px solid transparent;
        margin: 0 auto;
        cursor: pointer;
        &.select {
            color: var(--selectColor);
            position: relative;
            border-color: var(--selectColor);
            border-radius: 50%;
        }
    }
    :deep(.calendar_week__item) {
        text-align: center;
        min-height: 36px;
        font-size: 14px;
    }
}
</style>
