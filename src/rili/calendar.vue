<template>
    <div class="calendar">
        <!-- 星期 -->
        <div class="calendar_week">
            <div class="calendar_week__item" v-for="week in weekList" :key="week.id">
                <slot name="week" :info="week">{{ week.weekName }}</slot>
            </div>
        </div>

        <!-- 日期 -->
        <div class="calendar_date">
            <div class="calendar_date__row" v-for="(row, index) in renderDateList" :key="index">
                <div class="calendar_date__item" v-for="(item, key) in row" :key="key">
                    <slot name="day" :info="item" v-if="showLastMonthDay || item.show">{{ item.day }}</slot>
                </div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export function formatDate(oldDate, fmt = 'YYYY-MM-DD hh:mm:ss', df) {
    if (oldDate) {
        let date
        if (oldDate === 32503564800000) {
            return '永久有效'
        }
        if (!Number.isNaN(Number(oldDate))) {
            date = new Date(Number(oldDate))
        } else {
            date = new Date(oldDate)
        }
        // 判断传参 是否是有效时间, 否则返回原值
        if (Number.isNaN(date.getTime())) {
            return oldDate
        }
        const o = {
            'M+': date.getMonth() + 1, // 月份
            'D+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        }
        if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
        // eslint-disable-next-line
        for (const k in o) {
            if (new RegExp(`(${k})`).test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
        }
        return fmt
    }
    return df !== undefined ? df : '-'
}

/** 星期汉字 */
const weekInChinese = ['日', '一', '二', '三', '四', '五', '六']
/** 月份验证正则 */
export const monthReg = new RegExp(/^([12]\d{3})-(0[1-9]|1[0-2])$/)
/** 月份类型 */
const MonthTypeEnum = {
    /** 当月 */
    NOW: 'NOW',
    /** 上月 */
    LAST: 'LAST',
    /** 下月 */
    NEXT: 'NEXT'
}

const YearMonthEnum = {
    YEAR: '1',
    MONTH: '2'
}
/**
 * 从YYYY-MM中获取年月方法
 * @param {YearMonthEnum} type 获取年还是月
 * @return {(yearMonth:String) => String} 获取年月方法
 */
const execYearMonth = (type) => {
    return (yearMonth) => {
        const monthInfo = monthReg.exec(yearMonth)
        if (!monthInfo) yearMonth = formatDate(Date.now(), 'YYYY-MM')
        return monthInfo[type]
    }
}

/**
 * 从YYYY-MM中获取月份
 * @param {String} yearMonth 'YYYY-MM'格式年月
 * @return {String} 'MM'格式月
 */
export const execMonth = (yearMonth) => {
    return execYearMonth(YearMonthEnum.MONTH)(yearMonth)
}

/**
 * 从YYYY-MM中获取年
 * @param {String} yearMonth 'YYYY-MM'格式年月
 * @return {String} 'YYYY'格式年
 */
export const execYear = (yearMonth) => {
    return execYearMonth(YearMonthEnum.YEAR)(yearMonth)
}

/**
 * 获取时间戳
 * @param time Date对象能识别的内容
 */
const getTamp = (time) => {
    const tamp = new Date(time).getTime()
    return isNaN(tamp) ? 0 : tamp
}

/**
 * 获取当月日期列表
 * @param {String} yearMonth 月份 '2023-01'
 * @param {MonthTypeEnum} monthType 月份类型
 * @return {[{
 * 		year: Number 年
 * 		month: Number 月
 * 		day: Number	日
 * 		yearMonth: String 年月拼接字符串
 * 		yearMonthDay: String 年月日拼接字符串
 * 		week: Number 星期几
 * 		weekName: String 星期几汉字
 * 		type: MonthTypeEnum	日期月份属性 当月/上月/下月
 * 		isToday: Boolean 是否是今天
 * }]} 日期列表
 */
const getMonthList = (yearMonth, monthType) => {
    const days = new Date(execYear(yearMonth), execMonth(yearMonth), 0).getDate() // 当前月有多少天
    const today = formatDate(Date.now(), 'YYYY-MM-DD')
    const list = []
    for (let i = 1; i <= days; i++) {
        const day = `${execYear(yearMonth)}-${execMonth(yearMonth)}-${String(i).padStart(2, '0')}`
        const week = new Date(day).getDay()
        list.push({
            year: Number(execYear(yearMonth)),
            month: Number(execMonth(yearMonth)),
            day: i,
            yearMonth,
            yearMonthDay: day,
            week,
            weekName: weekInChinese[week],
            type: monthType,
            isToday: today === day
        })
    }
    return list
}

export default {
    props: {
        /**
         * 显示上一个月的日期
         */
        showLastMonthDay: {
            type: Boolean,
            default: false
        },
        /** 第一天从星期几开始 */
        firstDayOfWeek: {
            type: Number,
            default: 0,
            validator: function (val) {
                return weekInChinese.map((item, index) => index).includes(val)
            }
        },
        /** 当前月份，格式必须是'YYYY-MM' */
        month: {
            type: String,
            default: () => {
                return formatDate(Date.now(), 'YYYY-MM')
            },
            validator: function (val) {
                return monthReg.test(val)
            }
        },
        /** 是否显示周末 */
        weekEndShow: {
            type: Boolean,
            default: true
        },
        /** 是否显示上月 */
        lastMonthShow: {
            type: Boolean,
            default: false
        },
        /** 是否显示下月 */
        nextMonthShow: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        /** 星期列表 */
        weekList() {
            const list = weekInChinese.map((item, index) => ({
                id: index,
                weekName: item
            }))
            return [...list.slice(this.firstDayOfWeek), ...list.slice(0, this.firstDayOfWeek)]
        },
        /** 上个月 */
        lastMonth() {
            const lastMonthTamp = getTamp(this.month) - 20 * 24 * 60 * 60 * 1000
            return formatDate(lastMonthTamp, 'YYYY-MM')
        },
        /** 下个月 */
        nextMonth() {
            const nextMonthTamp = getTamp(this.month) + 50 * 24 * 60 * 60 * 1000
            return formatDate(nextMonthTamp, 'YYYY-MM')
        },
        /** 这个月日历列表 */
        daysInMonth() {
            return getMonthList(this.month, MonthTypeEnum.NOW)
        },
        /** 上个月日历列表 */
        daysInLastMonth() {
            return getMonthList(this.lastMonth, MonthTypeEnum.LAST)
        },
        /** 下个月日历列表 */
        daysInNextMonth() {
            return getMonthList(this.nextMonth, MonthTypeEnum.NEXT)
        },
        /** 渲染日历列表 */
        renderDateList() {
            const firstWeekDay = new Date(this.month).getDay() // 这个月第一天星期几
            const lastMonthCount = this.weekList.findIndex((item) => item.id === firstWeekDay) // 上个月天数
            const lastMonthList = [...this.daysInLastMonth.slice(this.daysInLastMonth.length - lastMonthCount)]

            let dateList = [...lastMonthList, ...this.daysInMonth]
            const nextMonthCount = 7 - (dateList.length % 7) // 下个月天数
            const nextMonthList = [...this.daysInNextMonth.slice(0, nextMonthCount)]
            dateList = dateList.concat(nextMonthList) // 三个月合并列表

            const renderList = []
            for (let i = 1; i <= dateList.length / 7; i++) {
                // 每7天合并一行
                const rowList = []
                let hasShow = false
                this.weekList.forEach((week, index) => {
                    const dateIndex = index + 7 * (i - 1)
                    const dateItem = dateList[dateIndex]
                    dateItem.show = this.dateShow(dateItem)
                    if (dateItem.show) hasShow = true
                    rowList.push(dateItem)
                })
                if (hasShow) renderList.push(rowList)
            }
            return renderList
        }
    },
    methods: {
        dateShow({ type, week }) {
            const { weekEndShow, lastMonthShow, nextMonthShow } = this
            if (type === MonthTypeEnum.LAST && !lastMonthShow) return false
            if (type === MonthTypeEnum.NEXT && !nextMonthShow) return false
            if ([0, 6].includes(week) && !weekEndShow) return false
            return true
        }
    }
}
</script>

<style lang="less" scoped>
.calendar_week,
.calendar_date__row {
    display: flex;
    > div {
        width: calc(100% / 7);
    }
}
</style>

<!-- 
	使用方法：
	<calendar
		:firstDayOfWeek="1" // Number 第一天从星期几开始 0-6 0对应周日
		month="2023-01" // String 当前月份，格式必须是'YYYY-MM'
	>
		星期插槽：
		info: {
			id: Number 星期对应数字 0-6 0对应周日
			weekName: String 星期对应汉字 不含'星期'
		}
		<template v-slot:week="{info}">{{ info.weekName }}</template>

		日期插槽：
		info: {
	 		year: Number 年
	 		month: Number 月
	 		day: Number	日
	 		yearMonth: String 年月拼接字符串
	 		yearMonthDay: String 年月日拼接字符串
	 		week: Number 星期几
	 		weekName: String 星期几汉字
	 		type: MonthTypeEnum	日期月份属性 当月/上月/下月
	 		isToday: Boolean 是否是今天
	  }
		<template v-slot:day="{info}">{{ info.day + '-' + info.day }}</template>
	</calendar>
 -->
