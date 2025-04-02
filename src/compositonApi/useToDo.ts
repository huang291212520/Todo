import { ref } from 'vue'
const toDoList = ref<todoItem[]>([])
const doneList = ref<todoItem[]>([])

interface todoItem {
    id: string
    isTop: boolean
    text: string
    time: number
    finished: boolean
}

const useToDo = () => {
    const createdId = () => {
        let id = ''
        for (var i = 1; i <= 32; i++) {
            var flag = Math.floor(Math.random() * 10)
            if (flag % 2 == 0) {
                var n = Math.floor(flag * 2.4) + 65
                var _n = String.fromCharCode(n)
                id += _n
            } else {
                id += flag
            }
        }
        return id
    }

    const setToDoTop = (id: string) => {
        const index = toDoList.value.findIndex((item) => item.id === id)
        toDoList.value[index].isTop = !toDoList.value[index].isTop
        sortTodoList()
        saveTodoList()
    }

    const sortTodoList = () => {
        let topList = toDoList.value.filter((item) => item.isTop)
        let normalList = toDoList.value.filter((item) => !item.isTop)
        normalList.sort((a, b) => a.time - b.time)
        toDoList.value = topList.concat(normalList)
    }

    const addToDo = (text: string) => {
        const todoObj = {
            id: createdId(),
            isTop: false,
            text,
            time: new Date().getTime(),
            finished: false
        }
        const list = toDoList.value
        list.push(todoObj)
        toDoList.value = list
        saveTodoList()
    }

    const deleteToDo = (id: string, type = 'undo') => {
        const index = toDoList.value.findIndex((item) => item.id === id)
        let list = type === 'undo' ? toDoList.value : doneList.value
        list.splice(index, 1)
        saveTodoList()
    }

    const editToDo = (id: string, text: string) => {
        const index = toDoList.value.findIndex((item) => item.id === id)
        let list = toDoList.value
        list[index].text = text
        toDoList.value = list
        saveTodoList()
    }

    const initToDoList = () => {
        const local = localStorage.getItem('toDoList')
        if (local) {
            let list: todoItem[] = JSON.parse(local || '[]')
            const _doneList = list.filter((item) => !item.finished)
            const _topDoneList: todoItem[] = [],
                normalList: todoItem[] = []
            _doneList.map((item) => {
                if (item.isTop) {
                    _topDoneList.push(item)
                } else {
                    normalList.push(item)
                }
            })
            toDoList.value = _topDoneList.concat(normalList)
            doneList.value = list.filter((item) => item.finished)
        }
    }

    const finishTodo = (id: string) => {
        const index = toDoList.value.findIndex((item) => item.id === id)
        let list = toDoList.value
        const item = list.splice(index, 1)
        item[0].finished = true
        doneList.value.push(item[0])
        toDoList.value = list
        saveTodoList()
    }

    const reToDo = (id: string) => {
        const index = doneList.value.findIndex((item) => item.id === id)
        let list = doneList.value
        const item = list.splice(index, 1)
        item[0].finished = false
        item[0].isTop = false
        toDoList.value.push(item[0])
        doneList.value = list
        saveTodoList()
    }

    const saveTodoList = () => {
        localStorage.setItem('toDoList', JSON.stringify(toDoList.value.concat(doneList.value)))
    }

    initToDoList()

    return {
        addToDo,
        finishTodo,
        reToDo,
        setToDoTop,
        deleteToDo,
        initToDoList,
        editToDo,
        toDoList,
        doneList
    }
}

export default useToDo
