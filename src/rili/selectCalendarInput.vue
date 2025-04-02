<template>
    <div class="selectCalendarInput">
        <div class="calendar-overlay" @click="hidePanel" v-show="showPanel"></div>
        <div class="inputer" @click.stop="showPanelFn">
            <img class="icon" :src="iconBase" alt="" />
            <div class="time">{{ valueText }}</div>
        </div>
        <selectcalendar
            v-model="valueText"
            class="calendarPanel"
            ref="calendarPanel"
            @select="hidePanel"
            :class="{ showAnimate: showAnimate, hideAnimate: hideAnimate }"
            v-if="showPanel"
        />
    </div>
</template>
<script>
import Selectcalendar from './selectcalendar.vue'
import { formatDate } from './calendar.vue'

export default {
    components: { Selectcalendar },
    data() {
        return {
            iconBase:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAn5JREFUSEvVVt1x2kAQ3hXwyIRUgHhj4G6MK4hdQeggdBBcQZwKQglOB6QCkwqC5w6GtygdKKNH/Wy0NzrNWRG2ZWtCvC+aOd3ttz/f/iCcSPBEuPD/A0sp10Q01FqfH4uSECJAxI1SavFYJJ/ssZSSWJlSqvaNEOICEW+J6LvW+qIR8Hg89rvd7gcA+Oth7ok5I6JNnVIiGnieNyOiEAC2lTubJEm+Hg6HwJ6X1k8mk1mn07kFgMFj1h4BBkRkw8y3RsI0TS/3+70xqrzBOQSA90R0h4grIiqtMxcR2ShWfHkEeOZ53pcsy/j9svQM0c+jsETEMwD4ppSaV4E5RG/SND23VrkABXGGx3LMaer1ej/rclxE8wcAhEqpt1XgB8nDjz3PG+TEqc0xK5NSzuM43rq5tMZXyemG+kHg5+TdffN6gIvcDaMouguCgHlgxPf9Qb/fP6ue8z+u6SRJAjfkjT2WUhrScf1qrUtG58o3OdPfAUCglBo5ubwBAO4FYRRFI2vsS4B/aa19C2BZDgC/lVJl7duy5HtxHI+s188BnhPRLMuytVtmHE7ucIi4VUpxDzBSsH+OiBwJ9t5IY+CXsvl1AnNY6xoHM76uWdSdNw61EGJb7bNFyRhWE9HWndFCiBUifmyD1aajEdE9Vtsy439u/3bKDNy+39hjKeUin1QLRLypsNSc54xf73a7lVNmzPZrnsla63JKNQb+Z6x2i74tUDsy3bSU08nJzUopddUWaEFEQzh3VpfA0+l0yRtEARgyW9sAR8SZXaeyLLuyfLi3HAkhrhHxUxuAVR1E9FlrzaQzUruV2W2jDQOyLAvrVqkn79VtGOHqOBnwH/x1yi7q/SW9AAAAAElFTkSuQmCC',
            showPanel: false,
            showAnimate: false,
            hideAnimate: false,

            valueText: ''
        }
    },
    props: {
        modelValue: {
            type: String
        }
    },
    watch: {
        modelValue: {
            handler(val) {
                if (new Date(val) === 'Invalid Date' || !val) {
                    this.valueText = formatDate(new Date(), 'YYYY-MM-DD')
                } else {
                    this.valueText = formatDate(new Date(val), 'YYYY-MM-DD')
                }
            },
            immediate: true
        }
    },
    methods: {
        hidePanel() {
            this.hideAnimate = true
            this.$emit('update:modelValue', this.valueText)
            this.$refs.calendarPanel.$el.addEventListener('animationend', () => {
                this.showPanel = false
                this.hideAnimate = false
            })
        },
        showPanelFn() {
            if (this.showPanel) {
                this.hidePanel()
            } else {
                this.showPanel = true
            }
            this.$nextTick(() => {
                this.showAnimate = true
                this.$refs?.calendarPanel?.$el?.addEventListener('animationend', () => {
                    this.showAnimate = false
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
@keyframes show {
    0% {
        opacity: 0;
        top: 50px;
    }
    100% {
        opacity: 1;
        top: 40px;
    }
}
@keyframes hide {
    0% {
        opacity: 1;
        top: 40px;
    }
    100% {
        opacity: 0;
        top: 50px;
    }
}
.showAnimate {
    animation: show 0.2s linear;
}
.hideAnimate {
    animation: hide 0.2s linear;
}
.calendar-overlay {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    left: 0;
    top: 0;
}
.selectCalendarInput {
    position: relative;
    .inputer {
        user-select: none;
        padding: 4px 12px;
        display: flex;
        align-items: center;
        border: 1px solid #a8abb2;
        width: max-content;
        border-radius: 3px;
        font-size: 14px;
        cursor: pointer;
        position: relative;
        z-index: 1001;
        .icon {
            position: relative;
            top: -1px;
            height: 16px;
            margin-right: 8px;
        }
    }
    .calendarPanel {
        position: absolute;
        z-index: 1002;
        left: 0;
        top: 40px;
        width: 320px;
        box-shadow: -1px 4px 11px rgba(0, 0, 0, 0.2);
    }
}
</style>
